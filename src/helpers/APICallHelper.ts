import axios from 'axios'

export default class ApiCall {
  protected freshdeskDomainUrl = ''
  protected freshdeskApiKey = ''

  constructor() {
    this.freshdeskDomainUrl = this.$store.$state.domainUrl
    this.freshdeskApiKey = this.$store.$state.apiKey
  }

  get(path: string) {
    return this.performCall('get', path)
  }

  static get(path: string) {
    return new this().get(path)
  }

  post(path: string, data: [Array, Object]) {
    return this.performCall('post', path, data)
  }

  static post(path: string, data: [Array, Object]) {
    return new this().post(path, data)
  }

  performCall(
    method: string,
    path: string,
    params: Object = [],
    typeOfContent: String = 'application/json'
  ) {
    const config = {
      method: method,
      url: this.freshdeskDomainUrl + path,
      headers: {
        Authorization: 'Bearer ' + this.freshdeskApiKey,
        'Content-Type': typeOfContent
      },
      params: params
    }

    let result = []

    axios(config)
      .then((response) => {
        result = response
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        return result
      })
  }
}

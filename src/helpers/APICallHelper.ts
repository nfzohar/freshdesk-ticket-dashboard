import axios from 'axios'
import { Store } from '@/stores'

export default class ApiCall {
  protected freshdeskDomainUrl = Store().domain

  protected freshdeskApiKey = Store().api_key

  get(path: string) {
    return this.performApiCall('get', path)
  }

  static get(path: string) {
    return new this().get(path)
  }

  post(path: string, data: [Array, Object]) {
    return this.performApiCall('post', path, data)
  }

  static post(path: string, data: [Array, Object]) {
    return new this().post(path, data)
  }

  performApiCall(
    method: string,
    path: string,
    params: Object = [],
    typeOfContent: String = 'application/json'
  ) {
    const config = {
      method: method,
      auth: {
        username: this.freshdeskApiKey,
        password: 'X'
      },
      headers: {
        'Content-Type': typeOfContent
      },
      params: params
    }

    if (this.freshdeskDomainUrl) {
      axios(this.freshdeskDomainUrl + path, config)
        .then((response) => {
          return response
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }
}

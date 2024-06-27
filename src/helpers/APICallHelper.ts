import axios from 'axios'
import { auth } from '../stores/auth'
import { useToast } from 'vue-toastification'

const toast = useToast()

export default class ApiCall {
  protected freshdeskDomainUrl = auth().domain
  protected freshdeskApiKey = auth().api_key

  get(path: string) {
    return this.performApiCall('get', path)
  }

  static get(path: string) {
    return new this().get(path)
  }

  post(path: string, data: [Object]) {
    return this.performApiCall('post', path, data)
  }

  static post(path: string, data: [Object]) {
    return new this().post(path, data)
  }

  async performApiCall(
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
      let results = await axios(this.freshdeskDomainUrl + path, config)
        .then((response) => {
          return response.data
        })
        .catch((e) => {
          toast.error('Data could not be loaded. Please try again.')
        })

      return results
    }
  }
}

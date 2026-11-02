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

  // Like get(), but resolves with the full response (so callers can read rate-limit
  // headers) and rejects on failure instead of swallowing it into a toast — for
  // callers that need to react to a specific failure (e.g. a 429) themselves.
  getWithResponse(path: string, params: any = []) {
    return this.performRawApiCall('get', path, params)
  }

  static getWithResponse(path: string, params: any = []) {
    return new this().getWithResponse(path, params)
  }

  performRawApiCall(
    method: string,
    path: string,
    params: any = [],
    typeOfContent: string = 'application/json'
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

    // Not configured yet: resolve to nothing rather than issue a bad request.
    if (!this.freshdeskDomainUrl) {
      return Promise.resolve(undefined)
    }

    return axios(this.freshdeskDomainUrl + path, config)
  }

  async performApiCall(
    method: string,
    path: string,
    params: any = [],
    typeOfContent: string = 'application/json'
  ) {
    try {
      const response = await this.performRawApiCall(method, path, params, typeOfContent)
      return response?.data
    } catch (e: any) {
      const errorData = e.toJSON ? e.toJSON() : e

      errorData.message
        ? toast.error(errorData.message || 'Data could not be loaded. Please try again.')
        : toast.error('Connection timeout, too many requests. Please try again in a few minutes.', {
            timeout: 60000
          })
    }
  }
}

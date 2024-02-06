import axios from 'axios'
import { get, snakeCase, mapKeys } from 'lodash'
import toast from 'react-hot-toast'
import recursiveFunc from './recursiveFunc'

export function createApiClient(baseURL: string, headers: Record<string, string>) {
  const apiClient = axios.create({
    baseURL,
    headers,
  })

  apiClient.interceptors.request.use(async function (config: any) {
    // Add params
    if (get(config, 'data')) {
      config.data = recursiveFunc(mapKeys)(config.data, (_: string, k: any) => snakeCase(k))
    }

    if (get(config, 'params')) {
      config.params = recursiveFunc(mapKeys)(config.params, (_: string, k: any) => snakeCase(k))
    }

    return config
  })

  // Handle responses
  apiClient.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger

      // if error is 500 or above, show toast
      if (get(error, 'response.status') >= 500) {
        toast.error(get(error, 'message', 'Something went wrong'))
      }
      return Promise.reject(error)
    }
  )

  return apiClient
}

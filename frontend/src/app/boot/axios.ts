import { defineBoot } from '#q-app/wrappers'
import axios, { AxiosInstance } from 'axios'
import {
  // ARCHIVARIUS_API_ENDPOINT,
  API_PROD_ENDPOINT,
  API_DEV_ENDPOINT,
  PRODUCTION_NAME
} from 'shared/config'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

const getBaseUrl = (catalogChanel: string) => {
  return catalogChanel === PRODUCTION_NAME
    ? API_PROD_ENDPOINT
    : API_DEV_ENDPOINT
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const instance = axios.create({
  baseURL: getBaseUrl(PRODUCTION_NAME),
  timeout: 25000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(
  (config) => {
    if (!navigator.onLine) {
      return Promise.reject(new Error('No internet connection'))
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject(new Error('No internet connection'))
    }
    return Promise.reject(error)
  }
)

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$instance = instance
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axios, instance, getBaseUrl }

import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import {
  ARCHIVARIUS_API_ENDPOINT,
  API_PROD_ENDPOINT,
  API_DEV_ENDPOINT
} from 'shared/config'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

let API_ENDPOINT = ARCHIVARIUS_API_ENDPOINT
if (localStorage.getItem('catalogChannel') !== null) {
  if (localStorage.getItem('catalogChannel') === 'production') {
    API_ENDPOINT = API_PROD_ENDPOINT
  } else {
    API_ENDPOINT = API_DEV_ENDPOINT
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const instance = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 25000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$instance = instance
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { instance }

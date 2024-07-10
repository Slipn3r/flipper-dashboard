import { Notify } from 'quasar'

import { instance } from 'boot/axios'
import { camelCaseDeep } from 'shared/lib/utils/camelCaseDeep'

import type { AppsShortParams, App, GetAppParams } from '../model'

let controller: AbortController | undefined = undefined
async function fetchAppsShort(
  params: AppsShortParams = {
    limit: 50,
    offset: 0,
    sort_by: 'created_at',
    sort_order: 1
  }
) {
  if (controller) controller.abort()
  controller = new AbortController()

  return await instance
    .get('/0/application', {
      params,
      signal: controller.signal
    })
    .then(({ data }) => {
      return data.map((app: App) => {
        // app.action = defaultAction
        return camelCaseDeep(app)
      })
    })
    .catch((error) => {
      if (error.code !== 'ERR_CANCELED') {
        if (error.response.status >= 400) {
          throw new Error(
            'Failed to fetch applications (' + error.response.status + ')'
          )
        }
      }
    })
}

async function fetchAppById(params: GetAppParams) {
  const _params = {
    is_latest_release_version: params.is_latest_release_version,
    api: params.api,
    target: params.target
  }

  if (!_params.target) {
    delete _params.target
  }
  if (!_params.api) {
    delete _params.api
  }
  return await instance
    .get(`/application/${params.id}`, { params: _params })
    .then(({ data }) => {
      // data.action = defaultAction
      return camelCaseDeep(data)
    })
    .catch((err) => {
      const data = err.response.data

      Notify.create({
        type: 'negative',
        message: data.detail.details
      })

      return data
    })
}

export const api = {
  fetchAppsShort,
  fetchAppById
}

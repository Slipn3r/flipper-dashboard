import { Notify } from 'quasar'

import { instance } from 'boot/axios'
import { camelCaseDeep } from 'shared/lib/utils/camelCaseDeep'

import type {
  AppsShortParams,
  AppsPostShortParams,
  AppFapParams,
  App,
  GetAppParams,
  AppVersion
} from '../model'

let controller: AbortController | undefined = undefined
async function fetchAppsShort(params: Partial<AppsShortParams> = {}) {
  const defaultParams: AppsShortParams = {
    limit: 48,
    offset: 0,
    sort_by: 'updated_at',
    sort_order: -1
  }

  const mergedParams = { ...defaultParams, ...params }

  if (controller) controller.abort()
  controller = new AbortController()

  return await instance
    .get('/0/application', {
      params: mergedParams,
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
          throw error
        }
      }
    })
}

async function fetchPostAppsShort(params: AppsPostShortParams) {
  params.applications = params.applications?.filter((u) => u.trim())

  return await instance.post('/1/application', params).then(({ data }) =>
    data.map((app: App) => {
      // app.action = {
      //   type: '',
      //   progress: 0,
      //   id: app.id
      // }
      return camelCaseDeep(app)
    })
  )
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

async function fetchAppsVersions(uids: string[]) {
  const allVersions: AppVersion[] = []
  uids = uids.filter((u) => u.trim())

  if (uids) {
    const size = 100
    const subUids = []

    for (let i = 0; i < Math.ceil(uids.length / size); i++) {
      subUids[i] = uids.slice(i * size, i * size + size)
    }

    for (const sliceUids of subUids) {
      await instance
        .post('/1/application/versions', {
          application_versions: sliceUids,
          limit: size
        })
        .then(({ data }) => allVersions.push(...data))
        .catch((err) => {
          const data = err.response.data

          Notify.create({
            type: 'negative',
            message: data.detail.details
          })

          return data
        })
    }
  } else {
    await instance
      .post('/1/application/versions', {
        limit: 500
      })
      .then(({ data }) => allVersions.push(...data))
      .catch((err) => {
        const data = err.response.data

        Notify.create({
          type: 'negative',
          message: data.detail.details
        })

        return data
      })
  }

  return allVersions.map((version) => camelCaseDeep(version))
}

async function fetchAppFap(params: AppFapParams) {
  return await instance
    .get(`/application/version/${params.versionId}/build/compatible`, {
      params: {
        target: params.target,
        api: params.api
      },
      responseType: 'arraybuffer'
    })
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      const decoder = new TextDecoder('utf-8')
      const data = JSON.parse(decoder.decode(error.response.data)).detail
      if (data.code >= 400) {
        throw new Error('Failed to fetch application build (' + data.code + ')')
      }

      throw new Error('Failed to fetch application build')
    })
}

async function submitAppReport({
  id,
  report
}: {
  id: string
  report: {
    description: string
    description_type: string
  }
}) {
  return instance.post(`/application/${id}/issue`, {
    ...report
  })
}

export const api = {
  fetchAppsShort,
  fetchPostAppsShort,
  fetchAppById,
  fetchAppsVersions,
  fetchAppFap,
  submitAppReport
}

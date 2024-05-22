import semver from 'semver'
import { axios, api } from 'boot/axios'
import { camelCaseDeep, unpack, ungzip } from 'util/util'
import { Notify } from 'quasar'

const defaultAction = {
  type: '',
  progress: 0,
  id: ''
}

async function fetchChannels (target) {
  return await axios
    .get('https://update.flipperzero.one/firmware/directory.json')
    .then(({ data }) => {
      const release = data.channels.find((e) => e.id === 'release')
      const rc = data.channels.find((e) => e.id === 'release-candidate')
      const dev = data.channels.find((e) => e.id === 'development')
      const params = new URLSearchParams(location.search)
      const customSource = {
        url: params.get('url'),
        channel: params.get('channel'),
        version: params.get('version'),
        target: params.get('target')
      }

      function formatChannel (channel) {
        channel.versions.sort((a, b) => {
          if (semver.lt(a.version, b.version)) return 1
          else return -1
        })
        const output = {
          version: '',
          date: '',
          url: '',
          files: [],
          changelog: ''
        }
        const updater = channel.versions[0].files.find(
          (file) => file.target === 'f' + target && file.type === 'update_tgz'
        )
        if (updater) {
          output.url = updater.url
        }
        output.version = channel.versions[0].version
        output.date = new Date(channel.versions[0].timestamp * 1000)
          .toISOString()
          .slice(0, 10)
        output.files = channel.versions[0].files.sort((a, b) => {
          if (a.url.match(/[\w.]+$/g)[0] > b.url.match(/[\w.]+$/g)[0]) return 1
          else return -1
        })
        output.changelog = channel.versions[0].changelog
        return output
      }

      const releaseChannel = formatChannel(release)
      const rcChannel = formatChannel(rc)
      const devChannel = formatChannel(dev)

      let customChannel
      if (customSource.url) {
        customChannel = {
          channel: customSource.channel,
          version: customSource.version,
          date: new Date().toISOString().slice(0, 10),
          url: customSource.url,
          files: [
            {
              url: customSource.url,
              type: 'update_tgz',
              target: customSource.target
            }
          ]
        }
      }
      return {
        release: releaseChannel,
        rc: rcChannel,
        dev: devChannel,
        custom: customChannel
      }
    })
    .catch(({ status }) => {
      if (status >= 400) {
        throw new Error('Failed to fetch firmware channels (' + status + ')')
      }
    })
}

async function fetchFirmware (url) {
  return await axios
    .get(url, { responseType: 'arraybuffer' })
    .then(async ({ data }) => {
      return unpack(data)
    })
    .catch((error) => {
      const decoder = new TextDecoder('utf-8')
      const data = JSON.parse(decoder.decode(error.response.data)).detail
      if (data.code >= 400) {
        throw new Error('Failed to fetch firmware (' + data.code + ')')
      }
    })
}

async function fetchFirmwareTar (url) {
  return await axios
    .get(url, { responseType: 'arraybuffer' })
    .then(({ data }) => {
      return ungzip(data)
    })
    .catch((error) => {
      const decoder = new TextDecoder('utf-8')
      const data = JSON.parse(decoder.decode(error.response.data)).detail
      if (data.code >= 400) {
        throw new Error('Failed to fetch firmware (' + data.code + ')')
      }
    })
}

async function fetchRegions () {
  return axios
    .get('https://update.flipperzero.one/regions/api/v0/bundle')
    .then(({ data }) => {
      if (data.error) {
        throw new Error(data.error.text)
      } else if (data.success) {
        return data.success
      }
    })
    .catch(({ status }) => {
      if (status >= 400) {
        throw new Error('Failed to fetch region (' + status + ')')
      }
    })
}

async function fetchCategories (params) {
  return await api.get('/category', { params }).then(({ data }) => {
    return data.map((category) => camelCaseDeep(category))
  })
}

async function fetchPostAppsShort (params) {
  return await api.post('/1/application', params)
    .then(res => res.data.map(app => {
      app.action = {
        type: '',
        progress: 0,
        id: app.id
      }
      return camelCaseDeep(app)
    }))
}

let controller = null
async function fetchAppsShort (params) {
  if (controller) controller.abort()
  controller = new AbortController()

  return await api.get('/0/application', {
    params,
    signal: controller.signal
  }).then(({ data }) => {
    return data.map((app) => {
      app.action = defaultAction
      return camelCaseDeep(app)
    })
  }).catch((error) => {
    if (error.code !== 'ERR_CANCELED') {
      if (error.response.status >= 400) {
        throw new Error('Failed to fetch applications (' + error.response.status + ')')
      }
    }
  })
}

async function fetchAppById (id, params) {
  if (!params.target) {
    delete params.target
  }
  if (!params.api) {
    delete params.api
  }
  return await api.get(`/application/${id}`, { params }).then(({ data }) => {
    data.action = defaultAction
    return camelCaseDeep(data)
  }).catch((err) => {
    const data = err.response.data

    Notify.create({
      type: 'negative',
      message: data.detail.details
    })

    return data
  })
}

async function fetchAppFap (params) {
  return await api
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
    })
}

async function fetchAppsVersions (uids) {
  const allVersions = []
  uids = uids.filter(u => u.trim())

  if (uids) {
    const size = 100
    const subUids = []

    for (let i = 0; i < Math.ceil(uids.length / size); i++) {
      subUids[i] = uids.slice(i * size, i * size + size)
    }

    for (const sliceUids of subUids) {
      await api
        .post('/1/application/versions', {
          application_versions: sliceUids,
          limit: size
        })
        .then(({ data }) => allVersions.push(...data))
    }
  } else {
    await api
      .post('/1/application/versions', {
        limit: 500
      })
      .then(({ data }) => allVersions.push(...data))
  }

  const versions = allVersions.map((version) => camelCaseDeep(version))
  return versions
}

async function submitAppReport (id, report) {
  return api.post(`/application/${id}/issue`, {
    ...report
  })
}

export {
  fetchChannels,
  fetchFirmware,
  fetchFirmwareTar,
  fetchRegions,
  fetchCategories,
  fetchPostAppsShort,
  fetchAppsShort,
  fetchAppById,
  fetchAppFap,
  fetchAppsVersions,
  submitAppReport
}

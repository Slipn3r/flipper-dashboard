import { instance } from 'boot/axios'
import { unpack } from 'shared/lib/utils/unpack'
// import { Channel } from '../model/types'

async function fetchChannels (/* target: string */) {
  return await instance
    .get('https://update.flipperzero.one/firmware/directory.json')
    .then(({ data }) => {
      return data.channels
    })
    .catch((err) => {
      const data = err.response.data

      console.error(err)

      return data
    })
}

async function fetchRegions () {
  return await instance
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

async function fetchFirmware (url: string) {
  return await instance
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


export const api = {
  fetchChannels,
  fetchRegions,
  fetchFirmware
}

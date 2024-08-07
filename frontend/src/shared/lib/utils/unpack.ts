import { untar } from './untar/untar.js'
import pako from 'pako'

const ungzip = (buffer: ArrayBuffer) => {
  return pako.ungzip(new Uint8Array(buffer))
}

export const unpack = (buffer: ArrayBuffer) => {
  const ungzipped = ungzip(buffer)
  return untar(ungzipped.buffer)
}

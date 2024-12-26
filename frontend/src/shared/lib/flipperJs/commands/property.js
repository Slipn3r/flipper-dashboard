import { createRPCPromise, mergeDeep, expand } from '../util'

function get ({ key }) {
  function format (chunks) {
    const accumulator = {}
    let result = {}
    for (const chunk of chunks) {
      if (chunk.key) {
        accumulator[chunk.key] = chunk.value
      }
    }
    for (const line of Object.keys(accumulator)) {
      const expanded = expand(line, '.', accumulator[line])
      result = mergeDeep(result, expanded)
    }
    return result
  }
  return createRPCPromise.bind(this)('propertyGetRequest', { key }, format)
}

export {
  get
}

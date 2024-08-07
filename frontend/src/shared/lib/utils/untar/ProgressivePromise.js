/**
Returns a Promise decorated with a progress() event.
*/
export function ProgressivePromise (fn) {
  if (typeof Promise !== 'function') {
    throw new Error('Promise implementation not available in this environment.')
  }

  const progressCallbacks = []
  const progressHistory = []

  function doProgress (value) {
    for (let i = 0, l = progressCallbacks.length; i < l; ++i) {
      progressCallbacks[i](value)
    }

    progressHistory.push(value)
  }

  const promise = new Promise(function (resolve, reject) {
    fn(resolve, reject, doProgress)
  })

  promise.progress = function (cb) {
    if (typeof cb !== 'function') {
      throw new Error('cb is not a function.')
    }

    // Report the previous progress history
    for (let i = 0, l = progressHistory.length; i < l; ++i) {
      cb(progressHistory[i])
    }

    progressCallbacks.push(cb)
    return promise
  }

  const origThen = promise.then

  promise.then = function (onSuccess, onFail, onProgress) {
    origThen.call(promise, onSuccess, onFail)

    if (onProgress !== undefined) {
      promise.progress(onProgress)
    }

    return promise
  }

  return promise
}

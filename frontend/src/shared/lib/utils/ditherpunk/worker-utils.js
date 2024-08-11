export function MessageStream () {
  return new ReadableStream({
    start (controller) {
      self.addEventListener('message', ev => controller.enqueue(ev.data))
    }
  })
}

export function message (worker, id) {
  return new Promise(resolve => {
    worker.addEventListener('message', function f ({ data }) {
      if (data.id !== id) {
        return
      }
      worker.removeEventListener('message', f)
      resolve(data)
    })
  })
}

export function uid () {
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 256).toString(16)
  ).join('')
}

export function nextEvent (target, name) {
  return new Promise(resolve =>
    target.addEventListener(name, resolve, { once: true })
  )
}

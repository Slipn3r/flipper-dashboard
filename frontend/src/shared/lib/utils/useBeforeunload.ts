const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
  // Recommended
  event.preventDefault()

  // Included for legacy support, e.g. Chrome/Edge < 119
  event.returnValue = true
}

const beforeunloadActive = () => {
  window.addEventListener('beforeunload', beforeUnloadHandler)
}

const beforeunloadDeactivate = () => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)
}

export { beforeunloadActive, beforeunloadDeactivate }

// import showNotif from 'composables/useShowNotif'
import { log } from './useLog'

const rpcErrorHandler = ({
  componentName,
  error,
  command
}: {
  componentName: string
  error: Error | ErrorEvent
  command: string
}) => {
  const errorString = error.toString()
  /* showNotif({
    message: `RPC error in command '${command}': ${errorString}`,
    color: 'negative'
  }) */
  log({
    level: 'error',
    message: `${componentName}: RPC error in command '${command}': ${errorString}`
  })
}

export { rpcErrorHandler }

// import showNotif from 'composables/useShowNotif'
import { logger } from './useLog'

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
  logger.error({
    context: componentName,
    message: `RPC error in command '${command}': ${errorString}`
  })
}

export { rpcErrorHandler }

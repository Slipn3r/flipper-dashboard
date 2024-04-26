import * as loglevel from 'loglevel'
import { ref } from 'vue'

const logger = loglevel
const history = ref([])

const log = ({ level, message }) => {
  const timestamp = Date.now()
  const t = new Date(timestamp)
  history.value.push({
    level,
    timestamp,
    time: `${t.getHours().toString().padStart(2, 0)}:${t.getMinutes().toString().padStart(2, 0)}:${t.getSeconds().toString().padStart(2, 0)}`,
    message
  })
  switch (level) {
    case 'error':
      logger.error(message)
      break
    case 'warn':
      logger.warn(message)
      break
    case 'info':
      logger.info(message)
      break
    case 'debug':
      logger.debug(message)
      break
  }
}

export { logger, history, log }

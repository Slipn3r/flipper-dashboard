import {
  error,
  warn,
  info,
  debug,
  setLevel,
  getLevel,
  methodFactory
} from 'loglevel'
import { ref } from 'vue'

const logger = {
  setLevel,
  getLevel,
  methodFactory
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug'

type History = {
  level: LogLevel
  timestamp: ReturnType<typeof Date.now>
  time: string
  message: string
}
const history = ref<History[]>([])

const log = ({
  level,
  message
}: {
  level: History['level']
  message: History['message']
}) => {
  const timestamp = Date.now()
  const t = new Date(timestamp)
  history.value.push({
    level,
    timestamp: Date.now(),
    time: `${t.getHours().toString().padStart(2, '0')}:${t
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}`,
    message
  })
  switch (level) {
    case 'error':
      error(message)
      break
    case 'warn':
      warn(message)
      break
    case 'info':
      info(message)
      break
    case 'debug':
      debug(message)
      break
  }
}

export { logger, history, log }

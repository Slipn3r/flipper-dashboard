import log from 'loglevel'
import { ref } from 'vue'

type LogLevel = log.LogLevelNames

type History = {
  level: LogLevel
  timestamp: ReturnType<typeof Date.now>
  time: string
  context: string
  message: string
}
const history = ref<History[]>([])

const isElectron = !!window.logger

type LogParams = {
  context?: string
  message: string
}
class Logger {
  private log(
    level: log.LogLevelNames,
    { message, context = 'General' }: LogParams
  ) {
    if (isElectron) {
      window.logger.log(level, message, context)
    }

    log[level](message, { context })

    const timestamp = Date.now()
    const t = new Date(timestamp)
    history.value.push({
      level,
      timestamp: Date.now(),
      time: `${t.getHours().toString().padStart(2, '0')}:${t
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}`,
      context,
      message
    })
  }

  info(params: LogParams) {
    this.log('info', params)
  }

  debug(params: LogParams) {
    this.log('debug', params)
  }

  warn(params: LogParams) {
    this.log('warn', params)
  }

  error(params: LogParams) {
    this.log('error', params)
  }

  setLevel(level: log.LogLevelDesc, persist?: boolean) {
    return log.setLevel(level, persist)
  }

  getLevel() {
    return log.getLevel()
  }

  methodFactory(
    methodName: log.LogLevelNames,
    level: log.LogLevelNumbers,
    loggerName: string | symbol
  ) {
    return log.methodFactory(methodName, level, loggerName)
  }
}

const logger = new Logger()

export { logger, history, type LogLevel }

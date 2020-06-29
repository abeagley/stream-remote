import * as log from 'loglevel'

if (process.env.NODE_ENV !== 'development') {
  log.setDefaultLevel('silent')
} else {
  log.setDefaultLevel('trace')
}

export default log

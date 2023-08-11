import * as C from '@/libs/commons/constants'

const fndbug = console.log
const fnwarn = console.warn
const fnerrr = console.error

const log = {
  trace: C.FN_NIL,
  debug: fndbug,
  warn: fnwarn,
  error: fnerrr
}

export { log }
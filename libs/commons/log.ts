const fnnull = (...arg: any[]) => { }
const fndbug = console.log
const fnwarn = console.warn
const fnerrr = console.error

const log = {
  trace: fnnull,
  debug: fndbug,
  warn: fnwarn,
  error: fnerrr
}

export { log }
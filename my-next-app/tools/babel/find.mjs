import { readFileSync, readdirSync, statSync, } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const dir = dirname(dirname(dirname(fileURLToPath(import.meta.url))))

const FIND = 'ownerState'

const MAX_DEPTH = 10

const findFiles = (dir, depth = 0) => {
  const list = readdirSync(`${dir}`)
  for (const file of list) {
    const fpath = `${dir}/${file}`
    const fstat = statSync(fpath)
    const isdir = (fstat.mode == 16877)
    if (isdir && depth < MAX_DEPTH) {
      if ([ ].indexOf(file) !== -1) { continue }
      findFiles(fpath, depth + 1)
    } else {
      const txt = String(readFileSync(fpath))
      if (txt.indexOf(FIND) !== -1) {
        console.log('FIND:', fpath)
      }
    }
  }
}

findFiles(`${dir}/node_modules`)

/**
 * @File        : removeresolve.mjs
 * @Author      : 정재백
 * @Since       : 2024-09-10
 * @Description : package-lock 중에서 resolved 항목을 삭제해 주는 툴
 * @Site        : https://devlog.ntiple.com
 **/
import { readFileSync, readdirSync, statSync, writeFileSync, } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const dir = dirname(dirname(dirname(fileURLToPath(import.meta.url))))

const MAX_DEPTH = 2

const findFiles = (dir, depth = 0) => {
  const list = readdirSync(`${dir}`)
  for (const file of list) {
    const fpath = `${dir}/${file}`
    const fstat = statSync(fpath)
    const isdir = (fstat.mode == 16877)
    if (['node_modules', '.next', 'dist'].indexOf(file) !== -1) { continue }
    if (isdir && depth < MAX_DEPTH) {
      if ([ ].indexOf(file) !== -1) { continue }
      findFiles(fpath, depth + 1)
    } else if (file === 'package-lock.json') {
      console.log('FILE:', fpath)
      let content = String(readFileSync(fpath))
      content = content.replace(/[ \t\r\n]*"resolved":.*[,]?([ \t\r\n]*)/gm, '$1')
      writeFileSync(fpath, content)
    }
  }
}

[ `${dir}` ].map(v => findFiles(v))

/**
 * @File        : find.mjs
 * @Author      : 정재백
 * @Since       : 2024-09-10
 * @Description : 프로젝트 폴더 내 특정 문자열을 가진 파일을 검색해 주는 툴
 * @Site        : https://devlog.ntiple.com
 **/
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

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
/** 현재 폴더 위치 */
const dir = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
/** 찾을 단어 */
const FIND = (process?.argv?.at && process.argv.at(2)) || ''
/** 폴더 탐색 한계 */
const MAX_DEPTH = 10
/** 찾기 함수 */
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

if (FIND) {
  /** node_modules 폴더의 내용을 확인한다 */
  findFiles(`${dir}/node_modules`)
} else {
  console.log('USAGE: node find.mjs {word}')
}

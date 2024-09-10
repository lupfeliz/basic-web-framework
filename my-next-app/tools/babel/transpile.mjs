/**
 * @File        : transpile.mjs
 * @Author      : 정재백
 * @Since       : 2024-09-10
 * @Description : babel을 이용한 node_modules 선 transpile tool
 *                필요한 모듈만 미리 transpile 시켜 놓는다
 * @Site        : https://devlog.ntiple.com
 **/
import { existsSync, statSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { basename, dirname, parse } from 'path'
import { fileURLToPath } from 'url'
import md5 from 'md5'
import babel from '@babel/core'

const dir = dirname(dirname(dirname(fileURLToPath(import.meta.url))))

const MAX_DEPTH = 10
const WORKLIST = []

const findFiles = (dir, depth = 0) => {
  const list = readdirSync(`${dir}`)
  for (const file of list) {
    const fpath = `${dir}/${file}`
    const fstat = statSync(fpath)
    const isdir = (fstat.mode == 16877)
    if (isdir && depth < MAX_DEPTH) {
      if ([ ].indexOf(file) !== -1) { continue }
      findFiles(fpath, depth + 1)
    } else if (/(\.js|\.cjs|\.mjs)$/.test(file)) {
      WORKLIST.push(fpath)
    }
  }
}

const convert = (path) => {
  let doTrans = true
  try {
    const hashpath = `${dirname(path)}/.${basename(path)}.hash`
    const src = readFileSync(path)
    if (existsSync(hashpath)) {
      const hash1 = md5(src)
      const hash2 = String(readFileSync(hashpath))
      // console.log('CHECK:', basename(path), hash1, hash2)
      if (hash1 == hash2) { doTrans = false }
    }
    if (doTrans) {
      console.log('TRANSPILE:', path)
      const out = babel.transformSync(src, {
        plugins: [
          '@babel/plugin-transform-nullish-coalescing-operator',
          '@babel/plugin-proposal-optional-catch-binding',
          '@babel/plugin-transform-optional-chaining',
          '@babel/plugin-transform-logical-assignment-operators',
        ]
      })
      writeFileSync(path, out.code)
      writeFileSync(hashpath, md5(out.code))
    }
  } catch (e) {
    console.log('CANNOT CONVERT: ', path)
  }
}

[
  `${dir}/node_modules/ag-grid-community`,
  `${dir}/node_modules/ag-grid-react`,
  `${dir}/node_modules/@reduxjs`,
  `${dir}/node_modules/redux`,
  `${dir}/node_modules/immer`,
  `${dir}/node_modules/reselect`,
  `${dir}/node_modules/redux-thunk`,
  `${dir}/node_modules/react-redux`,
  `${dir}/node_modules/@mui`,
  `${dir}/node_modules/@floating-ui`,
  `${dir}/node_modules/@popperjs`,
  `${dir}/node_modules/@emotion`,
  `${dir}/node_modules/clsx`,
  `${dir}/node_modules/prop-types`,
  `${dir}/node_modules/react-is`,
].map(v => findFiles(v))

// WORKLIST.push(`${dir}/dist/_next/static/chunks/941-41f6770e9314edcd.js`)
WORKLIST.map(v => convert(v))

/**
npm uninstall ag-grid-community; npm install ag-grid-community@32.1.0
npm uninstall ag-grid-react; npm install ag-grid-react@32.1.0
 **/
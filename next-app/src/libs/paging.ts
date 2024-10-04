/**
 * @File        : paging.ts
 * @Author      : 정재백
 * @Since       : 2023-09-08
 * @Description : 페이징 계산 모듈
 * @Site        : https://devlog.ntiple.com
 **/

import log from './log'

const ROWS_DEF = 10
const PAGES_DEF = 5
class Paging {
  rowCount = ROWS_DEF
  pageCount = PAGES_DEF
  rowTotal = 0
  constructor(rowCount?: string | number, pageCount?: string | number, rowTotal?: string | number) {
    rowCount = Number(rowCount)
    pageCount = Number(pageCount)
    rowTotal = Number(rowTotal)
    if (isNaN(rowCount)) { rowCount = ROWS_DEF }
    if (isNaN(pageCount)) { pageCount = PAGES_DEF }
    if (isNaN(rowTotal)) { rowTotal = 0 }
    this.rowCount = rowCount
    this.pageCount = pageCount
    this.rowTotal = rowTotal
  }

  rowNumbers(pn: string | number) {
    pn = Number(pn)
    if (isNaN(pn)) { pn = 1 }
    if (pn < 1) { pn = 1 }
    let rns = (pn - 1) * this.rowCount + 1
    let rne = rns + this.rowCount
    if (rne > this.rowTotal) { rne = this.rowTotal }
    return [rns, rne]
  }

  pageNumbers(pn: string | number) {
    pn = Number(pn)
    if (isNaN(pn)) { pn = 1 }
    if (pn < 1) { pn = 1 }
    let mod = 0
    const pnt = Math.ceil(this.rowTotal / this.rowCount)
    // if (pn > this.pages) { mod = (pn - 1) %  this.pages }
    mod = (pn - 1) %  this.pageCount
    let pns = pn - mod
    let pne = pns + this.pageCount - 1
    if (pne > pnt) { pne = pnt }
    return [pns, pne, pnt]
  }
}

export default Paging
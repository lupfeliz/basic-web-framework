import { log } from '@/libs/commons/log'

const ROWS_DEF = 10
const PAGES_DEF = 5
class Paging {
  rows = ROWS_DEF
  pages = PAGES_DEF
  tot = 0
  constructor(rows?: string | number, pages?: string | number, tot?: string | number) {
    rows = Number(rows)
    pages = Number(pages)
    tot = Number(tot)
    if (isNaN(rows)) { rows = ROWS_DEF }
    if (isNaN(pages)) { pages = PAGES_DEF }
    if (isNaN(tot)) { tot = 0 }
    this.rows = rows
    this.pages = pages
    this.tot = tot
  }

  rnums(pn: string | number) {
    pn = Number(pn)
    if (isNaN(pn)) { pn = 1 }
    if (pn < 1) { pn = 1 }
    let rns = (pn - 1) * this.rows + 1
    let rne = rns + this.rows
    if (rne > this.tot) { rne = this.tot }
    return [rns, rne]
  }

  pnums(pn: string | number) {
    pn = Number(pn)
    if (isNaN(pn)) { pn = 1 }
    if (pn < 1) { pn = 1 }
    let mod = 0;
    const pnt = Math.ceil(this.tot / this.rows)
    // if (pn > this.pages) { mod = (pn - 1) %  this.pages }
    mod = (pn - 1) %  this.pages
    let pns = pn - mod
    let pne = pns + this.pages - 1
    if (pne > pnt) { pne = pnt }
    return [pns, pne]
  }
}

export { Paging }
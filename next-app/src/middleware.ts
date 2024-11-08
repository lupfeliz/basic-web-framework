/**
 * @File        : middleware.ts
 * @Version     : $Rev$
 * @Author      : 정재백
 * @History     : 2024-11-09 최초 작성
 * @Description : 미들웨어 정의
 **/
import * as C from '@/libs/constants'
import log from '@/libs/log'
import { NextResponse } from 'next/server'
import { NextFetchEvent, NextRequest } from 'next/server'

export const middleware = async (req: NextRequest, event: NextFetchEvent) => {
  let ret:NextResponse<any> = C.UNDEFINED
  // log.debug('MIDDLEWARE:', req.nextUrl.pathname)
  ret = NextResponse.next()
  return ret
}
/**
 * @File        : devtools/route.ts
 * @Author      : 정재백
 * @Since       : 2024-10-25
 * @Description : 개발자 서버모듈
 * @Site        : https://devlog.ntiple.com
 **/
import { NextRequest, NextResponse } from 'next/server'
const process = async (req: NextRequest) => {
  const res = { status: 200, data: 'OK' }
  let ret = new NextResponse(res?.data || '', { status: res?.status || 404 })
  return ret
}
export const POST = async (req: NextRequest) => await process(req)
export const GET = async (req: NextRequest) => new Response('')
/** 빌드오류 방지용 */
export const dynamic = 'force-static'
export const revalidate = 0
/* @ts-ignore */
/* eslint-disable no-alert, no-console */
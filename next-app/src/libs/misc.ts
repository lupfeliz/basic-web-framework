/**
 * @File        : misc.ts
 * @Author      : 정재백
 * @Since       : 2024-10-27
 * @Description : 각종 사소한 유틸들
 * @Site        : https://devlog.ntiple.com
 **/

const types = {
  isServer: () => typeof window === 'undefined',
  isClient: () => typeof window !== 'undefined',
  asAny: (v: any) => v as any,
  asType: <T>(v: any, _: T) => v as T,
}

export default types
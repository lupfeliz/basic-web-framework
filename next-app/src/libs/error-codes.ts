/**
 * @File        : errorcodes.ts
 * @Author      : 정재백
 * @Since       : 2023-10-27
 * @Description : api 통신간 서버 오류코드 번역
 * @Site        : https://devlog.ntiple.com
 **/
const errorCodes = {
  USER_NOT_FOUND: '사용자 아이디 혹은 비밀번호가 잘못되었어요',

  getMessage(prm: any) {
    let ret = ''
    if (typeof (prm) === 'string') {
    } else if (typeof(prm) === 'object') {
      ret = (errorCodes as any)[(prm.msgcode || prm.errcd)] || prm?.message
    }
    return ret
  },
}

export default errorCodes
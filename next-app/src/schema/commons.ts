/**
 * @File        : commons.ts
 * @Author      : 정재백
 * @Since       : 2024-10-25
 * @Description :  스키마
 * @Site        : https://devlog.ntiple.com
 **/

export default {
  authResult: {
    /** 사용자 ID */
    userId: '',
    /** 사용자 이름 */
    userNm: '',
    /** 응답코드 */
    rescd: '',
    /** 응답타입 */
    restyp: '',
    /** 액세스 토큰 */
    accessToken: '',
    /** 리프레시 토큰 */
    refreshToken: '',
  },
  search: {
    /** 현재페이지 */
    currentPage: 1,
    /** 검색타입 */
    searchType: '',
    /** 검색키워드 */
    keyword: '',
    /** 검색시작 */
    rowStart: 0,
    /** 검색수량 */
    rowCount: 10,
    /** 한화면에 표기할 페이지갯수 */
    pagePerScreen: 0,
    /** 정렬타입 */
    orderType: '',
    /** 결과리스트총갯수 */
    rowTotal: 0,
    /** 결과리스트 */
    list: [] as any[],
  },
}
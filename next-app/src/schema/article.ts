/**
 * @File        : article.ts
 * @Author      : 정재백
 * @Since       : 2024-10-25
 * @Description : 게시글 스키마
 * @Site        : https://devlog.ntiple.com
 **/

export default {
  /** 게시글 고유번호 */
  id: '',
  /** 게시판 ID */
  boardId: '',
  /** 게시글 번호 */
  num: '',
  /** 게시글 제목 */
  title: '',
  /** 글쓴이 ID */
  userId: '',
  /** 글쓴이 이름 */
  userNm: '',
  /** 내용 */
  contents: '',
  /** 생성일시 */
  ctime: '',
  /** 수정일시 */
  utime: '',
}
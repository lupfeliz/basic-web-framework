/**
 * @File        : aside.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 헤더 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import app from '@/libs/app-context'
import userContext from '@/libs/user-context'
import * as C from '@/libs/constants'
import dialog from '@/libs/dialog-context'
import { Container, Block, Button, Link } from '@/components'

type AsideProps = {
  vars?: any
  openAside?: Function
}

const { log, defineComponent, useSetup, goPage, strm } = app
export default defineComponent((props: AsideProps) => {
  const self = useSetup({
    name: 'aside',
    vars: {
      clsAside: ''
    },
    async mounted({ releaser }) {
      /** 사용자 로그인 만료시간 모니터링 */
      releaser(userContext.subscribe(() => update(C.UPDATE_SELF)))
    },
    async updated() {
    }
  })
  const { update, ready } = self()
  const { vars } = props
  const userInfo = userContext.getUserInfo()

  const logout = async () => {
    await userContext.logout()
    dialog.alert('로그아웃 되었어요')
    goPage('/')
  }
  return (
    <>
    <aside
      className={ strm(`offcanvas offcanvas-end offcanvas-light ${ vars.clsAside }`) }
      tabIndex={ -1 }
      >
      <Block className='mt-3'>
      { ready() && (userInfo?.userId) && (
        <>
          <Block className='text-center my-1'>
            { userInfo.userNm }
          </Block>
          <Block className='text-center my-1'>
            { userInfo.timelabel }
          </Block>
        </>
      ) }
      </Block>
      <div className='offcanvas-body bg-opacity-10'>
        <ul className='nav flex-column'>
          <li className='nav-item'>
          <Button
            href={'/'}
            >
            홈
          </Button>
          </li>
          { ready() && !(userInfo?.userId) ? (
          <>
            <li className='nav-item'>
            <Button
              href={'/lgn/lgn01001s01'}
              >
              로그인
            </Button>
            </li>
            <li className='nav-item'>
            <Button
              href={'/usr/usr01001s01'}
              >
              회원가입
            </Button>
            </li>
          </>
          ) : (
          <>
            <li className='nav-item'>
            <Button
              onClick={ userContext.tokenRefresh }
              >
              로그인연장
            </Button>
            </li>
            <li className='nav-item'>
            <Button
              onClick={ logout }
              >
              로그아웃
            </Button>
            </li>
            <li className='nav-item'>
            <Button
              href='/usr/usr01001s03'
              >
              마이페이지
            </Button>
            </li>
          </>
          ) }
          <li className='nav-item'>
          <Button
            href='/atc/atc01001s04/1'
            >
            게시판
          </Button>
          </li>
        </ul>
      </div>
    </aside>
    </>
  )
})
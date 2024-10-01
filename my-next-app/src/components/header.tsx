/**
 * @File        : header.tsx
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
import { nextTick } from 'process'
import proc from '@/libs/proc'
const { log, defineComponent, useSetup, goPage, strm } = app
export default defineComponent(() => {
  const self = useSetup({
    name: 'header',
    vars: {
      clsAside: ''
    },
    async mounted({ releaser }) {
      /** 사용자 로그인 만료시간 모니터링 */
      releaser(userContext.subscribe(() => update(C.UPDATE_SELF)))
    }
  })
  const { vars, update, ready } = self()
  const userInfo = userContext.getUserInfo()
  /** aside 메뉴 오픈 */
  const openAside = async (visible: boolean) => {
    if (visible) {
      vars.clsAside = 'show'
      update(C.UPDATE_FULL)
      // log.debug('OPENASIDE..')
      nextTick(() => {
        const fnc = async () => {
          log.debug('OPENASIDE-CLICK..')
          document.removeEventListener('mouseup', fnc)
          openAside(false)
          return true
        }
        document.addEventListener('mouseup', fnc)
      })
    } else {
      vars.clsAside = 'show hiding'
      update(C.UPDATE_FULL)
      // await proc.sleep(300)
      // vars.clsAside = ''
      // update(C.UPDATE_FULL)
    }
  }
  const logout = async () => {
    await userContext.logout()
    dialog.alert('로그아웃 되었어요')
    goPage('/')
  }
  return (
    <>
    <header>
    <Container className='flex'>
      <Block>
        <Button
          size='small'
          onClick={() => goPage(-1)}
          >
          <i className='bi bi-chevron-left'></i>
          {/* <ArrowBackIcon /> */}
        </Button>
      </Block>
      <Block>
        <Link
          href={ '/' }
          >
          HEADER
        </Link>
      </Block>
      <Block>
        <Button
          size='small'
          onClick={ () => openAside(true) }
          >
          <i className='bi bi-list'></i>
        </Button>
      </Block>
    </Container>
    </header>
    {/* [ */}
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
    {/* ] */}
    </>
  )
})
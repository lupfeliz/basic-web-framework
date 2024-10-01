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
// import { Drawer } from '@mui/material'
// import { Menu as MenuIcon, ArrowBackIos as ArrowBackIcon } from '@mui/icons-material';
const { defineComponent, useSetup, goPage } = app
export default defineComponent(() => {
  const self = useSetup({
    name: 'header',
    vars: {
      aside: ''
    },
    async mounted({ releaser }) {
      /** 사용자 로그인 만료시간 모니터링 */
      releaser(userContext.subscribe(() => update(C.UPDATE_SELF)))
    }
  })
  const { vars, update, ready } = self()
  const userInfo = userContext.getUserInfo()
  /** aside 메뉴 오픈 */
  const openAside = (visible: boolean) => {
    if (visible) {
      vars.aside = 'show'
    } else {
      vars.aside = 'show hiding'
    }
    update(C.UPDATE_FULL)
  }
  const logout = async () => {
    await userContext.logout()
    dialog.alert('로그아웃 되었어요')
    goPage('/')
  }
  return (
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
          data-bs-toggle='offcanvas'
          data-bs-target='#drawer'
          >
          <i className='bi bi-list'></i>
          {/* <MenuIcon /> */}
        </Button>
      </Block>
    </Container>

    {/* offcanvas offcanvas-end offcanvas-light show */}
    {/* [ */}
    <aside
      className={String(`offcanvas offcanvas-end offcanvas-light ${ vars.aside }`).replace(/[ ]+/, ' ').trim()}
      tabIndex={ -1 }
      >
      <Block className='offcanvas-header'>
        <Button
          className='btn-close btn-close-white'
          aria-label='Close'
          onClick={ () => openAside(false) }
          >
        </Button>
      </Block>
      <Block>
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
          {/* <li className='nav-item'>
            <div className='collapse' id='menuA'>
              <ul className='nav flex-column'>
                <li className='nav-item'>
                  <a className='nav-link ps-4' href='javascript:'>
                    Menu Item
                  </a>
                </li>
                <li className='nav-item'>
                  <a className='nav-link ps-4' href='javascript:'>
                    Menu Item
                  </a>
                </li>
              </ul>
            </div>
          </li> */}
        </ul>
      </div>
    </aside>
    {/* ] */}


    {/* <Drawer
      className='header-aside'
      anchor='right'
      open={ vars.aside }
      onClick={ () => openAside(false) }
      >
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
      <Block>
        <Button
          href={'/'}
          >
          홈
        </Button>
        { ready() && !(userInfo?.userId) ? (
        <>
          <Button
            href={'/lgn/lgn01001s01'}
            >
            로그인
          </Button>
          <Button
            href={'/usr/usr01001s01'}
            >
            회원가입
          </Button>
        </>
        ) : (
        <>
          <Button
            onClick={ userContext.tokenRefresh }
            >
            로그인연장
          </Button>
          <Button
            onClick={ logout }
            >
            로그아웃
          </Button>
          <Button
            href='/usr/usr01001s03'
            >
            마이페이지
          </Button>
        </>
        ) }
        <Button
          href='/atc/atc01001s04/1'
          >
          게시판
        </Button>
      </Block>
    </Drawer> */}
    </header>
  )
})
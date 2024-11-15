/**
 * @File        : header.tsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 헤더 컴포넌트
 * @Site        : https://devlog.ntiple.com
 **/
import app from '@/libs/app-context'
import * as C from '@/libs/constants'
import { Container, Block, Button, Link, Select } from '@/components'
import Aside from './aside'
import { nextTick } from 'process'
const COMPONENT = 'header'
const { getLogger, defineComponent, useSetup, goPage, changeLang, $t } = app
const log = getLogger(COMPONENT)
export default defineComponent(() => {
  const self = useSetup({
    name: COMPONENT,
    vars: {
      clsAside: '',
      lang: $t.current() || C.KO
    },
    async mounted() {
      // vars.lang = app.$t.persist() || C.KO
      vars.lang = $t.current() || C.KO
      update()
    }
  })
  const { vars, update, ready } = self()
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
    }
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
        <span></span>
        <Link
          href={ '/' }
          >
          { $t('CMN0012') || '헤더' }
        </Link>
        <Block>
          <span>
            <Select
              size='sm'
              model={ vars }
              name='lang'
              onChange={ () => changeLang(vars.lang) }
              options={[
                { name: '한국어', value: 'ko' },
                { name: 'English', value: 'en' },
              ]}
              />
          </span>
        </Block>
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
    <Aside
      vars={ vars }
      openAside={ openAside }
      />
    </>
  )
})
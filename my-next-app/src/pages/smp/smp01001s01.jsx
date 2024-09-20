/**
 * @File        : smp01001s01.jsx
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 페이지 컴포넌트 샘플
 *                컴포넌트 변경이 감지되면 자동으로 데이터를 갱신할 수 있고
 *                반대로 데이터 갱신 후 update(C.UPDATE_ENTIRE) 를 수행하여
 *                컴포넌트를 업데이트 시킬 수 있다.
 * @Site        : https://devlog.ntiple.com
 **/
import app from '@/libs/app-context'
import * as C from '@/libs/constants'
import dialog from '@/libs/dialog-context'
import { Block, Button, Checkbox, Input, Select, Editor, Lottie, Container, Image, DataGrid } from '@/components'

const { log, definePage, goPage, useSetup, clear, putAll } = app

export default definePage((props) => {
  const self = useSetup({
    name: 'smp01001s01',
    vars: {
    /** 3초 타이머 */
    timer: 3,
    /** 폼데이터 */
    formdata: {
      input01: '',
      input02: 'AAAA',
      checkbox1: 'Y',
      checkbox2: '',
      checklist: ['', '', '', ''],
      select1: '',
      content: '',
    },
    /** 선택기 목록 설정 */
    options1: [
      { name: '선택해주세요', value: '' },
      'hotmail.com',
      'naver.com',
      'kakao.com',
      'gmail.com',
    ],
    /** 난수테스트용 */
    idgen: ['', '', '', ''],

    columnDefs: [],
    rowData: []
    },
    mounted, unmount, updated
  })
  const { update, vars, ready } = self()
  /** 페이지 시작 이벤트처리 */
  async function mounted() {
    log.debug('MOUNTED! SMP01001S01', props)
    const fdata = vars.formdata
    putAll(window, {
      DIALOG: dialog
    })
    /** 3초가 지나면 데이터 강제 업데이트를 수행한다 */
    const fnctime = async () => {
      if (vars.timer == 1) {
        fdata.input02 = 'BBBB'
        fdata.checkbox2 = 'C'
        fdata.select1 = 'kakao.com'
        fdata.content = `<p><span style="color:#f00">CONTENT</span></p>`
        vars.idgen.map((v, i, l) => l[i] = app.genId())
        /** 전체 데이터 갱신으로 화면 데이터가 자동으로 바뀐다 */
        update(C.UPDATE_ENTIRE)
      } else if (vars.timer > 0) {
        setTimeout(fnctime, 1000)
        update(C.UPDATE_SELF)
      }
      vars.timer--
    }
    setTimeout(fnctime, 1000)
    /** 난수 생성 테스트 */
    vars.idgen.map((v, i, l) => l[i] = app.genId())

    {
      vars.columnDefs = [
        { field: 'make', headerName: '메이커', sortable: false, groupBy: true },
        { field: 'model', sortable: false, colSpan: (v) => v?.data.price == 33853 ? 2 : 1 },
        { field: 'price', sortable: true },
        { field: 'electric', sortable: false }
      ]
      vars.rowData = [
        { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
        { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
        { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
        { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
        { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
        { make: 'Ford', model: 'F-Series', price: 33851, electric: false },
        { make: 'Ford', model: 'F-Series', price: 33852, electric: false },
        { make: 'Ford', model: '합계', price: 33853, electric: false },
        { make: 'Ford', model: 'F-Series', price: 33854, electric: false },
        { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
        { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
        { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
        { make: 'Toyota', model: 'Corolla1', price: 29650, electric: false },
        { make: 'Toyota', model: 'Corolla2', price: 29600, electric: false },
      ]
      update(C.UPDATE_ENTIRE)
    }
  }
  /** 페이지 종료 이벤트 처리 */
  async function unmount() {
    log.debug('UNMOUNT! SMP01001S01')
  }
  /** 페이지 업데이트 이벤트 처리 */
  async function updated() {
    log.debug('UPDATED! SMP01001S01')
  }
  return (
  <Container>
    <section className='title'>
      <h2>컴포넌트샘플</h2>
    </section>
    <hr/>
    <section>
      { ready() && (
      <article>
        <Block className='my-1'>
        <p> GLOBAL-STATE-VALUE: { app.state() } </p>
        <p> UPDATE_IF_NOT: { app.tstate(C.UPDATE_IF_NOT) } </p>
        <p> UPDATE_SELF: { app.tstate(C.UPDATE_SELF) } </p>
        <p> UPDATE_FULL: { app.tstate(C.UPDATE_FULL) } </p>
        <p> UPDATE_ENTIRE: { app.tstate(C.UPDATE_ENTIRE) } </p>
        </Block>
      </article>
      ) }
      <article>
        <h3> 버튼 컴포넌트 </h3>
        <hr />
        <Block className='my-1'>
          <Button
            className='mx-1'
            onClick={ () => goPage(-1) }
            >
            뒤로가기
          </Button>
          <Button
            className='mx-1'
            variant='contained'
            onClick={ () => {
              clear(vars?.formdata)
              update(C.UPDATE_SELF)
            } }
            >
            데이터삭제
          </Button>
          <Button
            className='mx-1'
            variant='contained'
            color='warning'
            >
            경고버튼
          </Button>
          <Button
            className='mx-1'
            variant='outlined'
            color='info'
            >
            기본버튼
          </Button>
          <Button
            className='mx-1'
            variant='outlined'
            color='info'
            href={'/smp/smp01001s02'}
            param={ { key: 'a', val: 'b' } }
            >
            페이지링크
          </Button>
        </Block>
      </article>
      <article>
        <h3>입력컴포넌트</h3>
        <hr />
        <Block className='my-1'>
          <Input
            model={ vars?.formdata }
            name='input01'
            size='small'
            type='number'
            maxLength={ 10 }
            minLength={ 2 }
            minValue={ 10 }
            maxValue={ 100 }
            />
          <span className='mx-1 my-1'>
          [VALUE: { vars?.formdata?.input01 }]
          </span>
        </Block>
        <Block className='my-1'>
          <Input
            model={ vars?.formdata }
            name='input02'
            size='small'
            />
          <span className='mx-1 my-1'>
            { vars?.timer > 0 ? (
              <> [change after { vars?.timer }sec: { vars?.formdata?.input02 }] </>
            ) : '' }
          </span>
        </Block>
      </article>
      <article>
        <h3>체크박스</h3>
        <hr />
        <Block className='my-1'>
          <Checkbox
            model={ vars?.formdata }
            name='checkbox1'
            value='Y'
            />
          <Checkbox
            model={ vars?.formdata }
            name='checkbox2'
            value='A'
            />
          <Checkbox
            type='radio'
            model={ vars?.formdata }
            name='checkbox2'
            value='B'
            />
          <Checkbox
            type='radio'
            model={ vars?.formdata }
            name='checkbox2'
            value='C'
            />
        </Block>
        <Block className='my-1'>
          { vars?.formdata?.checklist && vars?.formdata?.checklist.map((itm, inx) => (
            <Checkbox
              key={ inx }
              model={ vars?.formdata }
              name={ `checklist.${inx}` }
              value='Y'
              />
          )) }
        </Block>
      </article>
      <article>
        <h3>선택기</h3>
        <hr />
        <Block className='my-1'>
          <Select
            size='small'
            model={ vars?.formdata }
            name='select1'
            options={ vars?.options1 }
            />
        </Block>
      </article>
      <article>
        <h3>편집기</h3>
        <hr />
        <Block className='my-1'>
          <Editor
            model={ vars?.formdata }
            name='content'
            />
        </Block>
      </article>
      <article>
        <h3> DATA-GRID </h3>
        <hr />
        <Block className='my-1'>
          <DataGrid
            gridStyle={{ height: 500 }}
            columnDefs={ vars.columnDefs || [] }
            rowData={ vars.rowData || [] }
            />
        </Block>
      </article>
      <article>
        <h3>전체 폼데이터</h3>
        <hr />
        <Block className='my-1 w-full overflow-x-auto'>
          FORMDATA: [{ JSON.stringify(vars?.formdata) }]
        </Block>
      </article>
      <article>
        <h3>IMAGE</h3>
        <hr />
        <Block>
          <Image src={ '/assets/images/test.gif' } alt='' />
        </Block>
      </article>
      <article>
        <h3>LOTTIE</h3>
        <hr />
        <Block className='my-1 flex justify-center'>
          <Lottie 
            className='max-w-2/3'
            src='/assets/lottie/hello.json'
            />
        </Block>
      </article>
      <article>
        <h3>전역ID 생성 테스트</h3>
        <hr />
        <Block className='my-1'>
        { (vars?.idgen || []).map((v, i) => (
        <p key={ i }>
          { i } : { v }
        </p>
        )) }
        </Block>
      </article>
    </section>
  </Container>
  )
})
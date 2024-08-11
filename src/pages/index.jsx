/** 최초 페이지 이므로 기능없이 샘플페이지 이동용 버튼만 작성한다. */
import app from '@/libs/app-context'
import { Button } from '@/components'

export default app.definePage((props) => {
  return (
  <>
  <div>
    <h1>
      INDEX PAGE
    </h1>
    <section>
      <Button
        href='/smp/smp01001s01'
        >
        컴포넌트샘플
      </Button>
      <Button
        href='/smp/smp01001s02'
        >
        통신샘플
      </Button>
    </section>
  </div>
  </>
  )
})
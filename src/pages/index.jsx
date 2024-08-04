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
        SAMPLE1
      </Button>
      <Button
        href='/smp/smp01001s02'
        >
        SAMPLE2
      </Button>
      <Button
        href='/smp/smp01001s03'
        >
        SAMPLE3
      </Button>
    </section>
  </div>
  </>
  )
})
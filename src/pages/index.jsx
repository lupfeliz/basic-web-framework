import app from '@/libs/app-context'
import { Button, Link } from '@/components'

const { definePage } = app

export default definePage((props) => {
  return (
  <>
  <div>
    <h1>
      INDEX PAGE
    </h1>
    <section>
      <Button href='/smp/smp01001s01'> SAMPLE1 </Button>
      <Button href='/smp/smp01001s02'> SAMPLE2 </Button>
    </section>
  </div>
  </>
  )
})
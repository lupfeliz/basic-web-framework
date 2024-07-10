import app from '@/libs/app-context'
import { Container } from '@mui/material'

const { defineComponent } = app

export default defineComponent(() => {
  return (
    <footer>
    <Container>
      FOOTER
    </Container>
    </footer>
  )
})
import app from '@/libs/app-context'
import { Container } from '@mui/material'

const { defineComponent } = app

export default defineComponent(() => {
  return (
    <header>
    <Container>
      HEADER
    </Container>
    </header>
  )
})
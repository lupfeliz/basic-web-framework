import { motion, HTMLMotionProps } from 'framer-motion'
import app from '@/libs/app-context'
import Header from './header'
import Footer from './footer'
import { Container } from '@mui/material'
const { defineComponent } = app

type LayoutProps = HTMLMotionProps<'div'> & {
}

export default defineComponent((props: LayoutProps, ref: any) => {
  const { children, ...rest } = props
  return (
    <div ref={ ref }>
      <Header />
      <motion.main
        initial={ { x: '5%', opacity: 0 } }
        animate={ { x: 0, opacity: 1 } }
        exit={ { x: '-5%', opacity: 0 } }
        transition={ { duration: 0.25, ease: 'easeInOut' } }
        { ...rest }
        >
        <Container>
        { children as any }
        </Container>
      </motion.main>
      <Footer />
    </div>
  )
})
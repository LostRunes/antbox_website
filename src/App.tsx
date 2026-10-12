import { MotionConfig, motion, useScroll, useSpring } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { Audience } from './components/Audience'
import { Cursor } from './components/Cursor'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Journey } from './components/Journey'
import { Manifesto } from './components/Manifesto'
import { Marquee } from './components/Marquee'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { Product } from './components/Product'
import { Stats } from './components/Stats'
import { StorySection } from './components/story/StorySection'
import { Tracks } from './components/Tracks'
import { Walkthrough } from './components/walkthrough/Walkthrough'
import { WhyStack } from './components/WhyStack'
import { startSmoothScroll } from './lib/smooth'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const [name, setName] = useState('')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => startSmoothScroll(), [])
  const onReveal = useCallback(() => setRevealed(true), [])
  const onDone = useCallback(() => setLoading(false), [])

  return (
    <MotionConfig reducedMotion="user">
      {loading && <Preloader onReveal={onReveal} onDone={onDone} />}
      <Cursor />
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <Nav show={revealed} />
      <main>
        <Hero play={revealed} />
        <div className="cross" aria-hidden>
          <Marquee items={['Campus', 'Sprint', 'Mentor', 'Ship', 'Get hired']} angle={-3} />
          <Marquee items={['Real briefs', 'Real mentors', 'Real offers']} angle={3} light reverse speed={2.5} />
        </div>
        <Manifesto />
        <StorySection name={name.trim()} setName={setName} />
        <Marquee items={['No resume round', 'Real briefs', 'Pre-placement offers', 'Validated talent']} dark reverse speed={2.5} />
        <Walkthrough name={name.trim()} />
        <Stats />
        <Journey />
        <Tracks />
        <Audience />
        <WhyStack />
        <Product />
        <Marquee items={['Build your tribe', 'Own your career story', 'Join the colony']} speed={2.5} />
        <Footer />
      </main>
      <div className="grain" aria-hidden />
    </MotionConfig>
  )
}

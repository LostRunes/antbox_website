import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useFinePointer, useIsMobile } from '../lib/hooks'
import { scrollToId } from '../lib/smooth'
import { AntShape } from './Ant'
import { Pill } from './Magnetic'
import { SplitText } from './SplitText'

const WORDS = ['opportunity.', 'real briefs.', 'mentors.', 'PPOs.', 'your tribe.']

// Ant trail path in a 1000x600 box; SMIL animateMotion keeps it off the JS thread.
const TRAIL = 'M-60 520 C 120 470, 180 560, 320 500 S 520 380, 600 430 S 820 560, 900 420 S 980 200, 1080 160'

export function Hero({ play }: { play: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const fine = useFinePointer()
  const mobile = useIsMobile()
  const [word, setWord] = useState(0)

  useEffect(() => {
    if (!play) return
    const id = window.setInterval(() => setWord((w) => (w + 1) % WORDS.length), 2200)
    return () => clearInterval(id)
  }, [play])

  // pointer parallax (desktop only)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18 })
  const sy = useSpring(py, { stiffness: 60, damping: 18 })
  useEffect(() => {
    if (!fine) return
    const move = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5)
      py.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [fine, px, py])

  // scroll-out choreography
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.86])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const spread = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="hero" id="top" ref={ref}>
      <svg className="hero__ants" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <path d={TRAIL} fill="none" stroke="#8e43ac" strokeOpacity="0.18" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
        {play &&
          [0, 1.6, 3.2, 4.8, 6.4].map((begin, i) => (
            <g key={i}>
              <g transform="scale(0.9)">
                <AntShape carry={i % 2 === 0} />
              </g>
              <animateMotion dur="9s" begin={`-${begin}s`} repeatCount="indefinite" rotate="auto" path={TRAIL} fill="freeze" />
            </g>
          ))}
      </svg>

      <motion.div className="hero__stage" style={{ y: titleY, scale: titleScale, opacity: fade }}>
        <motion.div
          className="hero__eyebrow eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={play ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.2 }}
        >
          <span className="hero__dot" /> Foundation Day · 2026 — two years in, still building
        </motion.div>

        <h1 className="hero__title">
          <span className="row">
            <SplitText as="span" text="From campus" play={play} delay={0.1} />
          </span>
          <span className="row row--right">
            <motion.span
              className="hero__arrow"
              initial={{ scale: 0, rotate: -90 }}
              animate={play ? { scale: 1, rotate: 0 } : undefined}
              transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.55 }}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 12h17m0 0-7-7m7 7-7 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
            <SplitText as="span" text="to corporate," play={play} delay={0.35} />
          </span>
          <span className="row">
            <SplitText as="span" className="italic purple" text="in a box." play={play} delay={0.7} />
          </span>
        </h1>

        <div className="hero__bottom">
          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={play ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 1, duration: 0.8 }}
          >
            AntBox is the platform that bridges <b>talent</b> with{' '}
            <span className="hero__rotator">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={WORDS[word]}
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '-100%' }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  {WORDS[word]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            Students craft careers through validated Readiness Sprints. Companies build their own tribes.
          </motion.p>
          <motion.div
            className="hero__ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={play ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 1.15, duration: 0.8 }}
          >
            <Pill variant="dark" onClick={() => scrollToId('story')}>
              Watch the story
            </Pill>
            <Pill variant="light" ghost onClick={() => scrollToId('audience')} arrow={false}>
              I'm hiring
            </Pill>
          </motion.div>
        </div>
      </motion.div>

      {/* floating product fragments */}
      <Float play={play} sx={sx} sy={sy} spread={spread} depth={40} dx={-260} dy={-120} delay={1.2} style={{ top: mobile ? '13%' : '16%', right: mobile ? '6%' : '9%' }}>
        <div className="float-card" style={{ rotate: '4deg' }}>
          <small style={{ opacity: 0.6 }}>Priya S. · Product sprint</small>
          <b>Readiness 88%</b>
          <div className="bar">
            <motion.i initial={{ scaleX: 0 }} animate={play ? { scaleX: 1 } : undefined} transition={{ delay: 1.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }} style={{ transformOrigin: '0 50%' }} />
          </div>
        </div>
      </Float>
      {!mobile && (
        <Float play={play} sx={sx} sy={sy} spread={spread} depth={-60} dx={-200} dy={160} delay={1.35} style={{ bottom: '31%', left: '50%' }}>
          <div className="float-chip" style={{ background: 'var(--mint)', rotate: '-6deg' }}>
            ● PPO unlocked
          </div>
        </Float>
      )}
      <Float play={play} sx={sx} sy={sy} spread={spread} depth={70} dx={220} dy={200} delay={1.5} style={mobile ? { bottom: '6%', right: '6%' } : { bottom: '17%', left: '42%' }}>
        <div className="float-chip" style={{ background: 'var(--lilac)', rotate: '5deg' }}>
          ● Sprint #12 · live now
        </div>
      </Float>

      <motion.div className="hero__scroll" style={{ opacity: fade }} initial={{ opacity: 0 }} animate={play ? { opacity: 0.6 } : undefined}>
        Scroll
        <i />
      </motion.div>
    </section>
  )
}

type FloatProps = {
  children: ReactNode
  play: boolean
  sx: MotionValue<number>
  sy: MotionValue<number>
  spread: MotionValue<number>
  depth: number
  dx: number
  dy: number
  delay: number
  style: React.CSSProperties
}

/** Floats with pointer parallax (depth) and flies outward (dx, dy) as the hero scrolls away. */
function Float({ children, play, sx, sy, spread, depth, dx, dy, delay, style }: FloatProps) {
  const x = useTransform(() => sx.get() * depth + spread.get() * dx)
  const y = useTransform(() => sy.get() * depth + spread.get() * dy)
  const rotate = useTransform(spread, [0, 1], [0, dx > 0 ? 25 : -25])
  return (
    <motion.div className="hero__float" style={{ ...style, x, y, rotate }}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={play ? { scale: 1, opacity: 1 } : undefined}
        transition={{ type: 'spring', stiffness: 180, damping: 13, delay }}
      >
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' }}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useIsMobile } from '../lib/hooks'
import { scrollToId } from '../lib/smooth'
import { AntShape } from './Ant'
import { Pill } from './Magnetic'
import { SplitText } from './SplitText'

// Ant trails in a 1000x600 box; SMIL animateMotion keeps them off the JS thread.
// Desktop wanders through the empty space right of the headline; phones cross above it.
const TRAIL_DESKTOP = 'M1080 90 C 940 110, 860 170, 900 250 S 1040 330, 940 390 S 700 380, 680 300 S 760 160, 640 60 L 600 -60'
const TRAIL_MOBILE = 'M-60 520 C 120 470, 180 560, 320 500 S 520 380, 600 430 S 820 560, 900 420 S 980 200, 1080 160'

export function Hero({ play }: { play: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const trail = useIsMobile() ? TRAIL_MOBILE : TRAIL_DESKTOP

  // scroll-out choreography
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section className="hero" id="top" ref={ref}>
      <svg className="hero__ants" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <path d={trail} fill="none" stroke="#8e43ac" strokeOpacity="0.18" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
        {play &&
          [0, 1.8, 3.6, 5.4].map((begin, i) => (
            <g key={i}>
              <g transform="scale(0.8)">
                <AntShape carry={i % 2 === 0} />
              </g>
              <animateMotion dur="11s" begin={`-${begin}s`} repeatCount="indefinite" rotate="auto" path={trail} fill="freeze" />
            </g>
          ))}
      </svg>

      <motion.div className="hero__stage" style={{ y: titleY, opacity: fade }}>
        <motion.div
          className="hero__eyebrow eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={play ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.2 }}
        >
          <span className="hero__dot" /> Foundation Day 2026
        </motion.div>

        <h1 className="hero__title">
          <span className="row">
            <SplitText as="span" text="From campus" play={play} delay={0.1} />
          </span>
          <span className="row row--indent">
            <motion.span
              className="hero__arrow"
              initial={{ scale: 0, rotate: -90 }}
              animate={play ? { scale: 1, rotate: 0 } : undefined}
              transition={{ type: 'spring', stiffness: 160, damping: 16, delay: 0.5 }}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 12h17m0 0-7-7m7 7-7 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
            <SplitText as="span" text="to corporate," play={play} delay={0.3} />
          </span>
          <span className="row">
            <SplitText as="span" className="italic purple" text="in a box." play={play} delay={0.6} />
          </span>
        </h1>

        <div className="hero__bottom">
          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 16 }}
            animate={play ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Career sprints with real companies, and offers before you graduate.
          </motion.p>
          <motion.div
            className="hero__ctas"
            initial={{ opacity: 0, y: 16 }}
            animate={play ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 1.05, duration: 0.8 }}
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

      <motion.div className="hero__scroll" style={{ opacity: fade }} initial={{ opacity: 0 }} animate={play ? { opacity: 0.6 } : undefined}>
        Scroll
        <i />
      </motion.div>
    </section>
  )
}

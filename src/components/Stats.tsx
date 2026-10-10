import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'
import { SplitText } from './SplitText'

function Counter({ to, suffix = '', format = true }: { to: number; suffix?: string; format?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const v = useMotionValue(0)
  const text = useTransform(v, (n) => (format ? Math.round(n).toLocaleString('en-IN') : Math.round(n)) + suffix)
  useEffect(() => {
    if (!inView) return
    const c = animate(v, to, { duration: 2, ease: [0.16, 1, 0.3, 1] })
    return () => c.stop()
  }, [inView, to, v])
  return <motion.span ref={ref}>{text}</motion.span>
}

const R = 150
const C = 2 * Math.PI * R

export function Stats() {
  const dialRef = useRef<HTMLDivElement>(null)
  const inView = useInView(dialRef, { once: true, margin: '-15% 0px' })
  const score = useMotionValue(0)
  const offset = useTransform(score, (s) => C * (1 - s / 100))
  const label = useTransform(score, (s) => Math.round(s))
  useEffect(() => {
    if (!inView) return
    const c = animate(score, 88, { duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 })
    return () => c.stop()
  }, [inView, score])

  return (
    <section className="stats">
      <div>
        <p className="eyebrow purple" style={{ marginBottom: 16 }}>
          Proof, not promises
        </p>
        <SplitText as="h2" className="stats__title" text={['Validated by', 'performance —', 'not interviews.']} stagger={0.015} />
        <div className="stats__grid">
          <div className="stat">
            <div className="stat__n">
              <Counter to={10000} suffix="+" />
            </div>
            <div className="stat__l">students building careers through sprints</div>
          </div>
          <div className="stat">
            <div className="stat__n">
              <Counter to={50} suffix="+" />
            </div>
            <div className="stat__l">enterprises hiring</div>
          </div>
          <div className="stat">
            <div className="stat__n purple">
              <Counter to={70} suffix="%" />
            </div>
            <div className="stat__l">placement rate</div>
          </div>
        </div>
      </div>

      <div className="dial" ref={dialRef}>
        <svg viewBox="0 0 340 340" aria-hidden>
          <circle cx="170" cy="170" r={R} fill="none" stroke="#e3e1d5" strokeWidth="22" />
          <motion.circle cx="170" cy="170" r={R} fill="none" stroke="#8e43ac" strokeWidth="22" strokeLinecap="round" strokeDasharray={C} style={{ strokeDashoffset: offset }} />
          {Array.from({ length: 60 }).map((_, i) => (
            <line
              key={i}
              x1="170"
              y1="8"
              x2="170"
              y2={i % 5 ? 14 : 20}
              stroke="#0b0b0d"
              strokeOpacity={i % 5 ? 0.15 : 0.4}
              strokeWidth="2"
              transform={`rotate(${i * 6} 170 170)`}
            />
          ))}
        </svg>
        <div className="dial__center">
          <span className="eyebrow" style={{ opacity: 0.6 }}>
            AI readiness score
          </span>
          <div className="dial__score">
            <motion.span>{label}</motion.span>
            <sup>%</sup>
          </div>
          <span style={{ fontSize: 14, color: '#55555c' }}>from sprint output, collaboration & culture fit</span>
        </div>
        {[
          { t: 'Sprint output', s: { top: '6%', left: '-4%' }, d: 0.6 },
          { t: 'Collaboration', s: { top: '46%', right: '-8%' }, d: 0.8 },
          { t: 'Culture fit', s: { bottom: '6%', left: '4%' }, d: 1 },
        ].map((c) => (
          <motion.div
            key={c.t}
            className="dial__chip"
            style={c.s}
            initial={{ scale: 0, rotate: -10 }}
            animate={inView ? { scale: 1, rotate: 0 } : undefined}
            transition={{ type: 'spring', stiffness: 220, damping: 13, delay: c.d }}
          >
            {c.t}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

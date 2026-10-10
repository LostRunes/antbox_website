import { motion, useScroll, useTransform } from 'motion/react'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

const STEPS: { n: string; title: string; text: string; bg: string; icon: ReactNode }[] = [
  {
    n: '01',
    title: 'Sign up & apply to a career sprint.',
    text: 'Browse curated sprints from top companies and apply in under 2 minutes.',
    bg: '#c991df',
    icon: (
      <svg viewBox="0 0 100 100" fill="none">
        <rect x="18" y="10" width="64" height="80" rx="10" fill="#0b0b0d" />
        <rect x="28" y="24" width="44" height="8" rx="4" fill="#fbfaf5" />
        <rect x="28" y="40" width="30" height="6" rx="3" fill="#fbfaf5" opacity=".5" />
        <rect x="28" y="62" width="44" height="14" rx="7" fill="#fbfaf5" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Complete a corporate-hosted sprint.',
    text: 'Work on real briefs — not case studies — with mentoring from industry professionals.',
    bg: '#fbfaf5',
    icon: (
      <svg viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="40" stroke="#0b0b0d" strokeWidth="8" />
        <path d="M50 26v26l16 10" stroke="#8e43ac" strokeWidth="8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Live work experience, scaled.',
    text: 'Internships that count. Earn validated credentials and portfolio pieces that prove what you can do.',
    bg: '#4ade80',
    icon: (
      <svg viewBox="0 0 100 100" fill="none">
        <rect x="10" y="30" width="80" height="56" rx="10" fill="#0b0b0d" />
        <path d="M36 30v-8a6 6 0 0 1 6-6h16a6 6 0 0 1 6 6v8" stroke="#0b0b0d" strokeWidth="8" />
        <rect x="42" y="50" width="16" height="12" rx="3" fill="#4ade80" />
      </svg>
    ),
  },
  {
    n: '04',
    title: 'Get a Pre-Placement Offer.',
    text: 'Convert performance into a full-time role before you graduate. No resume round.',
    bg: '#fcb900',
    icon: (
      <svg viewBox="0 0 100 100" fill="none">
        <path d="M50 8l11 24 26 3-19 18 5 26-23-13-23 13 5-26L13 35l26-3z" fill="#0b0b0d" />
      </svg>
    ),
  },
  {
    n: '→',
    title: 'Your story, next.',
    text: '10,000+ students have already started theirs.',
    bg: '#8e43ac',
    icon: (
      <svg viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="40" fill="#fbfaf5" />
        <path d="M32 50h34m0 0L52 36m14 14L52 64" stroke="#8e43ac" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

/** Pinned section; vertical scroll moves the rail sideways. */
export function Journey() {
  const ref = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      const rail = railRef.current
      if (rail) setDist(Math.max(0, rail.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (railRef.current) ro.observe(railRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])

  return (
    <section className="journey" id="journey" ref={ref} style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="journey__sticky">
        <div className="journey__head">
          <h2>
            Campus <span className="italic lilac">→</span> corporate,
            <br />
            in four sprints.
          </h2>
          <p className="eyebrow" style={{ opacity: 0.6 }}>
            Scroll to move →
          </p>
        </div>
        <motion.div className="journey__rail" ref={railRef} style={{ x }}>
          {STEPS.map((s, i) => (
            <Step key={i} {...s} i={i} progress={scrollYProgress} />
          ))}
        </motion.div>
        <div className="journey__progress">
          <motion.i style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  )
}

function Step({ n, title, text, bg, icon, i, progress }: (typeof STEPS)[number] & { i: number; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const center = i / (STEPS.length - 1)
  const rotate = useTransform(progress, [center - 0.4, center, center + 0.4], [6, 0, -6])
  const y = useTransform(progress, [center - 0.4, center, center + 0.4], [40, 0, 40])
  return (
    <motion.article className="step" style={{ background: bg, rotate, y, color: i === 4 ? '#fbfaf5' : undefined }} data-cursor="Scroll">
      <div className="step__icon">{icon}</div>
      <div className="step__num">{n}</div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </motion.article>
  )
}

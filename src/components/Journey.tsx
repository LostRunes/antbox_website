import { motion, useScroll, useTransform } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Doodle, type DoodleName } from './Doodle'

const STEPS: { n: string; title: string; text: string; bg: string; doodle: DoodleName; accent: string }[] = [
  {
    n: '01',
    title: 'Sign up & apply to a career sprint.',
    text: 'Browse curated sprints from top companies and apply in under 2 minutes.',
    bg: '#c991df',
    doodle: 'form',
    accent: 'rgba(255,255,255,0.55)',
  },
  {
    n: '02',
    title: 'Complete a corporate-hosted sprint.',
    text: 'Work on real briefs — not case studies — with mentoring from industry professionals.',
    bg: '#fbfaf5',
    doodle: 'stopwatch',
    accent: 'rgba(201,145,223,0.45)',
  },
  {
    n: '03',
    title: 'Live work experience, scaled.',
    text: 'Internships that count. Earn validated credentials and portfolio pieces that prove what you can do.',
    bg: '#4ade80',
    doodle: 'laptop',
    accent: 'rgba(255,255,255,0.55)',
  },
  {
    n: '04',
    title: 'Get a Pre-Placement Offer.',
    text: 'Convert performance into a full-time role before you graduate. No resume round.',
    bg: '#fcb900',
    doodle: 'letter',
    accent: 'rgba(255,255,255,0.55)',
  },
  {
    n: '→',
    title: 'Your story, next.',
    text: '10,000+ students have already started theirs.',
    bg: '#8e43ac',
    doodle: 'flag',
    accent: 'rgba(201,145,223,0.5)',
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

function Step({ n, title, text, bg, doodle, accent, i, progress }: (typeof STEPS)[number] & { i: number; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const center = i / (STEPS.length - 1)
  const rotate = useTransform(progress, [center - 0.4, center, center + 0.4], [6, 0, -6])
  const y = useTransform(progress, [center - 0.4, center, center + 0.4], [40, 0, 40])
  return (
    <motion.article className="step" style={{ background: bg, rotate, y, color: i === 4 ? '#fbfaf5' : undefined }} data-cursor="Scroll">
      <div className="step__top">
        <span className="step__num">{n}</span>
        <span className="step__label">{i < 4 ? 'Sprint step' : 'Up next'}</span>
      </div>
      <Doodle name={doodle} accent={accent} className="step__doodle" />
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </motion.article>
  )
}

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { useIsMobile } from '../../lib/hooks'
import { scrollToY } from '../../lib/smooth'
import { SplitText } from '../SplitText'
import './walkthrough.css'
import { ApplyScreen, InternScreen, OfferScreen, ScoreScreen, SearchScreen, SprintScreen } from './Screens'

const STEPS = [
  { title: 'Search', tag: 'antbox', text: 'It starts with one search. AntBox shows up with curated sprints from companies that actually hire.', url: 'search.com/?q=antbox+career+sprints', status: 'Searching' },
  { title: 'Apply', tag: 'in 2 min', text: 'Pick a sprint, fill three fields, done. No cover letter, no resume screen.', url: 'theantbox.com/sprints', status: 'Applying' },
  { title: 'Sprint', tag: 'real briefs', text: 'Two weeks on a real company brief, with a mentor from that company reviewing your work.', url: 'app.theantbox.com/sprint/northwind', status: 'Sprinting · Day 6' },
  { title: 'Get scored', tag: 'by AI', text: 'Your readiness score is built from what you shipped, how you collaborated and how you fit.', url: 'app.theantbox.com/profile', status: 'Readiness 88' },
  { title: 'Work live', tag: 'internship', text: 'Top performers step into scaled internships — live work, real teams, weekly feedback.', url: 'app.theantbox.com/internship', status: 'Week 3 of 12' },
  { title: 'Get the offer', tag: 'PPO', text: 'Performance turns into a Pre-Placement Offer before you graduate. That is the whole point.', url: 'mail.app/inbox', status: 'Offer received' },
]

const DEVICE_W = 840
const DEVICE_H = 690

export function Walkthrough({ name }: { name: string }) {
  const mobile = useIsMobile()
  const ref = useRef<HTMLElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [scale, setScale] = useState(0.8)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const s = Math.min(STEPS.length - 1, Math.max(0, Math.floor(p * STEPS.length * 0.999)))
    setStep((prev) => (prev === s ? prev : s))
  })

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const fit = () => {
      const byW = el.clientWidth / DEVICE_W
      const byH = (window.innerHeight * (mobile ? 0.5 : 0.78)) / DEVICE_H
      setScale(Math.min(byW, byH, 1.15))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [mobile])

  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const range = el.offsetHeight - window.innerHeight
    scrollToY(top + ((i + 0.5) / STEPS.length) * range)
  }

  const s = STEPS[step]
  return (
    <section className="wt" id="walkthrough" ref={ref} style={{ height: `${STEPS.length * 75 + 100}vh` }}>
      <div className="wt__sticky">
        <div className="wt__left">
          <p className="eyebrow purple">Watch it happen</p>
          <SplitText as="h2" className="wt__title" text={['From search', 'to signed.']} stagger={0.02} />

          {!mobile && (
            <ol className="wt__steps">
              <motion.span className="wt__rail" style={{ scaleY: scrollYProgress }} />
              {STEPS.map((st, i) => (
                <li key={st.title} className={i === step ? 'is-on' : i < step ? 'is-past' : ''}>
                  <button onClick={() => jump(i)} data-cursor="Jump">
                    <span className="wt__dot" />
                    <span className="wt__name">
                      {st.title} <em>{st.tag}</em>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {i === step && (
                      <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                        {st.text}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="wt__right" ref={wrapRef}>
          <div className="wt__stage" style={{ height: DEVICE_H * scale }}>
            <div className="mac" style={{ transform: `scale(${scale})` }}>
              <div className="mac__screen">
                <div className="mac__bar">
                  <i style={{ background: '#ff5f57' }} />
                  <i style={{ background: '#febc2e' }} />
                  <i style={{ background: '#28c840' }} />
                  <div className="mac__url">
                    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden>
                      <rect x="5" y="10" width="14" height="10" rx="2" fill="currentColor" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2.4" fill="none" />
                    </svg>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span key={s.url} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                        {s.url}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
                <div className="mac__content">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      className="mac__page"
                      initial={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.02, filter: 'blur(6px)' }}
                      transition={{ duration: 0.35 }}
                    >
                      {step === 0 && <SearchScreen />}
                      {step === 1 && <ApplyScreen name={name} />}
                      {step === 2 && <SprintScreen />}
                      {step === 3 && <ScoreScreen />}
                      {step === 4 && <InternScreen />}
                      {step === 5 && <OfferScreen name={name} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <div className="mac__chin">
                <img src="/antbox-mark.png" alt="" />
              </div>
              <div className="mac__neck" />
              <div className="mac__foot" />
            </div>

            <AnimatePresence mode="popLayout">
              <motion.div
                key={s.status}
                className="wt__chip"
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <span className={step === 5 ? 'wt__pulse is-ok' : 'wt__pulse'} />
                {s.status}
              </motion.div>
            </AnimatePresence>
            <div className="wt__count">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.b key={step} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.35 }}>
                  0{step + 1}
                </motion.b>
              </AnimatePresence>
              <span>/ 0{STEPS.length}</span>
            </div>
          </div>

          {mobile && (
            <div className="wt__mobile-step">
              <div className="wt__dots">
                {STEPS.map((_, i) => (
                  <i key={i} className={i <= step ? 'is-on' : ''} />
                ))}
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
                  <h3 className="wt__name">
                    {s.title} <em>{s.tag}</em>
                  </h3>
                  <p>{s.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from 'motion/react'
import { useState } from 'react'
import { Doodle, type DoodleName } from './Doodle'
import { SplitText } from './SplitText'

const CARDS: { t: string; p: string; bg: string; d: DoodleName; a: string }[] = [
  { t: 'Performance-first validation.', p: 'Validation comes from what you ship in a sprint — not from tests or interviews.', bg: '#fbfaf5', d: 'rocket', a: 'rgba(201,145,223,0.45)' },
  { t: 'Built for both sides.', p: 'One platform where students build careers and companies build tribes.', bg: '#c991df', d: 'bridge', a: 'rgba(255,255,255,0.55)' },
  { t: 'AI-powered readiness.', p: 'A readiness score generated from sprint performance, collaboration signals and cultural fit.', bg: '#4ade80', d: 'gauge', a: 'rgba(255,255,255,0.55)' },
  { t: 'No resume round.', p: 'Top performers skip the pile and walk straight into Pre-Placement Offers.', bg: '#fcb900', d: 'bin', a: 'rgba(255,255,255,0.55)' },
  { t: 'Tribes, not funnels.', p: 'Companies grow talent communities around culture and craft — hiring becomes a warm handshake.', bg: '#ead2f3', d: 'tribe', a: 'rgba(255,255,255,0.55)' },
]

/** Tinder-style deck: fling the top card away in any direction, it goes to the back. */
export function WhyStack() {
  const [order, setOrder] = useState(CARDS.map((_, i) => i))
  const [exitX, setExitX] = useState(400)
  const next = (dir: number) => {
    setExitX(dir * 500)
    setOrder((o) => [...o.slice(1), o[0]])
  }

  return (
    <section className="why">
      <div>
        <p className="eyebrow" style={{ marginBottom: 16, opacity: 0.8 }}>
          Why AntBox
        </p>
        <SplitText as="h2" text={['Five reasons', 'the colony', 'keeps growing.']} stagger={0.018} />
        <button className="why__hint" onClick={() => next(1)} data-cursor="Next">
          <svg width="40" height="22" viewBox="0 0 40 22" fill="none" aria-hidden>
            <path d="M2 11h34m0 0-8-8m8 8-8 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Swipe the cards (or tap here)
        </button>
      </div>

      <div className="stack">
        <AnimatePresence initial={false} custom={exitX}>
          {order
            .slice(0, 3)
            .reverse()
            .map((idx, depth, arr) => {
              const pos = arr.length - 1 - depth
              return <StackCard key={idx} idx={idx} pos={pos} onFling={next} exitX={exitX} />
            })}
        </AnimatePresence>
      </div>
    </section>
  )
}

function StackCard({ idx, pos, onFling, exitX }: { idx: number; pos: number; onFling: (d: number) => void; exitX: number }) {
  const c = CARDS[idx]
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-250, 250], [-18, 18])
  const top = pos === 0

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600) onFling(Math.sign(info.offset.x || 1))
  }

  return (
    <motion.div
      className="stack__card"
      style={{ background: c.bg, x: top ? x : 0, rotate: top ? rotate : 0, zIndex: 10 - pos }}
      initial={{ scale: 0.85, y: 40, opacity: 0 }}
      animate={{ scale: 1 - pos * 0.06, y: pos * -22, opacity: 1, rotateZ: pos === 1 ? -4 : pos === 2 ? 5 : 0 }}
      exit={{ x: exitX, opacity: 0, rotate: exitX > 0 ? 25 : -25, transition: { duration: 0.4 } }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      drag={top ? 'x' : false}
      dragSnapToOrigin
      onDragEnd={onDragEnd}
      data-cursor={top ? 'Drag' : undefined}
    >
      <div className="stack__idx">
        <span>0{idx + 1}</span>
        <span>/ 0{CARDS.length}</span>
      </div>
      <Doodle name={c.d} accent={c.a} className="stack__doodle" />
      <div>
        <h3>{c.t}</h3>
        <p>{c.p}</p>
      </div>
    </motion.div>
  )
}

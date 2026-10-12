import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useState, type PointerEvent } from 'react'
import { useFinePointer } from '../lib/hooks'
import { Pill } from './Magnetic'
import { Doodle, type DoodleName } from './Doodle'
import { PLATFORM_URL } from './Nav'
import { SplitText } from './SplitText'

type Card = { sticker: string; title: string; text: string; bg: string; fg?: string; chip: string; d: DoodleName; a: string }

const DATA: Record<'students' | 'corporates', { cta: string; cards: Card[] }> = {
  students: {
    cta: "I'm a student",
    cards: [
      { sticker: 'Real work', title: 'Real briefs, real companies.', text: 'Work on actual projects from participating companies — not textbook case studies.', bg: '#c991df', chip: '#fbfaf5', d: 'briefcase', a: 'rgba(255,255,255,0.55)' },
      { sticker: 'Fast-track', title: 'Straight to a PPO.', text: 'Top sprint performers get direct Pre-Placement Offers. No resume round.', bg: '#4ade80', chip: '#fbfaf5', d: 'bolt', a: 'rgba(255,255,255,0.55)' },
      { sticker: 'Your score', title: 'An AI-validated readiness score.', text: 'One number backed by sprint history and verified work output — trusted by enterprises.', bg: '#0b0b0d', fg: '#fbfaf5', chip: '#8e43ac', d: 'gauge', a: 'rgba(142,67,172,0.55)' },
    ],
  },
  corporates: {
    cta: 'For corporates',
    cards: [
      { sticker: 'Disrupt', title: 'Disrupt entry-level hiring.', text: 'Replace months of screening with a 2-week sprint that shows you who can actually do the work.', bg: '#fcb900', chip: '#fbfaf5', d: 'hourglass', a: 'rgba(255,255,255,0.55)' },
      { sticker: 'Tribes', title: 'Build your own tribes.', text: 'Talent communities built around your culture, values and craft — warm before you ever post a role.', bg: '#8e43ac', fg: '#fbfaf5', chip: '#0b0b0d', d: 'tribe', a: 'rgba(255,255,255,0.3)' },
      { sticker: 'Validated', title: 'A validated talent pool.', text: 'Every candidate comes with a Readiness Score, sprint history and verified work output.', bg: '#e3e1d5', chip: '#fbfaf5', d: 'badge', a: 'rgba(201,145,223,0.45)' },
    ],
  },
}

export function Audience() {
  const [tab, setTab] = useState<'students' | 'corporates'>('students')
  const d = DATA[tab]
  return (
    <section className="audience" id="audience">
      <div className="audience__head">
        <p className="eyebrow purple">Built for both sides</p>
        <SplitText as="h2" text={['One platform.', 'Two happy endings.']} stagger={0.018} />
        <div className="toggle" role="group" aria-label="Choose audience">
          {(['students', 'corporates'] as const).map((k) => (
            <button key={k} aria-pressed={tab === k} onClick={() => setTab(k)} data-cursor="">
              {tab === k && <motion.span layoutId="toggle-pill" className="toggle__pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              {DATA[k].cta}
            </button>
          ))}
        </div>
      </div>

      <div className="audience__body">
        <AnimatePresence mode="popLayout" initial={false}>
          {d.cards.map((c, i) => (
            <TiltCard key={tab + i} card={c} i={i} />
          ))}
        </AnimatePresence>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <Pill variant="dark" href={PLATFORM_URL}>
          {tab === 'students' ? 'Find a sprint' : 'Build your tribe'}
        </Pill>
      </div>
    </section>
  )
}

function TiltCard({ card, i }: { card: Card; i: number }) {
  const fine = useFinePointer()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 })
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!fine) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  return (
    <motion.article
      className="benefit"
      style={{ background: card.bg, color: card.fg ?? '#0b0b0d', rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 80, rotate: i % 2 ? 4 : -4 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      exit={{ opacity: 0, y: -40, scale: 0.9, transition: { duration: 0.25 } }}
      transition={{ type: 'spring', stiffness: 140, damping: 18, delay: i * 0.08 }}
      onPointerMove={onMove}
      onPointerLeave={() => (mx.set(0), my.set(0))}
      data-cursor="View"
    >
      <motion.span
        className="benefit__sticker"
        style={{ background: card.chip, color: card.chip === '#fbfaf5' ? '#0b0b0d' : '#fbfaf5', translateZ: 40 }}
        whileHover={{ rotate: -8, scale: 1.1 }}
      >
        {card.sticker}
      </motion.span>
      <div className="benefit__doodle" style={{ transform: 'translateZ(50px)' }}>
        <Doodle name={card.d} accent={card.a} />
      </div>
      <div style={{ transform: 'translateZ(30px)' }}>
        <h3>{card.title}</h3>
        <p>{card.text}</p>
      </div>
    </motion.article>
  )
}

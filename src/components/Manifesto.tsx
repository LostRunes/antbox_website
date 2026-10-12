import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'

// `*word*` marks the words that land in purple italic
const TEXT =
  'A resume tells people where you have been. A sprint shows them *what* *you* *can* *do.* We built AntBox so talent gets judged by *its* *work* — not its paperwork.'

const WORDS = TEXT.split(' ').map((w) => ({ text: w.replace(/\*/g, ''), em: w.startsWith('*') }))

/** Pinned statement whose words light up one by one as you scroll through it. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const sign = useTransform(scrollYProgress, [0.85, 0.95], [0, 1])

  return (
    <section className="manifesto" ref={ref}>
      <div className="manifesto__sticky">
        <p className="eyebrow purple">Why we exist</p>
        <p className="manifesto__text" aria-label={TEXT.replace(/\*/g, '')}>
          {WORDS.map((w, i) => (
            <Word key={i} progress={scrollYProgress} start={(i / WORDS.length) * 0.8} end={((i + 1) / WORDS.length) * 0.8 + 0.02} em={w.em}>
              {w.text}
            </Word>
          ))}
        </p>
        <motion.p className="manifesto__sign" style={{ opacity: sign }}>
          — Team AntBox
        </motion.p>
      </div>
    </section>
  )
}

function Word({ children, progress, start, end, em }: { children: string; progress: MotionValue<number>; start: number; end: number; em: boolean }) {
  const opacity = useTransform(progress, [start, end], [0.12, 1])
  const y = useTransform(progress, [start, end], [8, 0])
  return (
    <motion.span className={em ? 'manifesto__em' : undefined} style={{ opacity, y }} aria-hidden>
      {children}
    </motion.span>
  )
}

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { useFinePointer } from '../lib/hooks'
import { scrollToId } from '../lib/smooth'
import { Pill } from './Magnetic'
import { PLATFORM_URL } from './Nav'
import { SplitText } from './SplitText'

const WORD = 'antbox'.split('')

export function Footer({ name }: { name: string }) {
  const fine = useFinePointer()
  const wordRef = useRef<HTMLDivElement>(null)
  const px = useMotionValue(-9999)

  return (
    <footer className="footer" id="join">
      <div className="footer__badge" aria-hidden>
        <motion.svg viewBox="0 0 200 200" animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
          <defs>
            <path id="badge-circle" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
          </defs>
          <circle cx="100" cy="100" r="98" fill="#8e43ac" />
          <text fontFamily="DM Sans" fontWeight="800" fontSize="15" letterSpacing="4.2" fill="#fbfaf5">
            <textPath href="#badge-circle">FOUNDATION DAY · 2026 · TWO YEARS IN ·</textPath>
          </text>
        </motion.svg>
        <img src="/antbox-mark.png" alt="" style={{ filter: 'brightness(0) invert(1)' }} />
      </div>

      <div className="footer__cta">
        <p className="eyebrow purple">The end of chapter 05</p>
        <SplitText as="h2" text={[`Your turn${name ? `, ${name}` : ''}.`, 'Join the colony.']} stagger={0.02} />
        <div className="footer__ctas">
          <Pill variant="purple" href={PLATFORM_URL}>
            I'm a student
          </Pill>
          <Pill variant="dark" href={PLATFORM_URL}>
            For corporates
          </Pill>
          <Pill variant="light" ghost arrow={false} onClick={() => scrollToId('story')}>
            Replay the story
          </Pill>
        </div>
      </div>

      <div
        className="footer__word"
        ref={wordRef}
        onPointerMove={(e) => fine && px.set(e.clientX)}
        onPointerLeave={() => px.set(-9999)}
        aria-label="antbox"
      >
        {WORD.map((ch, i) => (
          <Letter key={i} ch={ch} px={px} />
        ))}
      </div>

      <div className="footer__meta">
        <span>© 2026 AntBox · The platform that bridges talent with opportunity.</span>
        <nav>
          <a href={PLATFORM_URL} target="_blank" rel="noreferrer">
            theantbox.com
          </a>
          <a href="#story" onClick={(e) => (e.preventDefault(), scrollToId('story'))}>
            Story
          </a>
          <a href="#top" onClick={(e) => (e.preventDefault(), scrollToId('top'))}>
            Back to top ↑
          </a>
        </nav>
      </div>
    </footer>
  )
}

/** Each letter jumps up as the pointer passes over it, like keys being pressed. */
function Letter({ ch, px }: { ch: string; px: MotionValue<number> }) {
  const ref = useRef<HTMLSpanElement>(null)
  const lift = useTransform(px, (x) => {
    const el = ref.current
    if (!el) return 0
    const r = el.getBoundingClientRect()
    const dist = Math.abs(x - (r.left + r.width / 2))
    return -Math.max(0, 1 - dist / (r.width * 1.4)) * r.height * 0.28
  })
  const y = useSpring(lift, { stiffness: 300, damping: 16 })
  const rotate = useTransform(y, (v) => v * -0.12)
  return (
    <motion.span ref={ref} style={{ y, rotate }} aria-hidden>
      {ch}
    </motion.span>
  )
}

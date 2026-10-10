import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'

const COLS = 5

/** Counter 0→100 with the logo, then five panels sweep up to reveal the hero. */
export function Preloader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(2, '0'))
  const [exit, setExit] = useState(false)

  useEffect(() => {
    document.body.classList.add('is-loading')
    window.scrollTo(0, 0)
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const ctrl = animate(count, 100, { duration: 1.6, ease: [0.65, 0, 0.35, 1] })
    const timers: number[] = []
    Promise.all([ctrl.finished, fontsReady]).then(() => {
      setExit(true)
      timers.push(window.setTimeout(onReveal, 250))
      timers.push(
        window.setTimeout(() => {
          document.body.classList.remove('is-loading')
          onDone()
        }, 1300),
      )
    })
    return () => {
      ctrl.stop()
      timers.forEach(clearTimeout)
      document.body.classList.remove('is-loading')
    }
  }, [count, onReveal, onDone])

  return (
    <div className="preloader" aria-hidden>
      {Array.from({ length: COLS }).map((_, i) => (
        <motion.div
          key={i}
          className="preloader__panel"
          style={{ left: `${(i * 100) / COLS}%`, width: `${100 / COLS + 0.3}%` }}
          initial={{ y: 0 }}
          animate={exit ? { y: '-100%' } : { y: 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: exit ? i * 0.06 : 0 }}
        />
      ))}
      <motion.div
        className="preloader__inner"
        animate={exit ? { opacity: 0, y: -40 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.img
          className="preloader__mark"
          src="/antbox-mark.png"
          alt=""
          initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        />
        <div className="preloader__count">
          <motion.span>{rounded}</motion.span>
        </div>
        <div className="preloader__line">Packing your career into a box</div>
      </motion.div>
    </div>
  )
}

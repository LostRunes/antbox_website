import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

/** Types `text` out after `delay` ms. */
export function useTyped(text: string, delay = 0, speed = 55) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    let id = 0
    const start = window.setTimeout(() => {
      let i = 0
      id = window.setInterval(() => {
        i++
        setN(i)
        if (i >= text.length) clearInterval(id)
      }, speed)
    }, delay)
    return () => {
      clearTimeout(start)
      clearInterval(id)
    }
  }, [text, delay, speed])
  return text.slice(0, n)
}

/** Flips to true after `delay` ms — for staging state changes inside a screen. */
export function useAfter(delay: number) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return on
}

type Stop = [x: number, y: number, at: number]

/**
 * Scripted mouse pointer. `path` is a list of [x, y, seconds] stops in screen
 * coordinates; `clicks` are the moments (seconds) it presses.
 */
export function FakeCursor({ path, clicks = [] }: { path: Stop[]; clicks?: number[] }) {
  const end = path[path.length - 1][2]
  const times = path.map((p) => p[2] / end)
  // squash the arrow briefly on every click
  const press = [1, ...clicks.flatMap(() => [0.78, 1])]
  const pressAt = [0, ...clicks.flatMap((t) => [t / end, Math.min(1, (t + 0.15) / end)])]
  return (
    <motion.div
      className="fc"
      initial={{ x: path[0][0], y: path[0][1] }}
      animate={{ x: path.map((p) => p[0]), y: path.map((p) => p[1]) }}
      transition={{ duration: end, times, ease: 'easeInOut' }}
    >
      {clicks.map((t) => (
        <motion.span
          key={t}
          className="fc__ripple"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.6], opacity: [0.9, 0] }}
          transition={{ duration: 0.5, delay: t }}
        />
      ))}
      <motion.svg
        width="22"
        height="26"
        viewBox="0 0 22 26"
        animate={{ scale: press }}
        transition={{ duration: end, times: pressAt }}
      >
        <path d="M2 2 L2 21 L7 16.5 L10.5 24 L14 22.5 L10.5 15 L17 15 Z" fill="#0b0b0d" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </motion.svg>
    </motion.div>
  )
}

export const rise = (delay = 0, y = 16) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
})

export const popIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: 'spring' as const, stiffness: 260, damping: 18, delay },
})

export function Star({ on = true }: { on?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" fill={on ? '#fcb900' : '#e3e1d5'} />
    </svg>
  )
}

export function Check({ size = 14, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8.5l3 3 7-7" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

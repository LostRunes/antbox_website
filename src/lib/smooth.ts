import Lenis from 'lenis'
import { frame, cancelFrame } from 'motion/react'

let lenis: Lenis | null = null

// Lenis is driven by Motion's frame loop so scroll-linked animations
// and the smooth scroll update in the same rAF tick (no double-loop jitter).
export function startSmoothScroll() {
  if (lenis) return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false })
  const update = ({ timestamp }: { timestamp: number }) => lenis?.raf(timestamp)
  frame.update(update, true)
  return () => {
    cancelFrame(update)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.6 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function lockScroll(locked: boolean) {
  if (lenis) (locked ? lenis.stop() : lenis.start())
  document.body.style.overflow = locked ? 'hidden' : ''
}

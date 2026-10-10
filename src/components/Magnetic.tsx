import { motion, useMotionValue, useSpring } from 'motion/react'
import { useRef, type ReactNode } from 'react'

/** Pulls its child toward the pointer while hovered. No-op on touch. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.4 })

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: 'inline-flex' }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

type PillProps = {
  children: string
  variant?: 'dark' | 'purple' | 'light'
  ghost?: boolean
  href?: string
  onClick?: () => void
  arrow?: boolean
  className?: string
}

/** Rounded CTA with a rolling label and a liquid fill on hover. */
export function Pill({ children, variant = 'dark', ghost, href, onClick, arrow = true, className = '' }: PillProps) {
  const cls = `pill pill--${variant} ${ghost ? 'pill--ghost' : ''} ${className}`
  const inner = (
    <>
      <span className="pill__fill" />
      <span className="pill__roll">
        <span>{children}</span>
        <span>{children}</span>
      </span>
      {arrow && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M1 13 13 1M13 1H4M13 1v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </>
  )
  return (
    <Magnetic>
      {href ? (
        <a
          className={cls}
          href={href}
          data-cursor="Go"
          onClick={onClick}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer"
        >
          {inner}
        </a>
      ) : (
        <button className={cls} onClick={onClick} data-cursor="Go">
          {inner}
        </button>
      )}
    </Magnetic>
  )
}

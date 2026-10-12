import { motion } from 'motion/react'
import type { CSSProperties } from 'react'

type Props = {
  children: string
  /** where the arrow points from the text */
  arrow?: 'down-left' | 'down-right' | 'left' | 'right'
  rotate?: number
  style?: CSSProperties
}

const ARROWS: Record<NonNullable<Props['arrow']>, { d: string; head: string; box: string }> = {
  'down-left': { d: 'M70 4 C 66 30, 46 46, 14 52', head: 'M24 42 L 12 53 L 27 58', box: '0 0 80 64' },
  'down-right': { d: 'M10 4 C 14 30, 34 46, 66 52', head: 'M56 42 L 68 53 L 53 58', box: '0 0 80 64' },
  left: { d: 'M76 22 C 56 6, 30 8, 8 26', head: 'M10 12 L 7 27 L 22 29', box: '0 0 84 40' },
  right: { d: 'M8 22 C 28 6, 54 8, 76 26', head: 'M74 12 L 77 27 L 62 29', box: '0 0 84 40' },
}

/** Hand-lettered aside with an arrow that draws itself in when scrolled into view. Laptop only. */
export function Note({ children, arrow = 'down-left', rotate = -6, style }: Props) {
  const a = ARROWS[arrow]
  const arrowFirst = arrow === 'left'
  const svg = (
    <svg className={`note__arrow note__arrow--${arrow}`} viewBox={a.box} fill="none" aria-hidden>
      <motion.path
        d={a.d}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
      />
      <motion.path
        d={a.head}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.25, delay: 1.15 }}
      />
    </svg>
  )
  return (
    <motion.div
      className={`note note--${arrow}`}
      style={{ rotate, ...style }}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.5, delay: 0.3 }}
      aria-hidden
    >
      {arrowFirst && svg}
      <span>{children}</span>
      {!arrowFirst && svg}
    </motion.div>
  )
}

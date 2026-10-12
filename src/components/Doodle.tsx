import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { AntShape } from './Ant'

/**
 * Hand-drawn line doodles for the card sections. Strokes use `currentColor`
 * and draw themselves in when scrolled into view; `accent` fills the soft blobs.
 * Everything sits in a 160 × 120 box.
 */
export type DoodleName =
  | 'rocket'
  | 'bridge'
  | 'gauge'
  | 'bin'
  | 'tribe'
  | 'form'
  | 'stopwatch'
  | 'laptop'
  | 'letter'
  | 'flag'
  | 'briefcase'
  | 'bolt'
  | 'badge'
  | 'hourglass'

type Part = { d: string; fill?: boolean }

const P: Record<Exclude<DoodleName, 'tribe'>, Part[]> = {
  rocket: [
    { d: 'M80 14 C 104 28, 112 56, 100 84 L 60 84 C 48 56, 56 28, 80 14 Z', fill: true },
    { d: 'M80 44 m -9 0 a 9 9 0 1 0 18 0 a 9 9 0 1 0 -18 0' },
    { d: 'M60 70 L 42 88 L 62 84' },
    { d: 'M100 70 L 118 88 L 98 84' },
    { d: 'M70 92 C 72 102, 76 108, 80 114 C 84 108, 88 102, 90 92' },
    { d: 'M24 30 l 6 0 M27 27 l 0 6 M132 22 l 6 0 M135 19 l 0 6 M128 100 l 6 0 M131 97 l 0 6' },
  ],
  bridge: [
    { d: 'M14 84 L 146 84' },
    { d: 'M14 84 C 40 30, 120 30, 146 84', fill: true },
    { d: 'M44 50 L 44 84 M62 40 L 62 84 M80 37 L 80 84 M98 40 L 98 84 M116 50 L 116 84' },
    { d: 'M22 100 C 50 92, 110 108, 138 98' },
    { d: 'M34 26 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0' },
    { d: 'M126 26 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0' },
  ],
  gauge: [
    { d: 'M24 92 A 56 56 0 0 1 136 92', fill: true },
    { d: 'M36 92 A 44 44 0 0 1 124 92' },
    { d: 'M80 92 L 112 56' },
    { d: 'M80 92 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0' },
    { d: 'M34 60 l 8 5 M56 42 l 4 8 M80 36 l 0 9 M104 42 l -4 8 M126 60 l -8 5' },
    { d: 'M16 104 L 144 104' },
  ],
  bin: [
    { d: 'M48 50 L 56 108 L 104 108 L 112 50 Z', fill: true },
    { d: 'M40 50 L 120 50' },
    { d: 'M66 62 L 70 98 M80 62 L 80 98 M94 62 L 90 98' },
    { d: 'M58 36 L 62 12 L 92 10 L 98 34 L 86 30 L 74 38 Z' },
    { d: 'M68 18 L 86 17 M69 24 L 82 23' },
    { d: 'M124 20 L 140 36 M140 20 L 124 36' },
  ],
  form: [
    { d: 'M36 12 L 112 12 L 112 108 L 36 108 Z', fill: true },
    { d: 'M48 30 L 92 30 M48 44 L 80 44' },
    { d: 'M48 58 L 100 58 L 100 70 L 48 70 Z' },
    { d: 'M48 84 L 100 84 L 100 96 L 48 96 Z' },
    { d: 'M108 74 L 108 104 L 116 96 L 122 108 L 128 105 L 122 94 L 132 94 Z' },
  ],
  stopwatch: [
    { d: 'M80 64 m -42 0 a 42 42 0 1 0 84 0 a 42 42 0 1 0 -84 0', fill: true },
    { d: 'M70 10 L 90 10 M80 10 L 80 22' },
    { d: 'M112 28 L 120 20' },
    { d: 'M80 64 L 80 36 M80 64 L 100 76' },
    { d: 'M18 50 L 30 50 M12 64 L 28 64 M18 78 L 30 78' },
  ],
  laptop: [
    { d: 'M34 22 L 126 22 L 126 82 L 34 82 Z', fill: true },
    { d: 'M18 82 L 142 82 L 134 96 L 26 96 Z' },
    { d: 'M48 38 L 60 46 L 48 54 M66 56 L 84 56' },
    { d: 'M96 36 L 112 36 M92 46 L 112 46' },
    { d: 'M126 14 l 10 -8 M134 22 l 12 -2' },
  ],
  letter: [
    { d: 'M22 34 L 138 34 L 138 104 L 22 104 Z', fill: true },
    { d: 'M22 34 L 80 76 L 138 34' },
    { d: 'M80 8 l 5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1 Z' },
    { d: 'M22 104 L 62 70 M138 104 L 98 70' },
  ],
  flag: [
    { d: 'M14 104 C 40 96, 50 110, 76 100 C 96 92, 104 104, 118 96', fill: false },
    { d: 'M14 104 m -4 0 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0' },
    { d: 'M120 96 L 120 14' },
    { d: 'M120 16 L 150 26 L 120 38 Z', fill: true },
  ],
  briefcase: [
    { d: 'M22 40 L 138 40 L 138 104 L 22 104 Z', fill: true },
    { d: 'M62 40 L 62 28 L 98 28 L 98 40' },
    { d: 'M22 66 L 138 66' },
    { d: 'M72 60 L 88 60 L 88 74 L 72 74 Z' },
    { d: 'M110 10 l 0 12 M104 16 l 12 0' },
  ],
  bolt: [
    { d: 'M92 8 L 44 66 L 76 66 L 64 112 L 116 50 L 84 50 Z', fill: true },
    { d: 'M18 40 L 34 40 M12 58 L 30 58 M18 76 L 32 76' },
    { d: 'M130 30 l 6 6 M138 64 l 10 0 M130 92 l 6 -6' },
  ],
  badge: [
    { d: 'M80 10 L 92 20 L 108 18 L 112 34 L 126 42 L 120 58 L 126 74 L 112 82 L 108 98 L 92 96 L 80 106 L 68 96 L 52 98 L 48 82 L 34 74 L 40 58 L 34 42 L 48 34 L 52 18 L 68 20 Z', fill: true },
    { d: 'M62 58 L 76 72 L 100 46' },
  ],
  hourglass: [
    { d: 'M48 12 L 112 12 M48 108 L 112 108' },
    { d: 'M56 12 C 56 44, 80 50, 80 60 C 80 70, 56 76, 56 108 L 104 108 C 104 76, 80 70, 80 60 C 80 50, 104 44, 104 12 Z', fill: true },
    { d: 'M68 96 C 74 90, 86 90, 92 96' },
    { d: 'M126 30 L 144 48 M144 30 L 126 48' },
  ],
}

type Props = { name: DoodleName; accent?: string; className?: string }

export function Doodle({ name, accent = 'rgba(255,255,255,0.55)', className }: Props) {
  const draw = (i: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: '-10% 0px' },
    transition: { pathLength: { duration: 0.9, delay: 0.15 + i * 0.12, ease: 'easeInOut' as const }, opacity: { duration: 0.01, delay: 0.15 + i * 0.12 } },
  })

  let body: ReactNode
  if (name === 'tribe') {
    body = (
      <>
        <motion.ellipse cx="80" cy="66" rx="64" ry="38" fill={accent} stroke="none" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 140, damping: 14 }} style={{ originX: '80px', originY: '66px' }} />
        {[
          [52, 52, -20, true],
          [104, 48, 200, false],
          [78, 86, -80, true],
          [118, 84, 160, false],
          [40, 86, 20, false],
        ].map(([x, y, r, carry], i) => (
          <motion.g key={i} initial={{ opacity: 0, scale: 0.4 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 220, damping: 14 }}>
            <g transform={`translate(${x} ${y}) rotate(${r}) scale(0.95)`}>
              <AntShape carry={carry as boolean} />
            </g>
          </motion.g>
        ))}
      </>
    )
  } else {
    body = P[name].map((part, i) =>
      part.fill ? (
        <g key={i}>
          <motion.path d={part.d} fill={accent} stroke="none" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }} />
          <motion.path d={part.d} {...draw(i)} />
        </g>
      ) : (
        <motion.path key={i} d={part.d} {...draw(i)} />
      ),
    )
  }

  return (
    <svg className={`doodle ${className ?? ''}`} viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <g className="doodle__float">{body}</g>
    </svg>
  )
}

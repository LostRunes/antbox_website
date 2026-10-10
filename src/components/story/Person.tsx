import type { CSSProperties, ReactNode } from 'react'

/**
 * Tiny flat-illustration character rig.
 * Origin is between the feet; the figure is ~180 units tall.
 * Arm angles are in degrees: `a` raises the upper arm outward (0 = hanging),
 * `e` bends the forearm further in the same rotational direction.
 * `osc` = [from, to, seconds]: a looping forearm wiggle, in degrees relative to the pose
 * (keep it small); paused until the scene is live.
 */
export type Arm = { a: number; e: number; osc?: [number, number, number?]; behind?: boolean; hold?: ReactNode }

export type PersonProps = {
  x: number
  y: number
  s?: number
  skin?: string
  hair?: string
  hairStyle?: 'short' | 'bun' | 'long' | 'curly' | 'side'
  top?: string
  bottom?: string
  shoes?: string
  mood?: 'stress' | 'worried' | 'happy' | 'focus' | 'smile' | 'wow'
  left?: Arm
  right?: Arm
  legs?: 'stand' | 'walk' | 'hidden'
  backpack?: boolean
  blazer?: string
  glasses?: boolean
  lookX?: number
}

const UPPER = 30
const FORE = 28

export function Person({
  x,
  y,
  s = 1,
  skin = '#f1c7a2',
  hair = '#2a1d17',
  hairStyle = 'short',
  top = '#8e43ac',
  bottom = '#2a2a33',
  shoes = '#0b0b0d',
  mood = 'smile',
  left = { a: 8, e: 0 },
  right = { a: 8, e: 0 },
  legs = 'stand',
  backpack,
  blazer,
  glasses,
  lookX = 0,
}: PersonProps) {
  const arm = (side: 1 | -1, cfg: Arm) => {
    const sa = -side * cfg.a
    const ea = -side * cfg.e
    const sleeve = blazer ?? top
    const osc = cfg.osc
    const oscStyle = osc
      ? ({ '--a0': `${-side * osc[0]}deg`, '--a1': `${-side * osc[1]}deg`, '--d': `${osc[2] ?? 0.9}s` } as CSSProperties)
      : undefined
    return (
      <g transform={`translate(${side * 21} -122) rotate(${sa})`}>
        <path d={`M0 0 L0 ${UPPER}`} stroke={sleeve} strokeWidth="12.5" strokeLinecap="round" />
        <g transform={`translate(0 ${UPPER}) rotate(${ea})`}>
          <g className={osc ? 'osc' : undefined} style={oscStyle}>
            <path d={`M0 0 L0 ${FORE}`} stroke={sleeve} strokeWidth="11" strokeLinecap="round" />
            <circle cx="0" cy={FORE + 3} r="6.5" fill={skin} />
            {cfg.hold && <g transform={`translate(0 ${FORE + 3})`}>{cfg.hold}</g>}
          </g>
        </g>
      </g>
    )
  }

  const ex = lookX
  const face = (() => {
    switch (mood) {
      case 'stress':
        return (
          <>
            <path d={`M${-12 + ex} -160 L${-4 + ex} -163`} stroke="#0b0b0d" strokeWidth="2" strokeLinecap="round" />
            <path d={`M${12 + ex} -160 L${4 + ex} -163`} stroke="#0b0b0d" strokeWidth="2" strokeLinecap="round" />
            <circle cx={-7 + ex} cy="-151" r="2.6" fill="#0b0b0d" />
            <circle cx={7 + ex} cy="-151" r="2.6" fill="#0b0b0d" />
            <path d={`M${-7 + ex} -138 q2.3 -3 4.6 0 t4.6 0 t4.6 0`} stroke="#0b0b0d" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        )
      case 'worried':
        return (
          <>
            <path d={`M${-12 + ex} -158 Q${-8 + ex} -163 ${-3 + ex} -161`} stroke="#0b0b0d" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d={`M${12 + ex} -158 Q${8 + ex} -163 ${3 + ex} -161`} stroke="#0b0b0d" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx={-7 + ex} cy="-151" r="2.4" fill="#0b0b0d" />
            <circle cx={7 + ex} cy="-151" r="2.4" fill="#0b0b0d" />
            <ellipse cx={ex} cy="-138" rx="3.2" ry="2.6" fill="#0b0b0d" />
          </>
        )
      case 'happy':
        return (
          <>
            <path d={`M${-10 + ex} -150 q3 -4 6 0`} stroke="#0b0b0d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d={`M${4 + ex} -150 q3 -4 6 0`} stroke="#0b0b0d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d={`M${-7 + ex} -141 Q${ex} -132 ${7 + ex} -141 Z`} fill="#0b0b0d" />
            <circle cx={-13 + ex} cy="-141" r="3.5" fill="#f78da7" opacity="0.6" />
            <circle cx={13 + ex} cy="-141" r="3.5" fill="#f78da7" opacity="0.6" />
          </>
        )
      case 'wow':
        return (
          <>
            <circle cx={-7 + ex} cy="-152" r="3" fill="#0b0b0d" />
            <circle cx={7 + ex} cy="-152" r="3" fill="#0b0b0d" />
            <circle cx={-6 + ex} cy="-153" r="1" fill="#fff" />
            <circle cx={8 + ex} cy="-153" r="1" fill="#fff" />
            <ellipse cx={ex} cy="-139" rx="4" ry="5" fill="#0b0b0d" />
            <circle cx={-13 + ex} cy="-143" r="3.5" fill="#f78da7" opacity="0.6" />
            <circle cx={13 + ex} cy="-143" r="3.5" fill="#f78da7" opacity="0.6" />
          </>
        )
      case 'focus':
        return (
          <>
            <path d={`M${-11 + ex} -159 L${-3 + ex} -158`} stroke="#0b0b0d" strokeWidth="2" strokeLinecap="round" />
            <path d={`M${11 + ex} -159 L${3 + ex} -158`} stroke="#0b0b0d" strokeWidth="2" strokeLinecap="round" />
            <circle cx={-7 + ex} cy="-151" r="2.4" fill="#0b0b0d" />
            <circle cx={7 + ex} cy="-151" r="2.4" fill="#0b0b0d" />
            <path d={`M${-4 + ex} -139 L${4 + ex} -139`} stroke="#0b0b0d" strokeWidth="2" strokeLinecap="round" />
          </>
        )
      default:
        return (
          <>
            <circle cx={-7 + ex} cy="-151" r="2.4" fill="#0b0b0d" />
            <circle cx={7 + ex} cy="-151" r="2.4" fill="#0b0b0d" />
            <path d={`M${-6 + ex} -141 Q${ex} -135 ${6 + ex} -141`} stroke="#0b0b0d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <circle cx={-13 + ex} cy="-143" r="3.2" fill="#f78da7" opacity="0.45" />
            <circle cx={13 + ex} cy="-143" r="3.2" fill="#f78da7" opacity="0.45" />
          </>
        )
    }
  })()

  const hairBack = hairStyle === 'long' ? <path d="M-25 -158 Q-27 -180 0 -180 Q27 -180 25 -158 L27 -118 Q0 -112 -27 -118 Z" fill={hair} /> : null
  const hairFront = (() => {
    switch (hairStyle) {
      case 'bun':
        return (
          <>
            <circle cx="0" cy="-180" r="9" fill={hair} />
            <path d="M-22 -150 Q-24 -176 0 -175 Q24 -176 22 -150 Q16 -166 0 -166 Q-14 -166 -22 -150Z" fill={hair} />
          </>
        )
      case 'long':
        return <path d="M-22 -148 Q-24 -176 0 -175 Q24 -176 22 -148 Q14 -166 -2 -164 Q-14 -162 -22 -148Z" fill={hair} />
      case 'curly':
        return (
          <g fill={hair}>
            {[-18, -9, 0, 9, 18].map((cx, i) => (
              <circle key={i} cx={cx} cy={-168 - (i % 2) * 4} r="9" />
            ))}
            <circle cx="-21" cy="-156" r="7" />
            <circle cx="21" cy="-156" r="7" />
          </g>
        )
      case 'side':
        return <path d="M-22 -146 Q-26 -178 2 -176 Q26 -174 22 -152 Q6 -166 -8 -160 Q-16 -156 -22 -146Z" fill={hair} />
      default:
        return <path d="M-22 -150 Q-24 -177 0 -176 Q23 -177 22 -150 Q18 -162 6 -164 Q-8 -168 -22 -150Z" fill={hair} />
    }
  })()

  const step = legs === 'walk'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="34" ry="6" fill="#0b0b0d" opacity="0.08" />
      {left.behind && arm(-1, left)}
      {right.behind && arm(1, right)}
      {legs !== 'hidden' && (
        <g>
          <path d={`M-10 -66 L${step ? -16 : -11} -6`} stroke={bottom} strokeWidth="15" strokeLinecap="round" />
          <path d={`M10 -66 L${step ? 15 : 11} -6`} stroke={bottom} strokeWidth="15" strokeLinecap="round" />
          <ellipse cx={step ? -19 : -13} cy="-2" rx="11" ry="5.5" fill={shoes} />
          <ellipse cx={step ? 19 : 13} cy="-2" rx="11" ry="5.5" fill={shoes} />
        </g>
      )}
      {hairBack}
      <rect x="-6" y="-134" width="12" height="12" rx="4" fill={skin} />
      <path d="M-23 -124 Q0 -131 23 -124 L25 -64 Q0 -58 -25 -64 Z" fill={blazer ?? top} />
      {blazer && (
        <>
          <path d="M-8 -127 L0 -104 L8 -127 Z" fill={top} />
          <path d="M0 -104 L0 -66" stroke="#0b0b0d" strokeOpacity="0.15" strokeWidth="1.5" />
          <circle cx="3" cy="-90" r="1.6" fill="#0b0b0d" opacity="0.4" />
          <circle cx="3" cy="-78" r="1.6" fill="#0b0b0d" opacity="0.4" />
        </>
      )}
      {backpack && (
        <>
          <path d="M-14 -126 L-12 -76" stroke="#3d1650" strokeWidth="5" strokeLinecap="round" />
          <path d="M14 -126 L12 -76" stroke="#3d1650" strokeWidth="5" strokeLinecap="round" />
        </>
      )}
      <circle cx="0" cy="-150" r="21" fill={skin} />
      <circle cx="-21" cy="-149" r="4" fill={skin} />
      <circle cx="21" cy="-149" r="4" fill={skin} />
      {hairFront}
      {face}
      {glasses && (
        <g stroke="#0b0b0d" strokeWidth="1.8" fill="none">
          <circle cx={-7 + ex} cy="-151" r="6" />
          <circle cx={7 + ex} cy="-151" r="6" />
          <path d={`M${-1 + ex} -151 h2`} />
        </g>
      )}
      {!left.behind && arm(-1, left)}
      {!right.behind && arm(1, right)}
    </g>
  )
}

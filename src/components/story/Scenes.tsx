import { motion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { Person } from './Person'

type SceneProps = { on: boolean }

const pop = (on: boolean, delay = 0) => ({
  initial: { scale: 0, opacity: 0 },
  animate: on ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 },
  transition: { type: 'spring' as const, stiffness: 220, damping: 15, delay: on ? delay : 0 },
})

const rise = (on: boolean, delay = 0, y = 40) => ({
  initial: { y, opacity: 0 },
  animate: on ? { y: 0, opacity: 1 } : { y, opacity: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: on ? delay : 0 },
})

function Svg({ children, on, label }: { children: ReactNode; on: boolean; label: string }) {
  return (
    <svg className={`scene ${on ? 'is-live' : ''}`} viewBox="0 0 400 360" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

function Sparkle({ x, y, s = 1, c = '#8e43ac', d = 0 }: { x: number; y: number; s?: number; c?: string; d?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="twinkle" style={{ animationDelay: `${d}s` }} d="M0 -12 Q2 -2 12 0 Q2 2 0 12 Q-2 2 -12 0 Q-2 -2 0 -12Z" fill={c} />
    </g>
  )
}

/* ---------------- 01 · out of college ---------------- */
export function SceneGraduate({ on }: SceneProps) {
  return (
    <Svg on={on} label="A stressed student walking out of the college gates">
      <ellipse cx="200" cy="322" rx="190" ry="14" fill="#0b0b0d" opacity="0.05" />
      <motion.g {...rise(on, 0, 60)}>
        {/* college */}
        <rect x="40" y="128" width="250" height="186" rx="6" fill="#ead2f3" />
        <path d="M28 132 L165 58 L302 132 Z" fill="#c991df" />
        <rect x="28" y="128" width="274" height="12" rx="3" fill="#a958c5" />
        <text x="165" y="118" textAnchor="middle" fontFamily="DM Sans" fontWeight="800" fontSize="13" letterSpacing="3" fill="#3d1650">
          UNIVERSITY
        </text>
        {[64, 104, 206, 246].map((cx) => (
          <rect key={cx} x={cx} y="150" width="18" height="150" rx="4" fill="#fbfaf5" />
        ))}
        <rect x="136" y="196" width="58" height="104" rx="29" fill="#3d1650" />
        <rect x="30" y="298" width="270" height="10" rx="3" fill="#c991df" />
        <rect x="20" y="306" width="290" height="10" rx="3" fill="#a958c5" />
      </motion.g>

      {/* tossed caps — everyone else celebrating */}
      <motion.g {...pop(on, 0.4)}>
        <g className="bob" style={{ ['--d' as string]: '2.6s' }}>
          <g transform="translate(70 40) rotate(-18)">
            <path d="M-20 0 L0 -9 L20 0 L0 9 Z" fill="#0b0b0d" />
            <rect x="-10" y="2" width="20" height="9" rx="2" fill="#0b0b0d" />
            <path d="M14 1 L16 14" stroke="#fcb900" strokeWidth="2" />
          </g>
        </g>
      </motion.g>
      <motion.g {...pop(on, 0.55)}>
        <g className="bob" style={{ ['--d' as string]: '3.1s' }}>
          <g transform="translate(250 30) rotate(14) scale(0.8)">
            <path d="M-20 0 L0 -9 L20 0 L0 9 Z" fill="#0b0b0d" />
            <rect x="-10" y="2" width="20" height="9" rx="2" fill="#0b0b0d" />
            <path d="M14 1 L16 14" stroke="#fcb900" strokeWidth="2" />
          </g>
        </g>
      </motion.g>

      {/* the student walks out of the door */}
      <motion.g
        initial={{ x: -140, scale: 0.55, opacity: 0 }}
        animate={on ? { x: 0, scale: 1, opacity: 1 } : { x: -140, scale: 0.55, opacity: 0 }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: on ? 0.3 : 0 }}
        style={{ originX: '305px', originY: '330px' }}
      >
        <g className="bob" style={{ ['--d' as string]: '0.5s', ['--b' as string]: '-3px' }}>
          <Person
            x={305}
            y={330}
            s={1.05}
            mood="stress"
            hairStyle="side"
            top="#8e43ac"
            backpack
            legs="walk"
            left={{ a: 150, e: 92, osc: [0, 6, 0.35] }}
            right={{ a: 150, e: 92, osc: [0, 6, 0.4] }}
          />
        </g>
        {/* sweat */}
        <path className="drip" d="M262 150 q-5 8 0 11 q5 -3 0 -11Z" fill="#8ed1fc" />
        <path className="drip" style={{ animationDelay: '0.6s' }} d="M350 140 q-5 8 0 11 q5 -3 0 -11Z" fill="#8ed1fc" />
      </motion.g>

      {/* stress scribble */}
      <motion.g {...pop(on, 1.2)}>
        <g className="spin" style={{ ['--d' as string]: '4s' }}>
          <motion.path
            d="M305 92 c-30 -6 -20 -30 2 -30 c26 0 30 26 6 30 c-24 4 -32 -22 -8 -26 c22 -4 22 18 4 20 c-14 2 -14 -12 -2 -12"
            fill="none"
            stroke="#0b0b0d"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: on ? 1 : 0 }}
            transition={{ duration: 1, delay: on ? 1.3 : 0 }}
          />
        </g>
        <text x="352" y="70" fontFamily="DM Serif Display" fontSize="34" fill="#8e43ac" className="bob" style={{ ['--d' as string]: '1.4s' }}>
          ?!
        </text>
      </motion.g>
    </Svg>
  )
}

/* ---------------- 02 · placement panic ---------------- */
function Paper({ x, y, r, d, on, children }: { x: number; y: number; r: number; d: number; on: boolean; children: ReactNode }) {
  return (
    <motion.g
      initial={{ x: 200 - x, y: 200 - y, scale: 0, rotate: 0, opacity: 0 }}
      animate={on ? { x: 0, y: 0, scale: 1, rotate: r, opacity: 1 } : { x: 200 - x, y: 200 - y, scale: 0, rotate: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 13, delay: on ? d : 0 }}
    >
      <g className="flutter" style={{ animationDelay: `${d}s` }}>
        <g transform={`translate(${x} ${y})`}>{children}</g>
      </g>
    </motion.g>
  )
}

export function ScenePanic({ on }: SceneProps) {
  return (
    <Svg on={on} label="A worried student surrounded by a resume, a CGPA sheet and placement deadlines">
      <ellipse cx="200" cy="322" rx="170" ry="14" fill="#0b0b0d" opacity="0.05" />
      <motion.circle cx="200" cy="200" r="120" fill="#ead2f3" {...pop(on, 0)} />

      <motion.g {...rise(on, 0.1)}>
        <Person
          x={200}
          y={318}
          s={1.08}
          mood="worried"
          hairStyle="bun"
          hair="#3b2416"
          skin="#c98b62"
          top="#fcb900"
          bottom="#3d1650"
          lookX={-2}
          left={{ a: -10, e: 215, osc: [0, -6, 1.4] }}
          right={{ a: 20, e: 18 }}
        />
      </motion.g>

      {/* resume */}
      <Paper x={22} y={40} r={-12} d={0.35} on={on}>
        <rect width="86" height="108" rx="6" fill="#fff" stroke="#e3e1d5" strokeWidth="2" />
        <rect x="10" y="12" width="22" height="22" rx="4" fill="#c991df" />
        <rect x="38" y="15" width="38" height="6" rx="3" fill="#0b0b0d" />
        <rect x="38" y="26" width="26" height="4" rx="2" fill="#bbb" />
        {[44, 54, 64, 74, 84, 94].map((ly, i) => (
          <rect key={ly} x="10" y={ly} width={i % 3 === 2 ? 44 : 66} height="4" rx="2" fill="#ddd" />
        ))}
        <text x="43" y="-6" textAnchor="middle" fontFamily="DM Sans" fontWeight="800" fontSize="11" letterSpacing="2" fill="#8e43ac">
          RESUME
        </text>
      </Paper>

      {/* CGPA sheet */}
      <Paper x={292} y={30} r={9} d={0.45} on={on}>
        <rect width="92" height="112" rx="6" fill="#fff" stroke="#e3e1d5" strokeWidth="2" />
        <text x="10" y="22" fontFamily="DM Sans" fontWeight="800" fontSize="12" fill="#0b0b0d">
          CGPA
        </text>
        {[32, 44, 56, 68].map((ly) => (
          <g key={ly}>
            <rect x="10" y={ly} width="44" height="5" rx="2.5" fill="#ddd" />
            <rect x="64" y={ly} width="16" height="5" rx="2.5" fill="#bbb" />
          </g>
        ))}
        <text x="46" y="100" textAnchor="middle" fontFamily="DM Serif Display" fontSize="24" fill="#cf2e2e">
          7.2
        </text>
        <ellipse cx="46" cy="93" rx="24" ry="15" fill="none" stroke="#cf2e2e" strokeWidth="2.5" transform="rotate(-8 46 93)" />
      </Paper>

      {/* placement calendar */}
      <Paper x={300} y={196} r={-7} d={0.55} on={on}>
        <rect width="84" height="76" rx="8" fill="#fff" stroke="#e3e1d5" strokeWidth="2" />
        <rect width="84" height="20" rx="8" fill="#8e43ac" />
        <text x="42" y="14" textAnchor="middle" fontFamily="DM Sans" fontWeight="800" fontSize="9" letterSpacing="1" fill="#fff">
          PLACEMENTS
        </text>
        {Array.from({ length: 12 }).map((_, i) => {
          const cx = 14 + (i % 4) * 19
          const cy = 34 + Math.floor(i / 4) * 15
          return i === 6 || i === 9 || i === 2 ? (
            <path key={i} d={`M${cx - 4} ${cy - 4} l8 8 m0 -8 l-8 8`} stroke="#cf2e2e" strokeWidth="2.4" strokeLinecap="round" />
          ) : (
            <circle key={i} cx={cx} cy={cy} r="3" fill="#e3e1d5" />
          )
        })}
      </Paper>

      {/* rejection mail */}
      <Paper x={20} y={206} r={10} d={0.65} on={on}>
        <rect width="88" height="58" rx="6" fill="#fff" stroke="#e3e1d5" strokeWidth="2" />
        <path d="M2 4 L44 34 L86 4" fill="none" stroke="#e3e1d5" strokeWidth="2.5" />
        <circle cx="80" cy="6" r="13" fill="#cf2e2e" />
        <path d="M75 1 l10 10 m0 -10 l-10 10" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      </Paper>

      {/* question marks */}
      {[
        [130, 70, 30, 0.8],
        [262, 112, 22, 0.95],
        [118, 160, 18, 1.05],
        [228, 48, 26, 1.15],
      ].map(([x, y, fs, d], i) => (
        <motion.g key={i} {...pop(on, d)}>
          <text x={x} y={y} fontFamily="DM Serif Display" fontSize={fs} fill="#8e43ac" className="bob" style={{ ['--d' as string]: `${1.6 + i * 0.3}s` }}>
            ?
          </text>
        </motion.g>
      ))}
    </Svg>
  )
}

/* ---------------- 03 · then they find AntBox ---------------- */
export function SceneDiscover({ on, name }: SceneProps & { name: string }) {
  const full = `Hey ${name || 'you'},`
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (!on) {
      setTyped(0)
      return
    }
    let i = 0
    let id = 0
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        i++
        setTyped(i)
        if (i >= full.length) clearInterval(id)
      }, 70)
    }, 900)
    return () => {
      clearTimeout(start)
      clearInterval(id)
    }
  }, [on, full])

  return (
    <Svg on={on} label={`A student pointing at a desktop screen showing AntBox greeting ${name}`}>
      <ellipse cx="200" cy="330" rx="180" ry="12" fill="#0b0b0d" opacity="0.05" />
      {/* glow */}
      <motion.circle cx="160" cy="150" r="130" fill="#ead2f3" {...pop(on, 0)} />
      <g className="pulse">
        <circle cx="160" cy="150" r="128" fill="none" stroke="#c991df" strokeWidth="2" />
      </g>

      {/* desk */}
      <motion.g {...rise(on, 0.1)}>
        <rect x="18" y="262" width="282" height="14" rx="5" fill="#3d1650" />
        <rect x="40" y="276" width="10" height="50" rx="3" fill="#3d1650" />
        <rect x="268" y="276" width="10" height="50" rx="3" fill="#3d1650" />
        {/* monitor */}
        <rect x="140" y="226" width="40" height="36" fill="#2a2a33" />
        <rect x="112" y="254" width="96" height="9" rx="4" fill="#2a2a33" />
        <rect x="34" y="62" width="252" height="168" rx="14" fill="#0b0b0d" />
        <rect x="44" y="72" width="232" height="146" rx="6" fill="#fbfaf5" />
        {/* screen: mini antbox site */}
        <rect x="44" y="72" width="232" height="20" rx="6" fill="#f5f3ec" />
        <circle cx="56" cy="82" r="5" fill="#8e43ac" />
        <text x="66" y="86" fontFamily="DM Sans" fontWeight="800" fontSize="10" fill="#0b0b0d">
          antbox
        </text>
        <rect x="226" y="77" width="42" height="10" rx="5" fill="#8e43ac" />
        <text x="58" y="128" fontFamily="DM Serif Display" fontSize="24" fill="#0b0b0d">
          {full.slice(0, typed)}
          <tspan className="caret" fill="#8e43ac">
            |
          </tspan>
        </text>
        <text x="58" y="150" fontFamily="DM Sans" fontWeight="500" fontSize="11.5" fill="#55555c">
          your career sprint is ready.
        </text>
        <motion.g {...pop(on, 2)}>
          <rect x="58" y="164" width="92" height="26" rx="13" fill="#8e43ac" />
          <text x="104" y="181" textAnchor="middle" fontFamily="DM Sans" fontWeight="700" fontSize="11" fill="#fff">
            Start sprint →
          </text>
        </motion.g>
        <motion.g {...pop(on, 2.2)}>
          <rect x="170" y="164" width="92" height="44" rx="8" fill="#ead2f3" />
          <text x="180" y="181" fontFamily="DM Sans" fontWeight="700" fontSize="9" fill="#3d1650">
            Readiness
          </text>
          <rect x="180" y="190" width="72" height="6" rx="3" fill="#fff" />
          <motion.rect
            x="180"
            y="190"
            height="6"
            rx="3"
            fill="#8e43ac"
            initial={{ width: 0 }}
            animate={{ width: on ? 34 : 0 }}
            transition={{ duration: 1.2, delay: on ? 2.4 : 0 }}
          />
        </motion.g>
        {/* mug */}
        <rect x="248" y="236" width="24" height="26" rx="5" fill="#c991df" />
        <path d="M272 242 q10 0 10 8 q0 8 -10 8" fill="none" stroke="#c991df" strokeWidth="4" />
        <path className="steam" d="M254 228 q-4 -6 0 -12 q4 -6 0 -12" stroke="#c991df" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path className="steam" style={{ animationDelay: '0.7s' }} d="M266 228 q-4 -6 0 -12 q4 -6 0 -12" stroke="#c991df" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </motion.g>

      {/* student pointing at the screen */}
      <motion.g
        initial={{ x: 80, opacity: 0 }}
        animate={on ? { x: 0, opacity: 1 } : { x: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 14, delay: on ? 0.5 : 0 }}
      >
        <Person
          x={336}
          y={330}
          s={1}
          mood="wow"
          hairStyle="side"
          top="#8e43ac"
          backpack
          lookX={-3}
          left={{ a: 92, e: -6, osc: [0, 6, 0.6] }}
          right={{ a: 30, e: 120 }}
        />
      </motion.g>

      <motion.g {...pop(on, 1.2)}>
        <Sparkle x={30} y={52} s={1.2} />
        <Sparkle x={300} y={58} s={0.9} c="#fcb900" d={0.4} />
        <Sparkle x={378} y={128} s={0.8} d={0.8} />
        <Sparkle x={18} y={196} s={0.7} c="#c991df" d={1.1} />
      </motion.g>
    </Svg>
  )
}

/* ---------------- 04 · antbox trains them ---------------- */
export function SceneTrain({ on }: SceneProps) {
  const bars = [34, 52, 70, 88]
  return (
    <Svg on={on} label="Two mentors guiding a student working on a laptop, readiness score climbing">
      <ellipse cx="200" cy="330" rx="190" ry="12" fill="#0b0b0d" opacity="0.05" />
      {/* whiteboard */}
      <motion.g {...rise(on, 0)}>
        <rect x="104" y="26" width="192" height="118" rx="10" fill="#fff" stroke="#e3e1d5" strokeWidth="3" />
        <text x="118" y="48" fontFamily="DM Sans" fontWeight="800" fontSize="11" fill="#3d1650" letterSpacing="1">
          SPRINT 3 / 4
        </text>
        {bars.map((h, i) => (
          <motion.rect
            key={i}
            x={122 + i * 34}
            width="22"
            rx="4"
            fill={i === 3 ? '#8e43ac' : '#c991df'}
            initial={{ y: 132, height: 0 }}
            animate={on ? { y: 132 - h, height: h } : { y: 132, height: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: on ? 0.6 + i * 0.15 : 0 }}
          />
        ))}
        <motion.path
          d="M128 112 L162 92 L196 76 L232 50 L262 40"
          stroke="#0b0b0d"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="1 0"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: on ? 1 : 0 }}
          transition={{ duration: 1.1, delay: on ? 1.2 : 0 }}
        />
      </motion.g>

      {/* student behind table */}
      <motion.g {...rise(on, 0.25)}>
        <Person x={200} y={330} s={0.95} mood="focus" hairStyle="side" top="#8ed1fc" legs="hidden" left={{ a: 22, e: 40 }} right={{ a: 22, e: 40 }} />
        {/* lightbulb */}
        <motion.g {...pop(on, 1.6)}>
          <g className="bob" style={{ ['--d' as string]: '1.8s' }}>
            <circle cx="244" cy="160" r="14" fill="#fcb900" />
            <rect x="238" y="172" width="12" height="8" rx="2" fill="#2a2a33" />
            <path d="M244 136 v-8 M224 146 l-6 -6 M264 146 l6 -6" stroke="#fcb900" strokeWidth="3" strokeLinecap="round" />
          </g>
        </motion.g>
      </motion.g>

      {/* table + laptop */}
      <motion.g {...rise(on, 0.2, 20)}>
        <path d="M168 270 L232 270 L240 236 L160 236 Z" fill="#b8b8c4" />
        <circle cx="200" cy="253" r="5" fill="#8e43ac" />
        <rect x="80" y="270" width="240" height="14" rx="5" fill="#3d1650" />
        <rect x="100" y="284" width="10" height="46" rx="3" fill="#3d1650" />
        <rect x="290" y="284" width="10" height="46" rx="3" fill="#3d1650" />
      </motion.g>

      {/* mentor left, pointing */}
      <motion.g
        initial={{ x: -60, opacity: 0 }}
        animate={on ? { x: 0, opacity: 1 } : { x: -60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 14, delay: on ? 0.5 : 0 }}
      >
        <Person
          x={62}
          y={330}
          s={0.98}
          mood="smile"
          hairStyle="long"
          hair="#0b0b0d"
          skin="#c98b62"
          top="#0b0b0d"
          bottom="#2a2a33"
          lookX={3}
          right={{ a: 72, e: 18, osc: [0, -10, 0.8] }}
          left={{ a: 6, e: 0 }}
        />
      </motion.g>

      {/* mentor right, tablet + thumbs up */}
      <motion.g
        initial={{ x: 60, opacity: 0 }}
        animate={on ? { x: 0, opacity: 1 } : { x: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 14, delay: on ? 0.65 : 0 }}
      >
        <Person
          x={340}
          y={330}
          s={1}
          mood="happy"
          hairStyle="curly"
          hair="#2a1d17"
          skin="#8d5a3b"
          top="#4ade80"
          bottom="#0b0b0d"
          glasses
          lookX={-3}
          left={{ a: 40, e: 110, hold: <rect x="-14" y="-24" width="24" height="30" rx="3" fill="#0b0b0d" transform="rotate(-20)" /> }}
          right={{ a: 30, e: 140, osc: [0, -12, 0.6], hold: <path d="M-3 -4 v-9 a3 3 0 0 1 6 0 v9" fill="#8d5a3b" /> }}
        />
      </motion.g>

      {/* readiness pill */}
      <motion.g {...pop(on, 1)}>
        <rect x="132" y="-6" width="136" height="28" rx="14" fill="#0b0b0d" />
        <text x="146" y="13" fontFamily="DM Sans" fontWeight="700" fontSize="11" fill="#fff">
          Readiness
        </text>
        <rect x="204" y="5" width="52" height="6" rx="3" fill="#333" />
        <motion.rect
          x="204"
          y="5"
          height="6"
          rx="3"
          fill="#4ade80"
          initial={{ width: 0 }}
          animate={{ width: on ? 46 : 0 }}
          transition={{ duration: 1.6, delay: on ? 1.2 : 0 }}
        />
      </motion.g>

      {/* mentor chat bubble */}
      <motion.g {...pop(on, 1.8)}>
        <g className="bob" style={{ ['--d' as string]: '2.2s' }}>
          <rect x="4" y="96" width="98" height="34" rx="17" fill="#fff" stroke="#e3e1d5" strokeWidth="2" />
          <path d="M60 130 l8 10 l4 -10" fill="#fff" stroke="#e3e1d5" strokeWidth="2" />
          <text x="53" y="118" textAnchor="middle" fontFamily="DM Sans" fontWeight="700" fontSize="11" fill="#0b0b0d">
            Ship it!
          </text>
        </g>
      </motion.g>
    </Svg>
  )
}

/* ---------------- 05 · placed ---------------- */
const CONFETTI = Array.from({ length: 22 }).map((_, i) => ({
  x: 200 + Math.cos(i * 2.4) * (60 + (i % 5) * 26),
  y: 70 + Math.sin(i * 1.7) * 50 - (i % 4) * 14,
  r: (i * 47) % 360,
  c: ['#8e43ac', '#c991df', '#4ade80', '#fcb900', '#0b0b0d'][i % 5],
  d: (i % 7) * 0.08,
}))

export function SceneHired({ on }: SceneProps) {
  return (
    <Svg on={on} label="The student shaking hands with a company representative after landing an offer">
      <ellipse cx="200" cy="330" rx="190" ry="12" fill="#0b0b0d" opacity="0.05" />
      {/* office */}
      <motion.g {...rise(on, 0, 60)}>
        <rect x="236" y="76" width="140" height="244" rx="6" fill="#ead2f3" />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={252 + (i % 3) * 40} y={98 + Math.floor(i / 3) * 46} width="28" height="30" rx="4" fill={i === 4 ? '#fcb900' : '#fbfaf5'} />
        ))}
        <rect x="282" y="282" width="48" height="38" rx="4" fill="#3d1650" />
        <path d="M300 76 v-40" stroke="#3d1650" strokeWidth="3" />
        <g className="wave-flag">
          <path d="M300 36 h40 l-8 10 l8 10 h-40 Z" fill="#8e43ac" />
        </g>
        <text x="318" y="50" textAnchor="middle" fontFamily="DM Sans" fontWeight="800" fontSize="9" fill="#fff">
          PPO
        </text>
      </motion.g>

      {/* offer letter */}
      <motion.g
        initial={{ y: 60, rotate: 0, opacity: 0 }}
        animate={on ? { y: 0, rotate: -10, opacity: 1 } : { y: 60, rotate: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 12, delay: on ? 1.1 : 0 }}
      >
        <g className="bob" style={{ ['--d' as string]: '2.4s' }}>
          <rect x="22" y="40" width="88" height="110" rx="6" fill="#fff" stroke="#e3e1d5" strokeWidth="2" />
          <text x="34" y="64" fontFamily="DM Serif Display" fontSize="16" fill="#0b0b0d">
            Offer
          </text>
          {[74, 84, 94, 104].map((ly) => (
            <rect key={ly} x="34" y={ly} width="62" height="4" rx="2" fill="#ddd" />
          ))}
          <g transform="translate(78 126) rotate(-14)">
            <circle r="17" fill="none" stroke="#4ade80" strokeWidth="3" />
            <path d="M-7 0 l5 5 l9 -10" fill="none" stroke="#4ade80" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      </motion.g>

      {/* student */}
      <motion.g
        initial={{ x: -70, opacity: 0 }}
        animate={on ? { x: 0, opacity: 1 } : { x: -70, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 14, delay: on ? 0.3 : 0 }}
      >
        <Person
          x={119}
          y={330}
          s={1.05}
          mood="happy"
          hairStyle="side"
          top="#fbfaf5"
          blazer="#8e43ac"
          lookX={3}
          left={{ a: 6, e: 0 }}
          right={{ a: 58, e: 32, osc: [-5, 6, 0.3] }}
        />
      </motion.g>

      {/* recruiter */}
      <motion.g
        initial={{ x: 70, opacity: 0 }}
        animate={on ? { x: 0, opacity: 1 } : { x: 70, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 14, delay: on ? 0.45 : 0 }}
      >
        <Person
          x={281}
          y={330}
          s={1.05}
          mood="smile"
          hairStyle="bun"
          hair="#0b0b0d"
          skin="#c98b62"
          top="#fbfaf5"
          blazer="#0b0b0d"
          glasses
          lookX={-3}
          right={{ a: 6, e: 0 }}
          left={{ a: 58, e: 32, osc: [-5, 6, 0.3] }}
        />
      </motion.g>

      {/* confetti burst */}
      {CONFETTI.map((p, i) => (
        <motion.rect
          key={i}
          width="8"
          height="12"
          rx="2"
          fill={p.c}
          initial={{ x: 196, y: 190, scale: 0, rotate: 0 }}
          animate={on ? { x: p.x, y: [190, p.y, p.y + 140], scale: [0, 1, 1, 0], rotate: p.r + 360 } : { x: 196, y: 190, scale: 0 }}
          transition={{ duration: 2.6, ease: 'easeOut', delay: on ? 0.9 + p.d : 0, repeat: on ? Infinity : 0, repeatDelay: 1.2 }}
        />
      ))}

      <motion.g {...pop(on, 1.4)}>
        <rect x="140" y="66" width="120" height="40" rx="20" fill="#4ade80" />
        <text x="200" y="92" textAnchor="middle" fontFamily="DM Sans" fontWeight="800" fontSize="15" fill="#0b0b0d">
          Hired!
        </text>
      </motion.g>
    </Svg>
  )
}

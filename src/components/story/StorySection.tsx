import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'motion/react'
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useIsMobile } from '../../lib/hooks'
import { AntShape } from '../Ant'
import { SplitText } from '../SplitText'
import { SceneDiscover, SceneGraduate, SceneHired, ScenePanic, SceneTrain } from './Scenes'

type Pt = [number, number]
/**
 * A point the line passes through and the direction it travels there.
 * Points on the same circle share `r`; `k` overrides the arc handle length for non-quarter arcs.
 */
type Node = { p: Pt; t: Pt; r?: number; k?: number }

const KAPPA = 0.5523 // cubic Bézier handle ratio for a quarter circle

/** Joins nodes with cubic Béziers whose handles follow each node's tangent. */
function toPath(nodes: Node[], maxHandle: number) {
  const f = (n: number) => n.toFixed(1)
  let d = `M${f(nodes[0].p[0])} ${f(nodes[0].p[1])}`
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i]
    const b = nodes[i + 1]
    const dist = Math.hypot(b.p[0] - a.p[0], b.p[1] - a.p[1])
    // quarter arcs of the same loop get exact circle handles; everything else eases by distance,
    // capped so long drops don't swing the line off-screen
    const h = a.r && a.r === b.r ? (a.k ?? a.r * KAPPA) : Math.min(dist * 0.42, maxHandle)
    const c1: Pt = [a.p[0] + a.t[0] * h, a.p[1] + a.t[1] * h]
    const c2: Pt = [b.p[0] - b.t[0] * h, b.p[1] - b.t[1] * h]
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(b.p[0])} ${f(b.p[1])}`
  }
  return d
}

/**
 * A clean circular loop entered and left at its bottom point.
 * dir 1 travels right along the bottom and turns anticlockwise; dir -1 mirrors it (clockwise).
 */
function loop(cx: number, cy: number, r: number, dir: 1 | -1): Node[] {
  const B: Node = { p: [cx, cy + r], t: [dir, 0], r }
  const side1: Node = { p: [cx + dir * r, cy], t: [0, -1], r }
  const top: Node = { p: [cx, cy - r], t: [-dir, 0], r }
  const side2: Node = { p: [cx - dir * r, cy], t: [0, 1], r }
  return [B, side1, top, side2, { ...B }]
}

/** Anticlockwise arc around (cx, cy) from one angle to another (degrees, SVG y-down, `to` < `from`). */
function arc(cx: number, cy: number, r: number, from: number, to: number): Node[] {
  const steps = Math.ceil((from - to) / 60)
  const seg = ((from - to) / steps) * (Math.PI / 180)
  const k = (4 / 3) * Math.tan(seg / 4) * r
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = (from * Math.PI) / 180 - i * seg
    return { p: [cx + r * Math.cos(a), cy + r * Math.sin(a)], t: [Math.sin(a), -Math.cos(a)], r, k }
  })
}

const DOWN: Pt = [0, 1]
// in chapter 3 the line wraps around the glowing circle behind the monitor instead of passing through
const RING_CHAPTER = 2
const RING = { cx: 160, cy: 150, r: 130, viewW: 400 } // matches the circle in SceneDiscover

type Table = { len: Float32Array; x: Float32Array; y: Float32Array; h: Float32Array; total: number }

const CHAPTERS: { title: string; text: ReactNode; tags: string[] }[] = [
  {
    title: 'Out the gate.',
    text: 'Four years, one degree, zero clue. The college gates close behind you and the real question swings wide open: now what?',
    tags: ['Final year', 'Degree: done', 'Plan: none'],
  },
  {
    title: 'Placement panic.',
    text: "Resume draft #14. A CGPA you can't change. Rejection mails landing faster than replies. Everyone says “get experience” — nobody says where.",
    tags: ['47 applications', '0 callbacks', 'CGPA 7.2'],
  },
  {
    title: 'Then — AntBox.',
    text: 'A platform that actually knows your name. Curated career sprints from top companies, real briefs, and a readiness score that shows exactly where you stand.',
    tags: ['Apply in < 2 min', 'Real briefs'],
  },
  {
    title: 'Trained by people who hire.',
    text: 'Corporate-hosted sprints with mentors from the industry. Live work experience through scaled internships. Your readiness score climbs with every brief you ship.',
    tags: ['Mentors', 'Live projects', 'Readiness 88%'],
  },
  {
    title: 'Shake on it.',
    text: 'Top sprint performers get Pre-Placement Offers straight from the companies they sprinted with. No resume round. Just proof of work — and a handshake.',
    tags: ['PPO', 'No resume round', 'Hired'],
  },
]

export function StorySection({ name, setName }: { name: string; setName: (n: string) => void }) {
  const mobile = useIsMobile()
  const trackRef = useRef<HTMLDivElement>(null)
  const artRefs = useRef<(HTMLDivElement | null)[]>([])
  const stroke = mobile ? 26 : 84
  const pathRef = useRef<SVGPathElement>(null)
  const table = useRef<Table | null>(null)
  const anchorsY = useRef<number[]>([])
  const [geo, setGeo] = useState({ w: 0, h: 0, d: '' })
  const [reached, setReached] = useState(-1)

  const dash = useMotionValue(0)
  const total = useMotionValue(1)
  const antX = useMotionValue(0)
  const antY = useMotionValue(-200)
  const antR = useMotionValue(90)
  const antO = useMotionValue(0)

  // 1. build path geometry from the live layout
  const build = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const tr = track.getBoundingClientRect()
    const w = tr.width
    const h = tr.height
    const anchors: Pt[] = artRefs.current.map((el) => {
      const r = el!.getBoundingClientRect()
      return [r.left - tr.left + r.width / 2, r.top - tr.top + r.height * 0.55]
    })
    anchorsY.current = anchors.map((a) => a[1])

    if (mobile) {
      // Phones: the copy cards span the width, so the line keeps to its own lane on the left edge
      // and hangs one clean loop off that lane into each illustration.
      const R = stroke / 2 + 6
      const lane: Node[] = [{ p: [R, stroke / 2 + 4], t: DOWN }]
      artRefs.current.forEach((el, i) => {
        const art = el!.getBoundingClientRect()
        const sc = art.width / RING.viewW
        const top = art.top - tr.top
        let cx: number
        let cy: number
        let r: number
        if (i === RING_CHAPTER) {
          // wrap the glowing circle behind the monitor
          r = RING.r * sc + stroke / 2 + 4
          cx = art.left - tr.left + RING.cx * sc
          cy = top + RING.cy * sc
        } else {
          r = w * 0.2
          cx = R + r
          cy = top + art.height * 0.45
        }
        // join the lane to the loop's left point, go once round anticlockwise, rejoin the lane
        lane.push({ p: [cx - r, cy - r * 1.2], t: DOWN }, ...arc(cx, cy, r, 180, -180), { p: [R, cy + r * 1.4], t: DOWN })
      })
      lane.push({ p: [R, h + 40], t: DOWN })
      setGeo({ w, h, d: toPath(lane, w * 0.3) })
      return
    }

    const nodes: Node[] = [
      { p: [w * 0.5, stroke / 2 + 4], t: DOWN },
      { p: [w * 0.42, Math.min(120, anchors[0][1] * 0.3)], t: DOWN },
    ]
    anchors.forEach((a, i) => {
      if (i === RING_CHAPTER) {
        // come in over the top of the circle, sweep anticlockwise down its left side, leave along the bottom
        const art = artRefs.current[i]!.getBoundingClientRect()
        const sc = art.width / RING.viewW
        const cx = art.left - tr.left + RING.cx * sc
        const cy = art.top - tr.top + RING.cy * sc
        nodes.push(...arc(cx, cy, RING.r * sc + stroke / 2 + 14, -80, -260))
      } else {
        nodes.push({ p: a, t: DOWN })
      }
      const b = anchors[i + 1]
      if (!b) return
      const r = Math.min(w * 0.11, 150)
      nodes.push(...loop((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - r * 0.3, r, b[0] > a[0] ? 1 : -1))
    })
    const last = anchors[anchors.length - 1]
    nodes.push({ p: [w * 0.5, last[1] + (h - last[1]) * 0.6], t: DOWN }, { p: [w * 0.5, h + 40], t: DOWN })
    setGeo({ w, h, d: toPath(nodes, w * 0.22) })
  }, [mobile, stroke])

  useLayoutEffect(() => {
    build()
    const ro = new ResizeObserver(() => build())
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [build])

  // 2. sample the path once into a lookup table: length → point, plus a monotone
  //    "progress height" so loops consume scroll instead of jumping
  useLayoutEffect(() => {
    const p = pathRef.current
    if (!p || !geo.d) return
    const L = p.getTotalLength()
    const n = Math.max(2, Math.ceil(L / 6))
    const t: Table = { len: new Float32Array(n), x: new Float32Array(n), y: new Float32Array(n), h: new Float32Array(n), total: L }
    let maxY = -Infinity
    const W = 0.4
    for (let i = 0; i < n; i++) {
      const l = (i / (n - 1)) * L
      const pt = p.getPointAtLength(l)
      maxY = Math.max(maxY, pt.y)
      t.len[i] = l
      t.x[i] = pt.x
      t.y[i] = pt.y
      t.h[i] = (1 - W) * maxY + W * (l / L) * geo.h
    }
    table.current = t
    total.set(L)
    update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo])

  // 3. scroll → draw
  const update = () => {
    const t = table.current
    const track = trackRef.current
    if (!t || !track) return
    const vh = window.innerHeight
    const target = vh * (mobile ? 0.6 : 0.58) - track.getBoundingClientRect().top
    let lo = 0
    let hi = t.h.length - 1
    if (target <= t.h[0]) hi = 0
    else if (target >= t.h[hi]) lo = hi
    else {
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1
        if (t.h[mid] < target) lo = mid
        else hi = mid
      }
    }
    const i = Math.min(lo, t.len.length - 2)
    const span = t.h[i + 1] - t.h[i] || 1
    const f = Math.min(1, Math.max(0, (target - t.h[i]) / span))
    const l = t.len[i] + (t.len[i + 1] - t.len[i]) * f
    const x = t.x[i] + (t.x[i + 1] - t.x[i]) * f
    const y = t.y[i] + (t.y[i + 1] - t.y[i]) * f
    const j = Math.max(0, i - 3)
    const k = Math.min(t.len.length - 1, i + 3)
    dash.set(t.total - l)
    antX.set(x)
    antY.set(y)
    antR.set((Math.atan2(t.y[k] - t.y[j], t.x[k] - t.x[j]) * 180) / Math.PI)
    antO.set(l > 4 && l < t.total - 4 ? 1 : 0)

    let r = -1
    anchorsY.current.forEach((ay, idx) => {
      if (target > ay - vh * 0.22) r = idx
    })
    setReached((prev) => (prev === r ? prev : r))
  }

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', update)


  return (
    <section className="story" id="story">
      <div className="story__intro">
        <p className="eyebrow purple" style={{ marginBottom: 18 }}>

        </p>
        <SplitText as="h2" text={['Every career', 'has a plot twist.']} stagger={0.02} />
        <p>Follow the line. It's the same road thousands of students walk — until it isn't.</p>
      </div>

      <div className="story__track" ref={trackRef}>
        <svg className="story__svg" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w || 1} ${geo.h || 1}`} aria-hidden>
          <path d={geo.d} fill="none" stroke="#c991df" strokeOpacity="0.35" strokeWidth={2} strokeDasharray="3 12" strokeLinecap="round" />
          <motion.path
            ref={pathRef}
            d={geo.d}
            fill="none"
            stroke="#8e43ac"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: total, strokeDashoffset: dash }}
          />
        </svg>
        <motion.svg className="story__ant" viewBox="-30 -30 60 60" style={{ x: antX, y: antY, rotate: antR, opacity: antO }} aria-hidden>
          <circle r="22" fill="#fbfaf5" />
          <g transform="scale(1.05)">
            <AntShape walking />
          </g>
        </motion.svg>

        {CHAPTERS.map((c, i) => (
          <article key={i} className={`chapter ${i % 2 ? 'chapter--flip' : ''}`}>
            <div className="chapter__art" ref={(el) => void (artRefs.current[i] = el)}>
              {i === 0 && <SceneGraduate on={reached >= 0} />}
              {i === 1 && <ScenePanic on={reached >= 1} />}
              {i === 2 && <SceneDiscover on={reached >= 2} name={name} />}
              {i === 3 && <SceneTrain on={reached >= 3} />}
              {i === 4 && <SceneHired on={reached >= 4} />}
            </div>
            <ChapterCopy c={c} i={i} reached={reached} name={name} setName={setName} />
          </article>
        ))}
      </div>
    </section>
  )
}

type CopyProps = { c: (typeof CHAPTERS)[number]; i: number; reached: number; name: string; setName: (n: string) => void }

function ChapterCopy({ c, i, reached, name, setName }: CopyProps) {
  return (
    <motion.div
      className="chapter__copy"
      initial={{ opacity: 0, y: 60 }}
      animate={reached >= i ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: reached >= i ? 0.25 : 0 }}
    >
      <div className="chapter__num eyebrow">
        <span>0{i + 1}</span> Chapter
      </div>
      <SplitText as="h3" className="chapter__title" text={c.title} play={reached >= i} delay={0.3} stagger={0.018} />
      <p className="chapter__text">{c.text}</p>
      {i === 2 && (
        <div className="name-field">
          <label htmlFor="ab-name">Your name →</label>
          <input id="ab-name" value={name} maxLength={12} onChange={(e) => setName(e.target.value)} placeholder="Type it" autoComplete="given-name" />
        </div>
      )}
      <div className="chapter__tags">
        {c.tags.map((t, ti) => (
          <motion.span
            key={t}
            className="tag"
            initial={{ scale: 0 }}
            animate={{ scale: reached >= i ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: reached >= i ? 0.7 + ti * 0.08 : 0 }}
          >
            {t}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

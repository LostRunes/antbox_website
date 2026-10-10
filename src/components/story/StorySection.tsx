import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'motion/react'
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useIsMobile } from '../../lib/hooks'
import { AntShape } from '../Ant'
import { SplitText } from '../SplitText'
import { SceneDiscover, SceneGraduate, SceneHired, ScenePanic, SceneTrain } from './Scenes'

type Pt = [number, number]

/** Catmull-Rom spline through points → cubic Bézier path string. */
function spline(pts: Pt[]) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

/** A full loop-de-loop around (cx, cy), spinning in the direction of travel. */
function loop(cx: number, cy: number, r: number, dir: 1 | -1): Pt[] {
  const out: Pt[] = []
  for (let k = 0; k <= 8; k++) {
    const t = Math.PI / 2 - dir * k * (Math.PI / 4)
    // drift slightly along travel so the loop opens up like handwriting
    out.push([cx + r * Math.cos(t) + dir * k * r * 0.09, cy + r * Math.sin(t) + k * r * 0.05])
  }
  return out
}

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
    const tops: number[] = []
    const anchors: Pt[] = artRefs.current.map((el, i) => {
      const r = el!.getBoundingClientRect()
      tops.push(r.top - tr.top)
      // on phones the scenes stack in one column, so swing the line side to side
      const x = mobile ? w * (i % 2 ? 0.7 : 0.3) : r.left - tr.left + r.width / 2
      return [x, r.top - tr.top + r.height * 0.55]
    })
    anchorsY.current = anchors.map((a) => a[1])
    const pts: Pt[] = [[w * 0.5, -40], [w * (mobile ? 0.5 : 0.42), Math.min(120, anchors[0][1] * 0.3)]]
    anchors.forEach((a, i) => {
      pts.push(a)
      const b = anchors[i + 1]
      if (!b) return
      if (mobile) {
        // the copy card sits between scenes on phones, so loop at the top of the next scene where it's visible
        const r = w * 0.17
        const dir: 1 | -1 = b[0] > w / 2 ? -1 : 1
        pts.push(...loop(w - b[0], tops[i + 1] + r * 0.9, r, dir))
        return
      }
      const dir: 1 | -1 = b[0] > a[0] ? 1 : -1
      const r = Math.min(w * 0.11, 150)
      pts.push(...loop((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - r * 0.3, r, dir))
    })
    const last = anchors[anchors.length - 1]
    pts.push([w * 0.5, last[1] + (h - last[1]) * 0.6], [w * 0.5, h + 40])
    setGeo({ w, h, d: spline(pts) })
  }, [mobile])

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

  const stroke = mobile ? 26 : 64

  return (
    <section className="story" id="story">
      <div className="story__intro">
        <p className="eyebrow purple" style={{ marginBottom: 18 }}>
          A story in five scrolls
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
          </article>
        ))}
      </div>
    </section>
  )
}

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFinePointer, useIsMobile } from '../../lib/hooks'
import { scrollToId } from '../../lib/smooth'

type Pin = { id: string; x: number; z: number; title: string; text: string; target: string; summit?: boolean }

// world coordinates on the terrain; ordered from base camp to the summit
const PINS: Pin[] = [
  { id: 'base', x: -46, z: 34, title: 'Base camp: apply', text: 'Pick a sprint and apply in under 2 minutes. No resume screen.', target: 'walkthrough' },
  { id: 'track', x: -24, z: 12, title: 'Pick your track', text: 'Product, engineering, data, design and more, all briefed by real companies.', target: 'tracks' },
  { id: 'brief', x: -2, z: -6, title: 'Ship real briefs', text: 'Two weeks on a live company problem with a mentor who hires.', target: 'journey' },
  { id: 'score', x: 22, z: -18, title: 'Readiness score', text: 'Every brief you ship pushes your AI-validated score higher.', target: 'proof' },
  { id: 'tribe', x: 36, z: 16, title: 'Corporates watch the climb', text: 'Companies build tribes from people already proving themselves.', target: 'audience' },
  { id: 'summit', x: 8, z: -42, title: 'The summit: a PPO', text: 'Top performers walk away with a Pre-Placement Offer before graduating.', target: 'join', summit: true },
]

/* ---------- terrain ---------- */
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
function noise(x: number, y: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy)
  const b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1)
  const d = hash(ix + 1, iy + 1)
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy
}
/** ridged fractal noise: sharp crests, soft valleys */
function ridged(x: number, y: number) {
  let sum = 0
  let amp = 0.55
  let f = 1
  for (let o = 0; o < 5; o++) {
    const n = 1 - Math.abs(noise(x * f, y * f) * 2 - 1)
    sum += n * n * amp
    f *= 2.05
    amp *= 0.5
  }
  return sum
}
const bump = (x: number, z: number, cx: number, cz: number, s: number) => Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (2 * s * s))

function height(x: number, z: number) {
  const massif = bump(x, z, 8, -46, 30) * 44 + bump(x, z, -38, -30, 26) * 22 + bump(x, z, 52, -26, 24) * 26 + bump(x, z, 44, 14, 16) * 9
  const rise = Math.max(0, (60 - z) / 120) // land climbs toward the back
  const detail = ridged(x * 0.035 + 3.1, z * 0.035 + 7.7) * (8 + massif * 0.35)
  return massif + detail * (0.45 + rise) + rise * 10 - 4
}

const LOW = new THREE.Color('#ead2f3')
const HIGH = new THREE.Color('#fbfaf5')
const CREASE = new THREE.Color('#a958c5')
const FOG = new THREE.Color('#f5f3ec')

function buildTerrain(seg: number) {
  const W = 220
  const D = 170
  const geo = new THREE.PlaneGeometry(W, D, seg, Math.round(seg * (D / W)))
  geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) pos.setY(i, height(pos.getX(i), pos.getZ(i)))
  geo.computeVertexNormals()
  const nrm = geo.attributes.normal as THREE.BufferAttribute
  const colors = new Float32Array(pos.count * 3)
  const c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const t = THREE.MathUtils.clamp((pos.getY(i) + 4) / 52, 0, 1)
    const slope = 1 - nrm.getY(i)
    c.copy(LOW).lerp(HIGH, Math.pow(t, 0.6))
    c.lerp(CREASE, THREE.MathUtils.clamp((slope - 0.32) * 1.3, 0, 0.55))
    colors.set([c.r, c.g, c.b], i * 3)
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geo
}

function buildTrail() {
  const pts = [...PINS.filter((p) => p.id !== 'tribe').map((p) => new THREE.Vector3(p.x, 0, p.z))]
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5)
  const samples = curve.getSpacedPoints(260).map((p) => new THREE.Vector3(p.x, height(p.x, p.z) + 0.8, p.z))
  const draped = new THREE.CatmullRomCurve3(samples)
  return new THREE.TubeGeometry(draped, 600, 0.9, 8, false)
}

/* ---------- component ---------- */
export default function MountainScene() {
  const fine = useFinePointer()
  const mobile = useIsMobile()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pinRefs = useRef<(HTMLDivElement | null)[]>([])
  const [hover, setHover] = useState<number | null>(null)
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const wrap = wrapRef.current!
    const canvas = canvasRef.current!
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75))
    renderer.setClearColor(FOG)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(FOG, 230, 420)
    const camera = new THREE.PerspectiveCamera(mobile ? 58 : 34, 1, 1, 800)

    scene.add(new THREE.HemisphereLight('#ffffff', '#c991df', 1.6))
    const sun = new THREE.DirectionalLight('#fff6ee', 2.1)
    sun.position.set(-80, 120, 40)
    scene.add(sun)

    const terrainGeo = buildTerrain(mobile ? 130 : 220)
    const terrainMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 })
    scene.add(new THREE.Mesh(terrainGeo, terrainMat))

    const trailGeo = buildTrail()
    const trailMat = new THREE.MeshBasicMaterial({ color: '#8e43ac', fog: false })
    const trail = new THREE.Mesh(trailGeo, trailMat)
    scene.add(trail)
    const trailCount = trailGeo.index!.count

    const ground = PINS.map((p) => new THREE.Vector3(p.x, height(p.x, p.z) + 0.5, p.z))
    const tmp = new THREE.Vector3()
    const look = mobile ? new THREE.Vector3(-5, 33, -12) : new THREE.Vector3(10, 26, -18)

    let w = 1
    let h = 1
    const resize = () => {
      w = wrap.clientWidth
      h = wrap.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    // pointer sway (desktop) + scroll dolly
    let mx = 0
    let my = 0
    let smx = 0
    let smy = 0
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      mx = (e.clientX - r.left) / r.width - 0.5
      my = (e.clientY - r.top) / r.height - 0.5
    }
    if (fine) wrap.addEventListener('pointermove', onMove)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let visible = false
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '100px' })
    io.observe(wrap)

    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      const t = (now - start) / 1000
      const r = wrap.getBoundingClientRect()
      const prog = THREE.MathUtils.clamp((window.innerHeight - r.top) / (window.innerHeight + r.height), 0, 1)

      smx += (mx - smx) * 0.05
      smy += (my - smy) * 0.05
      const sway = reduce ? 0 : Math.sin(t * 0.12) * 0.1
      const ang = sway + smx * 0.22
      const dist = (mobile ? 205 : 215) - prog * 25
      camera.position.set(Math.sin(ang) * dist, 46 - prog * 6 - smy * 8, Math.cos(ang) * dist)
      camera.lookAt(look)

      // the purple trail climbs as the section scrolls into view
      const draw = THREE.MathUtils.clamp((prog - 0.15) / 0.45, 0, 1)
      trailGeo.setDrawRange(0, Math.floor((trailCount / 3) * draw) * 3)

      renderer.render(scene, camera)

      // pin the HTML markers to their spots on the terrain
      ground.forEach((g, i) => {
        const el = pinRefs.current[i]
        if (!el) return
        tmp.copy(g).project(camera)
        const x = (tmp.x * 0.5 + 0.5) * w
        const y = (-tmp.y * 0.5 + 0.5) * h
        const show = tmp.z < 1 && x > -40 && x < w + 40 && y > 0 && y < h + 40
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
        el.style.opacity = show ? '1' : '0'
      })
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      wrap.removeEventListener('pointermove', onMove)
      terrainGeo.dispose()
      terrainMat.dispose()
      trailGeo.dispose()
      trailMat.dispose()
      renderer.dispose()
    }
  }, [fine, mobile])

  const open = (i: number) => {
    const el = pinRefs.current[i]
    const wrap = wrapRef.current
    if (!el || !wrap) return
    const m = /translate3d\(([-\d.]+)px, ([-\d.]+)px/.exec(el.style.transform)
    if (m) setTipPos({ x: Number(m[1]), y: Number(m[2]) })
    setHover(i)
  }

  const go = (i: number) => {
    // touch: first tap previews, second tap goes
    if (!fine && hover !== i) return open(i)
    setHover(null)
    scrollToId(PINS[i].target)
  }

  const pin = hover === null ? null : PINS[hover]
  const flip = tipPos.x > (wrapRef.current?.clientWidth ?? 0) * 0.62
  // near the top edge the card opens below the pin instead of above it
  const below = tipPos.y < 260

  return (
    <div className="mtn__stage" ref={wrapRef} onPointerLeave={() => fine && setHover(null)}>
      <canvas ref={canvasRef} className="mtn__canvas" aria-hidden />
      <div className="mtn__pins">
        {PINS.map((p, i) => (
          <div key={p.id} className="mtn__pin" ref={(el) => void (pinRefs.current[i] = el)}>
            <span className="mtn__stem" />
            <button
              className={`mtn__plus ${p.summit ? 'is-summit' : ''} ${hover === i ? 'is-on' : ''}`}
              aria-label={`${p.title}. ${p.text}`}
              onPointerEnter={() => fine && open(i)}
              onFocus={() => fine && open(i)}
              onClick={() => go(i)}
              data-cursor="Go"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {pin && (
          <motion.div
            key={pin.id}
            className={`mtn__tip ${mobile ? 'is-docked' : ''} ${flip ? 'is-flip' : ''} ${below ? 'is-below' : ''}`}
            style={mobile ? undefined : { left: tipPos.x, top: tipPos.y }}
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <small>{String(hover! + 1).padStart(2, '0')} / 0{PINS.length}</small>
            <b>{pin.title}</b>
            <p>{pin.text}</p>
            <span className="mtn__go">{fine ? 'Click to jump there' : 'Tap again to jump there'} →</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

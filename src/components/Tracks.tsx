import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useFinePointer, useIsMobile } from '../lib/hooks'

type Brief = { co: string; c: string; brief: string; days: number }

const CO = {
  northwind: { co: 'Northwind Labs', c: '#c991df' },
  lumen: { co: 'Lumen Finance', c: '#4ade80' },
  kite: { co: 'Kite Health', c: '#fcb900' },
  orbit: { co: 'Orbit Retail', c: '#8ed1fc' },
  pine: { co: 'Pine Mobility', c: '#f78da7' },
  halo: { co: 'Halo Media', c: '#fbfaf5' },
  atlas: { co: 'Atlas Logistics', c: '#ead2f3' },
  nova: { co: 'Nova Energy', c: '#7bdcb5' },
}

const b = (k: keyof typeof CO, brief: string, days = 14): Brief => ({ ...CO[k], brief, days })

const TRACKS: { name: string; briefs: Brief[] }[] = [
  { name: 'Product', briefs: [b('northwind', 'Redesign onboarding for 2M users'), b('lumen', 'Pricing page experiment', 10), b('kite', 'Patient app roadmap'), b('orbit', 'Checkout drop-off teardown', 7)] },
  { name: 'Engineering', briefs: [b('pine', 'Live ride-tracking service'), b('lumen', 'Fraud alert pipeline'), b('northwind', 'Cut page load in half', 10), b('atlas', 'Warehouse scanner app')] },
  { name: 'Data & AI', briefs: [b('orbit', 'Demand forecast for 400 stores'), b('kite', 'Appointment no-show model'), b('nova', 'Grid usage dashboard', 10), b('halo', 'Recommendation tuning')] },
  { name: 'Design', briefs: [b('halo', 'Rebrand the podcast app'), b('kite', 'Accessible booking flow'), b('pine', 'Driver app dark mode', 7), b('northwind', 'Design system audit', 10)] },
  { name: 'Marketing', briefs: [b('orbit', 'Festive season campaign'), b('nova', 'Launch a solar plan', 10), b('halo', 'Grow a creator community'), b('lumen', 'Gen Z savings push')] },
  { name: 'Finance', briefs: [b('lumen', 'Model a new credit line'), b('atlas', 'Freight cost breakdown', 10), b('nova', 'Plant investment case'), b('orbit', 'Store-level P&L review', 7)] },
  { name: 'Consulting', briefs: [b('atlas', 'Same-day delivery in 5 cities'), b('kite', 'Clinic expansion plan'), b('pine', 'EV fleet switch strategy'), b('nova', 'Rural market entry', 10)] },
  { name: 'Content', briefs: [b('halo', 'Script a 6-part series'), b('northwind', 'Help centre rewrite', 7), b('lumen', 'Money explainer videos'), b('kite', 'Health myths newsletter', 10)] },
  { name: 'Operations', briefs: [b('atlas', 'Cut returns handling time'), b('pine', 'Driver shift planner', 10), b('orbit', 'Inventory count overhaul'), b('kite', 'Clinic queue redesign', 7)] },
]

// where the four cards land around the active row: [x as % of width, y offset in px, rotation]
const SPOTS_DESKTOP: [number, number, number][] = [
  [-38, -150, -9],
  [38, -170, 7],
  [-36, 150, 6],
  [37, 140, -8],
]
const SPOTS_MOBILE: [number, number, number][] = [
  [-22, -112, -7],
  [22, 108, 6],
]

/** Big stacked list of career tracks; the active one turns handwritten and throws out sprint briefs. */
export function Tracks() {
  const fine = useFinePointer()
  const mobile = useIsMobile()
  const [active, setActive] = useState<number | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const [rowY, setRowY] = useState(0)

  // touch screens: the row nearest the middle of the viewport is the active one
  useEffect(() => {
    if (fine) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i))
      },
      { rootMargin: '-48% 0px -48% 0px' },
    )
    itemRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [fine])

  // keep the cards centred on the active row, even as its neighbours shift
  useEffect(() => {
    if (active === null) return
    const el = itemRefs.current[active]
    const list = listRef.current
    if (!el || !list) return
    const measure = () => setRowY(el.offsetTop + el.offsetHeight / 2)
    measure()
    const t = window.setTimeout(measure, 350)
    return () => clearTimeout(t)
  }, [active])

  const spots = mobile ? SPOTS_MOBILE : SPOTS_DESKTOP
  const track = active === null ? null : TRACKS[active]

  return (
    <section className="tracks" id="tracks">
      <div className="tracks__inner">
        <header className="tracks__head">
          <p className="tracks__label">Sprint in</p>
          <motion.p
            className="tracks__aside"
            initial={{ opacity: 0, rotate: -8 }}
            whileInView={{ opacity: 1, rotate: -8 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            there's a brief for every kind of builder
          </motion.p>
        </header>

        <div className="tracks__stage">
          <ul className="tracks__list" ref={listRef} onPointerLeave={() => fine && setActive(null)}>
            {TRACKS.map((t, i) => (
              <li
                key={t.name}
                data-i={i}
                ref={(el) => void (itemRefs.current[i] = el)}
                className={`tracks__item ${active === i ? 'is-on' : ''} ${active !== null && active !== i ? 'is-dim' : ''}`}
                onPointerEnter={() => fine && setActive(i)}
                data-cursor="Briefs"
              >
                <span className="tracks__word tracks__word--set">{t.name}</span>
                <span className="tracks__word tracks__word--hand" aria-hidden>
                  {t.name}
                </span>
              </li>
            ))}
            <li className="tracks__item tracks__item--more">and more.</li>
          </ul>

          <div className="tracks__cards" aria-hidden>
            <AnimatePresence>
              {track &&
                track.briefs.slice(0, spots.length).map((br, k) => {
                  const [x, dy, r] = spots[k]
                  return (
                    <motion.div
                      key={`${track.name}-${k}`}
                      className="brief"
                      style={{ top: rowY, left: '50%' }}
                      initial={{ x: '-50%', y: '-50%', scale: 0.3, rotate: 0, opacity: 0 }}
                      animate={{ x: `calc(-50% + ${x}vw)`, y: `calc(-50% + ${dy}px)`, scale: 1, rotate: r, opacity: 1 }}
                      exit={{ x: '-50%', y: '-50%', scale: 0.3, rotate: 0, opacity: 0, transition: { duration: 0.22 } }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: k * 0.04 }}
                    >
                      <div className="brief__top">
                        <span className="brief__logo" style={{ background: br.c }}>
                          {br.co[0]}
                        </span>
                        <span className="brief__co">{br.co}</span>
                      </div>
                      <small>Sprint brief</small>
                      <b>{br.brief}</b>
                      <div className="brief__meta">
                        <span>{br.days} days</span>
                        <span>Mentored</span>
                        <span className="brief__ppo">PPO track</span>
                      </div>
                    </motion.div>
                  )
                })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

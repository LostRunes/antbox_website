import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Note } from './Note'
import { SplitText } from './SplitText'

const KPIS = [
  ['1000+', 'Active candidates'],
  ['87%', 'Avg readiness'],
  ['7+', 'Bootcamps'],
  ['3', 'University partners'],
]
const BARS = [38, 52, 45, 63, 58, 72, 66, 81, 77, 88, 84, 93]
const PEOPLE = [
  { n: 'Priya S.', i: 'PS', s: 92, c: '#c991df', r: 'Product' },
  { n: 'Arjun K.', i: 'AK', s: 88, c: '#4ade80', r: 'Engineering' },
  { n: 'Meera J.', i: 'MJ', s: 85, c: '#fcb900', r: 'Design' },
  { n: 'Rohan D.', i: 'RD', s: 81, c: '#f78da7', r: 'Marketing' },
]

/** Tribe analytics dashboard that tilts flat from a steep 3D angle as it scrolls in. */
export function Product() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [38, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1])
  const y = useTransform(scrollYProgress, [0, 1], [80, 0])

  return (
    <section className="product" id="product">
      <div className="product__head">
        <p className="eyebrow lilac">Tribe analytics engine</p>
        <SplitText as="h2" text={['Your tribe,', 'at a glance.']} stagger={0.02} />
        <p>A corporate dashboard that shows who's ready, who's rising and who fits — powered by the AI readiness engine.</p>
        <Note arrow="down-left" rotate={-4} style={{ right: '9%', bottom: '-70px', color: 'var(--lilac)' }}>
          your future manager's view
        </Note>
      </div>

      <motion.div className="dash" ref={ref} style={{ rotateX, scale, y }}>
        <div className="dash__bar">
          <i style={{ background: '#ff5f57' }} />
          <i style={{ background: '#febc2e' }} />
          <i style={{ background: '#28c840' }} />
          <span>antbox · tribe analytics</span>
        </div>
        <div className="dash__body">
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="dash__kpis">
              {KPIS.map(([v, l], i) => (
                <motion.div
                  key={l}
                  className="dash__kpi"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <b>{v}</b>
                  <small>{l}</small>
                </motion.div>
              ))}
            </div>
            <div className="dash__panel">
              <h4>Readiness across sprints</h4>
              <div className="dash__chart">
                {BARS.map((h, i) => (
                  <motion.i
                    key={i}
                    style={{ height: `${h}%` }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.05 }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="dash__panel">
            <h4>Top of the tribe</h4>
            {PEOPLE.map((p, i) => (
              <motion.div
                key={p.n}
                className="dash__row"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <span className="dash__av" style={{ background: p.c }}>
                  {p.i}
                </span>
                <div>
                  {p.n} <small style={{ opacity: 0.5 }}>· {p.r}</small>
                  <div className="dash__meter">
                    <motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: p.s / 100 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.6 + i * 0.1 }} />
                  </div>
                </div>
                <span className="dash__score">{p.s}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

import { animate, LayoutGroup, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { Check, FakeCursor, popIn, rise, Star, useAfter, useTyped } from './kit'

/* All screens are laid out in an 800 × 500 content box (below the browser bar). */

/* ---------------- 1 · search ---------------- */
export function SearchScreen() {
  const q = useTyped('antbox career sprints', 600, 60)
  const results = useAfter(2300)
  const picked = useAfter(3400)
  const RES = [
    { url: 'theantbox.com › sprints', title: 'AntBox — The platform that bridges talent with opportunity', text: 'Curated career sprints from top companies. Real briefs, industry mentors and Pre-Placement Offers.' },
    { url: 'theantbox.com › students', title: 'Own your career story — AntBox for students', text: 'Apply in under 2 minutes. Get an AI-validated readiness score.' },
    { url: 'theantbox.com › corporates', title: 'Build your own tribes — AntBox for companies', text: 'Replace months of screening with a 2-week sprint.' },
  ]
  return (
    <div className="ws ws--search">
      <motion.div className="ws-search__brand" {...rise(0.1)}>
        search<span>.</span>
      </motion.div>
      <motion.div className="ws-search__bar" {...rise(0.2)} animate={{ opacity: 1, y: results ? -70 : 0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="#8e43ac" strokeWidth="2.4" />
          <path d="M16.5 16.5L21 21" stroke="#8e43ac" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        <span>
          {q}
          <i className="ws-caret" />
        </span>
      </motion.div>
      {results && (
        <div className="ws-search__results">
          {RES.map((r, i) => (
            <motion.div key={r.url} className={`ws-result ${i === 0 && picked ? 'is-picked' : ''}`} {...rise(i * 0.12, 20)}>
              <small>{r.url}</small>
              <b>{r.title}</b>
              <p>{r.text}</p>
            </motion.div>
          ))}
        </div>
      )}
      <FakeCursor
        path={[
          [720, 470, 0],
          [420, 168, 0.5],
          [420, 168, 2.6],
          [300, 186, 3.2],
          [300, 186, 4],
        ]}
        clicks={[0.55, 3.35]}
      />
    </div>
  )
}

/* ---------------- 2 · apply ---------------- */
const SPRINTS = [
  { co: 'Northwind Labs', role: 'Product Sprint', c: '#c991df', i: 'N' },
  { co: 'Lumen Finance', role: 'Data Sprint', c: '#4ade80', i: 'L' },
  { co: 'Kite Health', role: 'Design Sprint', c: '#fcb900', i: 'K' },
]

export function ApplyScreen({ name }: { name: string }) {
  const drawer = useAfter(1300)
  // with no visitor name, the form fills an email instead of inventing a name
  const first = name || 'you@college.edu'
  const typedName = useTyped(first, 1800, 70)
  const college = useTyped('State University', 2400, 45)
  const track = useAfter(3100)
  const sent = useAfter(3900)
  return (
    <div className="ws ws--site">
      <AntboxBar />
      <div className="ws-site__body">
        <motion.h3 className="ws-h" {...rise(0.1)}>
          Open career sprints
        </motion.h3>
        <motion.div className="ws-chips" {...rise(0.2)}>
          {['All', 'Product', 'Data', 'Design', 'Marketing'].map((c, i) => (
            <span key={c} className={i === 0 ? 'is-on' : ''}>
              {c}
            </span>
          ))}
        </motion.div>
        <div className="ws-cards">
          {SPRINTS.map((s, i) => (
            <motion.div key={s.co} className="ws-card" {...rise(0.25 + i * 0.1, 30)}>
              <div className="ws-card__top">
                <span className="ws-logo" style={{ background: s.c }}>
                  {s.i}
                </span>
                <span className="ws-live">Live</span>
              </div>
              <b>{s.role}</b>
              <small>{s.co}</small>
              <p>14 days · Mentored · PPO track</p>
              <span className={`ws-btn ${i === 0 && drawer ? 'is-pressed' : ''}`}>Apply</span>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.aside className="ws-drawer" initial={{ x: '100%' }} animate={{ x: drawer ? '0%' : '100%' }} transition={{ type: 'spring', stiffness: 160, damping: 22 }}>
        <small className="ws-eyebrow">Product Sprint · Northwind Labs</small>
        <h4>Apply in under 2 minutes</h4>
        <label>{name ? 'Name' : 'Email'}</label>
        <div className="ws-input">
          {typedName}
          {typedName.length < first.length && <i className="ws-caret" />}
        </div>
        <label>College</label>
        <div className="ws-input">
          {college}
          {college && college.length < 16 && <i className="ws-caret" />}
        </div>
        <label>Track</label>
        <div className="ws-chips">
          {['Product', 'Strategy', 'Research'].map((c, i) => (
            <span key={c} className={i === 0 && track ? 'is-on' : ''}>
              {c}
            </span>
          ))}
        </div>
        <span className={`ws-btn ws-btn--wide ${sent ? 'is-done' : ''}`}>{sent ? 'Applied' : 'Submit application'}</span>
      </motion.aside>

      {sent && (
        <motion.div className="ws-toast" {...popIn(0.1)}>
          <span className="ws-toast__ok">
            <Check />
          </span>
          Applied in 1m 48s — sprint starts Monday
        </motion.div>
      )}

      <FakeCursor
        path={[
          [600, 440, 0],
          [92, 362, 0.9],
          [92, 362, 1.4],
          [620, 300, 2.9],
          [560, 312, 3.15],
          [640, 400, 3.6],
          [640, 400, 4.2],
        ]}
        clicks={[1.05, 3.2, 3.75]}
      />
    </div>
  )
}

/* ---------------- 3 · sprint ---------------- */
const TASKS = ['5 user interviews', 'Journey map', 'Wireframes v2', 'Pitch to Northwind PMs']

export function SprintScreen() {
  const done = [useAfter(900), useAfter(1500), useAfter(2100), useAfter(2700)]
  const mentor = useAfter(3100)
  return (
    <div className="ws ws--app">
      <AppSidebar active="Sprints" />
      <div className="ws-app__main">
        <motion.div {...rise(0.05)}>
          <small className="ws-eyebrow">Northwind Labs · Product Sprint</small>
          <h3 className="ws-h">Redesign onboarding for 2M users</h3>
        </motion.div>
        <motion.div className="ws-progress" {...rise(0.15)}>
          <span>Day 6 of 14</span>
          <div>
            <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 0.43 }} transition={{ duration: 1.2, delay: 0.4 }} />
          </div>
        </motion.div>
        <div className="ws-tasks">
          {TASKS.map((t, i) => (
            <motion.div key={t} className={`ws-task ${done[i] ? 'is-done' : ''}`} {...rise(0.25 + i * 0.08)}>
              <span className="ws-box">
                {done[i] && (
                  <motion.span {...popIn(0)}>
                    <Check size={12} />
                  </motion.span>
                )}
              </span>
              {t}
            </motion.div>
          ))}
        </div>
      </div>
      {mentor && (
        <motion.div className="ws-mentor" initial={{ opacity: 0, x: 40, rotate: 4 }} animate={{ opacity: 1, x: 0, rotate: -2 }} transition={{ type: 'spring', stiffness: 160, damping: 14 }}>
          <div className="ws-mentor__who">
            <span className="ws-logo" style={{ background: '#0b0b0d', color: '#fff' }}>
              RK
            </span>
            <div>
              <b>Riya K.</b>
              <small>Mentor · PM at Northwind</small>
            </div>
          </div>
          <p>Strong research. Tighten step 3 of the flow and ship it.</p>
        </motion.div>
      )}
      <FakeCursor
        path={[
          [700, 460, 0],
          [205, 263, 0.8],
          [205, 309, 1.4],
          [205, 355, 2.0],
          [205, 401, 2.6],
          [420, 460, 3.4],
        ]}
        clicks={[0.85, 1.45, 2.05, 2.65]}
      />
    </div>
  )
}

/* ---------------- 4 · readiness ---------------- */
const R = 84
const CIRC = 2 * Math.PI * R

export function ScoreScreen() {
  const v = useMotionValue(0)
  const off = useTransform(v, (s) => CIRC * (1 - s / 100))
  const label = useTransform(v, (s) => Math.round(s))
  useEffect(() => {
    const c = animate(v, 88, { duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 })
    return () => c.stop()
  }, [v])
  const bars: [string, number][] = [
    ['Sprint output', 92],
    ['Collaboration', 86],
    ['Culture fit', 84],
  ]
  return (
    <div className="ws ws--app">
      <AppSidebar active="Profile" />
      <div className="ws-app__main ws-score">
        <motion.div className="ws-ring" {...popIn(0.1)}>
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={R} fill="none" stroke="#ead2f3" strokeWidth="16" />
            <motion.circle cx="100" cy="100" r={R} fill="none" stroke="#8e43ac" strokeWidth="16" strokeLinecap="round" strokeDasharray={CIRC} style={{ strokeDashoffset: off }} />
          </svg>
          <div>
            <motion.b>{label}</motion.b>
            <small>Readiness</small>
          </div>
        </motion.div>
        <div className="ws-bars">
          <motion.h3 className="ws-h" {...rise(0.1)}>
            Validated by your work
          </motion.h3>
          {bars.map(([l, n], i) => (
            <motion.div key={l} className="ws-bar" {...rise(0.3 + i * 0.12)}>
              <span>
                {l}
                <b>{n}</b>
              </span>
              <div>
                <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: n / 100 }} transition={{ duration: 1.2, delay: 0.6 + i * 0.15, ease: [0.22, 1, 0.36, 1] }} />
              </div>
            </motion.div>
          ))}
          <motion.span className="ws-badge" {...popIn(1.8)}>
            Top 8% of cohort
          </motion.span>
          <motion.div className="ws-short" {...rise(2.2)}>
            <small>Shortlisted by</small>
            {SPRINTS.map((s, i) => (
              <motion.span key={s.co} className="ws-logo" style={{ background: s.c }} {...popIn(2.4 + i * 0.12)}>
                {s.i}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- 5 · live work ---------------- */
export function InternScreen() {
  const moved = useAfter(1700)
  const feedback = useAfter(2700)
  const COLS = ['To do', 'In progress', 'Done']
  const card = (
    <motion.div layoutId="ws-moving" className="ws-kcard is-hot" transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
      <b>Ship onboarding A/B test</b>
      <small>Due Fri · with Growth team</small>
    </motion.div>
  )
  return (
    <div className="ws ws--app">
      <AppSidebar active="Internship" />
      <div className="ws-app__main">
        <motion.div {...rise(0.05)}>
          <small className="ws-eyebrow">Live work experience · Northwind Labs</small>
          <h3 className="ws-h">Week 3 of your internship</h3>
        </motion.div>
        <LayoutGroup>
          <div className="ws-kanban">
            {COLS.map((c, ci) => (
              <motion.div key={c} className="ws-col" {...rise(0.15 + ci * 0.08)}>
                <small>{c}</small>
                {ci === 0 && (
                  <div className="ws-kcard">
                    <b>Write release notes</b>
                    <small>Next week</small>
                  </div>
                )}
                {ci === 1 && !moved && card}
                {ci === 2 && moved && card}
                {ci === 2 && (
                  <div className="ws-kcard is-done">
                    <b>Funnel analysis</b>
                    <small>Shipped</small>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
      </div>
      {feedback && (
        <motion.div className="ws-feedback" {...popIn(0)}>
          <small>Manager feedback</small>
          <div className="ws-stars">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span key={i} {...popIn(0.15 + i * 0.08)}>
                <Star />
              </motion.span>
            ))}
          </div>
          <p>Ready for a full-time role.</p>
        </motion.div>
      )}
      <FakeCursor
        path={[
          [720, 470, 0],
          [430, 210, 0.9],
          [430, 210, 1.3],
          [640, 214, 2.1],
          [640, 214, 2.5],
          [560, 470, 3.3],
        ]}
        clicks={[1.3, 2.1]}
      />
    </div>
  )
}

/* ---------------- 6 · offer ---------------- */
const MAILS = [
  ['Kite Health', 'Sprint certificate'],
  ['AntBox', 'Your readiness report'],
  ['Lumen Finance', 'Thanks for sprinting with us'],
]

export function OfferScreen({ name }: { name: string }) {
  const opened = useAfter(1600)
  const sealed = useAfter(3000)
  return (
    <div className="ws ws--mail">
      <div className="ws-inbox">
        <small className="ws-eyebrow">Inbox</small>
        <motion.div className={`ws-mail is-new ${opened ? 'is-open' : ''}`} initial={{ opacity: 0, y: -40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.5 }}>
          <span className="ws-dot" />
          <b>Northwind Labs</b>
          <small>Your Pre-Placement Offer</small>
        </motion.div>
        {MAILS.map(([f, s], i) => (
          <motion.div key={f} className="ws-mail" {...rise(0.1 + i * 0.06)}>
            <b>{f}</b>
            <small>{s}</small>
          </motion.div>
        ))}
      </div>
      <div className="ws-letter-wrap">
        {opened ? (
          <motion.div className="ws-letter" initial={{ opacity: 0, y: 60, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}>
            <div className="ws-letter__head">
              <span className="ws-logo" style={{ background: '#c991df' }}>
                N
              </span>
              <small>Northwind Labs</small>
            </div>
            <h4>Pre-Placement Offer</h4>
            <p>Dear {name || 'future teammate'},</p>
            <p>Following your performance in the Product Sprint and internship, we're delighted to offer you a full-time role.</p>
            <div className="ws-letter__grid">
              <span>
                <small>Role</small>Associate Product Manager
              </span>
              <span>
                <small>Starts</small>July 2027
              </span>
            </div>
            <div className="ws-sign">— Hiring team, Northwind Labs</div>
          </motion.div>
        ) : (
          <motion.div className="ws-empty" {...rise(0.2)}>
            Select a message
          </motion.div>
        )}
      </div>

      {sealed && <OfferSeal name={name} />}

      <FakeCursor
        path={[
          [700, 460, 0],
          [140, 74, 1.2],
          [140, 74, 1.7],
          [520, 470, 2.6],
        ]}
        clicks={[1.4]}
      />
    </div>
  )
}

/** A ring spins round, closes, floods green and becomes a tick. */
function OfferSeal({ name }: { name: string }) {
  return (
    <motion.div className="ws-seal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <svg viewBox="0 0 120 120" className="ws-seal__svg">
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="#4ade80"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0, rotate: -90 }}
          animate={{ pathLength: [0, 0.25, 1], rotate: [-90, 270, 630] }}
          transition={{ duration: 1.3, ease: 'easeInOut', times: [0, 0.4, 1] }}
        />
        <motion.circle cx="60" cy="60" r="54" fill="#4ade80" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 1.25 }} />
        <motion.path
          d="M38 62 L53 77 L84 45"
          fill="none"
          stroke="#0b0b0d"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 1.55, ease: 'easeOut' }}
        />
      </svg>
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2
        return (
          <motion.i
            key={i}
            className="ws-spark"
            style={{ background: ['#8e43ac', '#4ade80', '#fcb900', '#c991df'][i % 4] }}
            initial={{ x: 0, y: 0, scale: 0 }}
            animate={{ x: Math.cos(a) * 130, y: Math.sin(a) * 100, scale: [0, 1, 0] }}
            transition={{ duration: 1, delay: 1.5, ease: 'easeOut' }}
          />
        )
      })}
      <motion.b {...rise(1.8)}>Offer received</motion.b>
      <motion.small {...rise(1.95)}>Welcome to the tribe{name ? `, ${name}` : ''}.</motion.small>
    </motion.div>
  )
}

/* ---------------- shared chrome ---------------- */
function AntboxBar() {
  return (
    <div className="ws-sitebar">
      <span className="ws-sitebar__logo">
        <img src="/antbox-mark.png" alt="" />
        antbox
      </span>
      <nav>
        <span>Sprints</span>
        <span>Tribes</span>
        <span>For companies</span>
      </nav>
      <span className="ws-btn ws-btn--dark">Sign in</span>
    </div>
  )
}

function AppSidebar({ active }: { active: string }) {
  return (
    <div className="ws-side">
      <span className="ws-sitebar__logo">
        <img src="/antbox-mark.png" alt="" />
        antbox
      </span>
      {['Home', 'Sprints', 'Internship', 'Profile'].map((s) => (
        <span key={s} className={s === active ? 'is-on' : ''}>
          {s}
        </span>
      ))}
    </div>
  )
}

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { lockScroll, scrollToId } from '../lib/smooth'
import { Magnetic, Pill } from './Magnetic'

export const PLATFORM_URL = 'https://theantbox.com/'

const LINKS = [
  { id: 'story', label: 'The story' },
  { id: 'journey', label: 'How it works' },
  { id: 'audience', label: 'Students & corporates' },
  { id: 'product', label: 'Tribe analytics' },
  { id: 'join', label: 'Join the colony' },
]

export function Nav({ show }: { show: boolean }) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()

  // Hide on scroll down, reveal on scroll up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > 300 && y > prev)
  })

  useEffect(() => {
    lockScroll(open)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    window.setTimeout(() => scrollToId(id), open ? 450 : 0)
  }

  return (
    <>
      <motion.header
        className="nav"
        initial={{ y: -90 }}
        animate={{ y: show && (!hidden || open) ? 0 : -90 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <a className="nav__logo" href="#top" onClick={(e) => (e.preventDefault(), go('top'))} data-cursor="Top">
          <img src="/antbox-mark.png" alt="" width={28} height={28} />
          antbox
        </a>
        <div className="nav__right">
          <Pill className="nav__cta" variant="purple" href={PLATFORM_URL}>
            Enter platform
          </Pill>
          <Magnetic>
            <button className="nav__burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)} data-cursor="">
              <motion.i animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }} />
              <motion.i animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }} />
            </button>
          </Magnetic>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 38px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 38px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 38px)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu__links">
              {LINKS.map((l, i) => (
                <div key={l.id} style={{ overflow: 'hidden' }}>
                  <motion.a
                    href={`#${l.id}`}
                    className="menu__link"
                    onClick={(e) => (e.preventDefault(), go(l.id))}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.06 }}
                    data-cursor="Jump"
                  >
                    <small>0{i + 1}</small>
                    {l.label}
                  </motion.a>
                </div>
              ))}
            </div>
            <motion.div className="menu__foot" initial={{ opacity: 0 }} animate={{ opacity: 0.8, transition: { delay: 0.6 } }} exit={{ opacity: 0 }}>
              <span>The platform that bridges talent with opportunity.</span>
              <a href={PLATFORM_URL} target="_blank" rel="noreferrer">
                theantbox.com ↗
              </a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

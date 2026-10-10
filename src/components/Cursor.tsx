import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useFinePointer } from '../lib/hooks'

const BIG = 5.5

/** Dot cursor that swells and shows a label over anything with [data-cursor]. */
export function Cursor() {
  const fine = useFinePointer()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.3 })
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    if (!fine) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]')
      setLabel(t ? t.dataset.cursor || '' : null)
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  }, [fine, x, y])

  if (!fine) return null
  return (
    <motion.div
      className="cursor"
      style={{ x: sx, y: sy }}
      animate={{ scale: label === null ? 1 : label ? BIG : 3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <AnimatePresence>
        {label && (
          <motion.span
            key={label}
            className="cursor__label"
            style={{ scale: 1 / BIG }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

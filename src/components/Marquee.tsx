import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from 'motion/react'
import { useRef } from 'react'

type Props = { items: string[]; speed?: number; dark?: boolean; light?: boolean; tilt?: boolean; reverse?: boolean; angle?: number }

/** Infinite marquee that speeds up, reverses and skews with scroll velocity. */
export function Marquee({ items, speed = 3, dark, light, tilt, reverse, angle }: Props) {
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(velocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false })
  const skew = useTransform(velocity, [-3000, 3000], [-8, 8])
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)
  const dir = useRef(reverse ? -1 : 1)

  useAnimationFrame((_, delta) => {
    let move = dir.current * speed * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = reverse ? 1 : -1
    else if (f > 0) dir.current = reverse ? -1 : 1
    move += dir.current * move * Math.abs(f)
    base.set(base.get() - move)
  })

  const row = (
    <>
      {items.map((t, i) => (
        <span className="marquee__item" key={i}>
          <span className={i % 2 ? 'o' : ''}>{t}</span>
          <svg className="marquee__star" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 0 Q14 10 24 12 Q14 14 12 24 Q10 14 0 12 Q10 10 12 0Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </>
  )

  return (
    <div
      className={`marquee ${dark ? 'marquee--dark' : ''} ${light ? 'marquee--light' : ''} ${tilt ? 'marquee--tilt' : ''}`}
      style={angle ? { rotate: `${angle}deg` } : undefined}
      aria-hidden
    >
      <motion.div className="marquee__row" style={{ x, skewX: skew }}>
        {row}
        {row}
      </motion.div>
    </div>
  )
}

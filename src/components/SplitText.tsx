import { motion, useInView } from 'motion/react'
import { useRef, type ElementType } from 'react'

type Props = {
  text: string | string[]
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  /** force play instead of waiting for in-view */
  play?: boolean
  mode?: 'chars' | 'words'
}

const ease = [0.22, 1, 0.36, 1] as const

/** Masked line-by-line reveal: each char/word slides up from below its line. */
export function SplitText({ text, as: Tag = 'div', className, delay = 0, stagger = 0.025, play, mode = 'chars' }: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const active = play ?? inView
  const lines = Array.isArray(text) ? text : [text]
  let i = 0

  return (
    <Tag ref={ref} className={className} aria-label={lines.join(' ')}>
      {lines.map((line, li) => (
        <span className="split-line" key={li} aria-hidden>
          {line.split(' ').map((word, wi, arr) => {
            const pieces = mode === 'chars' ? Array.from(word) : [word]
            return (
              <span className="split-word" key={wi}>
                {pieces.map((p, pi) => {
                  const d = delay + i++ * stagger
                  return (
                    <motion.span
                      key={pi}
                      className="split-char"
                      initial={{ y: '110%', rotate: 6 }}
                      animate={active ? { y: '0%', rotate: 0 } : undefined}
                      transition={{ duration: 0.9, ease, delay: d }}
                    >
                      {p}
                    </motion.span>
                  )
                })}
                {wi < arr.length - 1 ? ' ' : null}
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}

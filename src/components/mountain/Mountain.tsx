import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useFinePointer } from '../../lib/hooks'
import { SplitText } from '../SplitText'

// three.js only downloads once the visitor is getting close to this section
const MountainScene = lazy(() => import('./MountainScene'))

export function Mountain() {
  const ref = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)
  const fine = useFinePointer()

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '1200px 0px' })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <section className="mtn" id="climb" ref={ref}>
      <div className="mtn__frame">
        <div className="mtn__head">
          <p className="eyebrow purple">The climb</p>
          <SplitText as="h2" className="mtn__title" text={['Every sprint', 'gets you higher.']} stagger={0.02} />
          <p className="mtn__hint">{fine ? 'Hover a + for the short version, click to jump there.' : 'Tap a + for the short version, tap again to jump there.'}</p>
        </div>
        {near && (
          <Suspense fallback={null}>
            <MountainScene />
          </Suspense>
        )}
        <div className="mtn__tags" aria-hidden>
          <span>[ antbox ]</span>
          <span>[ campus to corporate ]</span>
        </div>
      </div>
    </section>
  )
}

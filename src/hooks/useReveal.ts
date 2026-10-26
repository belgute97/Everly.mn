import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Ref доторх selector-т таарсан элементүүдийг scroll хийх үед дараалуулан гарган ирүүлнэ
export function useReveal(scope: RefObject<HTMLElement | null>, selector: string, deps: unknown[]) {
  useLayoutEffect(() => {
    const root = scope.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.set(selector, { opacity: 0, y: 36 })
      ScrollTrigger.batch(selector, {
        start: 'top 92%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07, overwrite: true }),
      })
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

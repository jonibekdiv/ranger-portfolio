import { useCallback, useEffect, useState } from 'react'
import { LazyMotion, MotionConfig } from 'framer-motion'
import { I18nProvider } from './i18n'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { gsap, ScrollTrigger, useSmoothScroll } from './lib/motion'

// Animation features (incl. layout animations) load in a separate chunk.
const loadFeatures = () => import('./lib/motion-features').then((mod) => mod.default)

export default function App() {
  const [ready, setReady] = useState(false)
  const onLoaded = useCallback(() => setReady(true), [])
  useSmoothScroll(ready)

  // Scroll-based background colour transitions between sections.
  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('[data-bg]').forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) gsap.to('body', { backgroundColor: section.dataset.bg, duration: 0.9, ease: 'power2.out' })
          },
        })
      })
    })
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => {
      ctx.revert()
      window.removeEventListener('load', refresh)
    }
  }, [ready])

  return (
    <I18nProvider>
    <LazyMotion features={loadFeatures} strict>
    <MotionConfig reducedMotion="user">
      <Loader onDone={onLoaded} />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <About />
        <Skills />
        <Projects ready={ready} />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
    </LazyMotion>
    </I18nProvider>
  )
}

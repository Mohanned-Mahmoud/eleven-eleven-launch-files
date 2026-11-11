import { ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { experience } from '../config/experience'
import { assets } from '../config/assets'
import { FloralBackdrop } from '../components/FloralBackdrop'
import { SceneLayout } from '../components/SceneLayout'
import { Eyebrow, Heading, Handwritten } from '../components/Typography'
import { Sprig } from '../components/Ornament'
export function OpeningScene({ onEnter }: { onEnter: () => void }) {
  useEffect(() => {
    const garden = new Image()
    garden.src = window.matchMedia('(max-width: 600px)').matches ? assets.garden.mobile : assets.garden.src
  }, [])
  return <SceneLayout className="opening-scene">
    <FloralBackdrop variant="opening" />
    <div className="invitation-content opening-content">
      <Sprig className="intro-sprig" />
      <Eyebrow data-reveal>{experience.opening.eyebrow}</Eyebrow>
      <Heading id="scene-title" className="wish-time" data-reveal>11<span className="wish-colon">:</span>11</Heading>
      <p className="wish-copy" data-reveal>They say it's the perfect time<br />to <em>make a wish.</em></p>
      <span className="fine-rule" data-reveal />
      <p className="promise-copy" data-reveal>{experience.opening.promise}</p>
      <button className="enter-button group focus-visible:outline-2 focus-visible:outline-offset-8" onClick={onEnter} data-reveal><span>{experience.opening.action}</span><ArrowRight size={17} strokeWidth={1.25} className="transition-transform duration-500 group-hover:translate-x-1" /></button>
      <Handwritten className="opening-handwriting" data-reveal>I've been waiting to show you.</Handwritten>
    </div>
    <p className="scene-side-note" aria-hidden="true">One moment. A whole little universe.</p>
  </SceneLayout>
}

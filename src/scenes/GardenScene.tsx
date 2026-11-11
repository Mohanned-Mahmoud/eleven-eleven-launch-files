import { useState } from 'react'
import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react'
import { assets } from '../config/assets'
import { experience } from '../config/experience'
import type { GardenPoint } from '../config/experience'
import { SceneLayout } from '../components/SceneLayout'
import { Eyebrow, Heading, Handwritten } from '../components/Typography'
import { Diamond } from '../components/Ornament'
export function GardenScene({ onBack, onGrow }: { onBack: () => void; onGrow: () => void }) {
  const [selected, setSelected] = useState<GardenPoint | null>(null)
  return <SceneLayout className="garden-scene">
    <div className="garden-world" aria-hidden="true" data-photo>
      <picture><source media="(max-width: 600px)" srcSet={assets.garden.mobile} /><img src={assets.garden.src} width={2400} height={1594} alt="" fetchPriority="high" /></picture>
    </div>
    <div className="garden-shade" aria-hidden="true" />
    <div className="garden-intro">
      <Eyebrow data-reveal>{experience.garden.eyebrow}</Eyebrow>
      <Heading id="scene-title" data-reveal>{experience.garden.title[0]}<br /><em>{experience.garden.title[1]}</em></Heading>
      <p className="garden-subtitle" data-reveal>{experience.garden.subtitle}</p>
    </div>
    <div className="garden-points" aria-label="Places in the garden">
      {experience.garden.points.map(point => <button key={point.id} className={`garden-point garden-point--${point.id} ${selected?.id === point.id ? 'is-selected' : ''}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} aria-label={`Discover ${point.label.toLowerCase()}`} aria-expanded={selected?.id === point.id} aria-controls="garden-note" onClick={() => setSelected(selected?.id === point.id ? null : point)}><span className="point-ring"><Plus size={13} strokeWidth={1} /></span><span className="point-label">{point.label}</span></button>)}
    </div>
    {selected && <aside id="garden-note" className="garden-note" aria-live="polite"><button aria-label="Close garden note" className="note-close icon-button" onClick={() => setSelected(null)}><X size={16} /></button><Eyebrow>{selected.botanical}</Eyebrow><h2>{selected.title}</h2><p>{selected.body}</p></aside>}
    <div className="garden-bottom" data-reveal><Handwritten>{experience.garden.invitation}</Handwritten><p><Diamond /> Follow the little details</p></div>
    <button className="garden-grow-link text-button" onClick={onGrow}>Grow your flowers<ArrowRight size={14}/></button>
    <button className="garden-back text-button" onClick={onBack}><ArrowLeft size={14} strokeWidth={1.2} /><span>Back to our moment</span></button>
  </SceneLayout>
}

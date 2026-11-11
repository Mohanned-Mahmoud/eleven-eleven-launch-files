import type { Personal } from './config/personal'
import { PersonalScene } from './scenes/PersonalScene'
import { Soundtrack } from './components/Soundtrack'
import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowUpRight, Pause, Play } from 'lucide-react'
import { experience } from './config/experience'
import type { SceneId } from './config/experience'
import type { PreviewSettings } from './dev/preview'
import { remainingUntil } from './lib/time'
import { motion, revealScene } from './lib/motion'
import { useClock } from './hooks/useClock'
import { useMotion } from './hooks/useMotion'
import { CountdownScene } from './scenes/CountdownScene'
import { OpeningScene } from './scenes/OpeningScene'
import type { Flower } from './grow/model'
import { BouquetScene } from './scenes/BouquetScene'
import { GrowScene } from './scenes/GrowScene'
import { GardenScene } from './scenes/GardenScene'
import { BotanicalNotes } from './components/BotanicalNotes'
import { Handwritten } from './components/Typography'

const PreviewDock = import.meta.env.DEV ? lazy(() => import('./dev/PreviewDock')) : null
export function SceneManager({ preview, personal, serverUnlocked=false }: { preview?: PreviewSettings; personal:Personal;serverUnlocked?:boolean }) {
  const now = useClock(preview?.frozen)
  const unlocked = serverUnlocked || remainingUntil(experience.unlockAt, now).total === 0
  const [scene, setScene] = useState<SceneId>(() => preview?.scene ?? (unlocked ? 'opening' : 'countdown'))
  const [grownFlowers,setGrownFlowers]=useState<Flower[]>([])
  const [pickedFlowers,setPickedFlowers]=useState<Flower[]>([])
  const [bouquet,setBouquet]=useState<Flower[]>([])
  const [matureIds,setMatureIds]=useState<number[]>([])
  const nextFlowerId=useRef(1)
  const [notesOpen, setNotesOpen] = useState(false)
  const [forcedPreview, setForcedPreview] = useState(Boolean(preview?.scene))
  const { still, systemReduced, toggle } = useMotion()
  const container = useRef<HTMLDivElement>(null)
  const transition = useRef<gsap.core.Tween | null>(null)
  const pending = useRef(false)
  const lastFocusedScene = useRef(scene)
  const sceneRef = useRef(scene)
  sceneRef.current = scene

  const goTo = useCallback((next: SceneId) => {
    if (next === sceneRef.current || pending.current) return
    pending.current = true
    const finish = () => { setScene(next); pending.current = false }
    if (still || !container.current) finish()
    else transition.current = gsap.to(container.current, { opacity: 0, y: -5, duration: motion.exit, ease: 'power1.inOut', onComplete: finish })
  }, [still])

  useEffect(() => {
    if (unlocked && scene === 'countdown' && !forcedPreview) goTo('opening')
  }, [unlocked, scene, forcedPreview, goTo])

  useLayoutEffect(() => {
    const root = container.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.set(root, { opacity: 1, y: 0 })
      revealScene(root, still)
    }, root)
    if (lastFocusedScene.current !== scene) root.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })
    lastFocusedScene.current = scene
    return () => ctx.revert()
  }, [scene, still])

  useEffect(() => () => { transition.current?.kill() }, [])
  // Stop an in-flight transition when system motion preferences change.
  useEffect(() => { if (still && transition.current?.isActive()) transition.current.progress(1) }, [still])

  return <div className={`experience ${still ? 'is-still' : ''} ${preview && !preview.clean ? 'has-preview' : ''}`}>
    <a className="skip-link" href="#scene-title">Skip to the moment</a>
    <header className="site-header flex items-center justify-between">
      <span className="wordmark" aria-label="Eleven eleven">11:11<span className="wordmark-dot">·</span></span>
      <p className="site-title">A garden made for you</p>
      <button className="motion-toggle text-button" aria-label={systemReduced ? 'Reduced motion enabled by your device' : still ? 'Resume motion' : 'Pause motion'} aria-pressed={still} onClick={toggle} disabled={systemReduced}>{still ? <Play size={13} strokeWidth={1.4} /> : <Pause size={13} strokeWidth={1.4} />}<span>{still ? 'Stillness on' : 'A little stillness'}</span></button>
    </header>
    <main ref={container} className="scene-container" data-scene={scene}>
      {scene === 'countdown' && <CountdownScene now={now} />}
      {scene === 'opening' && <OpeningScene onEnter={() => goTo('invitation')} />}
      {scene === 'garden' && <GardenScene onBack={() => goTo('memories')} onGrow={() => goTo('grow')} />}
      {scene === 'grow' && <GrowScene still={still} onBack={() => goTo('garden')} flowers={grownFlowers} setFlowers={setGrownFlowers} bouquet={bouquet} setBouquet={setBouquet} pickedFlowers={pickedFlowers} setPickedFlowers={setPickedFlowers} matureIds={matureIds} setMatureIds={setMatureIds} nextId={nextFlowerId} onBouquet={()=>goTo('bouquet')} />}
      {scene === 'bouquet' && <BouquetScene stock={pickedFlowers} flowers={bouquet} still={still} onBack={()=>goTo('grow')} onChange={setBouquet} onContinue={()=>goTo('wish')} onAnother={()=>setBouquet([])} />}
      {(['invitation','eleven','play','memories','wish','letter'] as const).map(id=>scene===id&&<PersonalScene key={id} id={id} personal={personal} onBack={()=>goTo(({invitation:'opening',eleven:'invitation',play:'eleven',memories:'play',wish:'bouquet',letter:'wish'} as const)[id])} onNext={()=>goTo(({invitation:'eleven',eleven:'play',play:'memories',memories:'garden',wish:'letter',letter:'garden'} as const)[id])}/>) }
    </main>
    <Soundtrack song={personal.song} tracks={personal.songs}/>
    <footer className="site-footer flex items-center justify-between"><Handwritten>For you, always.</Handwritten><p className="footer-date">11 November 2026 <span>·</span> Cairo</p><button onClick={() => setNotesOpen(true)} className="credits-button text-button">Botanical notes<ArrowUpRight size={12} strokeWidth={1.2} aria-hidden="true" /></button></footer>
    {PreviewDock && preview && !preview.clean && <Suspense fallback={null}><PreviewDock scene={scene} frozen={preview.frozen} onSelect={next => { setForcedPreview(true); goTo(next) }} /></Suspense>}
    <BotanicalNotes open={notesOpen} onClose={() => setNotesOpen(false)} />
  </div>
}

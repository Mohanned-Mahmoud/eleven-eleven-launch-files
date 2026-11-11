import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowLeft, ArrowRight, Download, RotateCcw, X } from 'lucide-react'
import type { Flower } from '../grow/model'
import { colors, varieties } from '../grow/model'
import { Eyebrow, Heading } from '../components/Typography'
import { bouquetMarkup } from '../bouquet/artwork'
import { finalMessage } from '../bouquet/composition'
import { exportBouquet, saveBouquet } from '../bouquet/export'
import '../bouquet/bouquet.css'
export function BouquetScene({stock,flowers,still,onBack,onChange,onAnother,onContinue}:{stock:Flower[];flowers:Flower[];still:boolean;onBack:()=>void;onChange:(flowers:Flower[])=>void;onAnother:()=>void;onContinue:()=>void}) {
  const [phase,setPhase]=useState<'choose'|'wrapping'|'final'|'continue'>('choose')
  const [history,setHistory]=useState<Flower[][]>([])
  const [blob,setBlob]=useState<Blob|null>(null)
  const [error,setError]=useState('')
  const [saveUrl,setSaveUrl]=useState('')
  const artwork=useRef<HTMLDivElement>(null)
  const heading=useRef<HTMLDivElement>(null)
  const final=phase==='final'||phase==='continue'
  useLayoutEffect(()=>{
    if(phase!=='wrapping'||!artwork.current)return
    if(still){setPhase('final');return}
    const ctx=gsap.context(()=>{
      gsap.timeline({onComplete:()=>setPhase('final')})
        .fromTo('.bouquet-flower',{x:(i)=>i%2?-25:25,y:-28,opacity:.5},{x:0,y:0,opacity:1,duration:1.8,stagger:.065,ease:'sine.inOut'})
        .fromTo('.paper-back',{opacity:0,y:26},{opacity:1,y:0,duration:1.1,ease:'sine.out'},1.25)
        .fromTo('.paper-fold-left',{opacity:0,x:-35,rotation:-8,svgOrigin:'300 540'},{opacity:1,x:0,rotation:0,duration:1.5,ease:'sine.inOut'},2.1)
        .fromTo('.paper-fold-right',{opacity:0,x:35,rotation:8,svgOrigin:'300 540'},{opacity:1,x:0,rotation:0,duration:1.5,ease:'sine.inOut'},2.7)
        .fromTo('.ribbon-band',{clipPath:'inset(0% 100% 0% 0%)',opacity:0},{clipPath:'inset(0% 0% 0% 0%)',opacity:1,duration:1.1,ease:'sine.inOut'},4.1)
        .fromTo('.ribbon-bow',{opacity:0,y:3},{opacity:1,y:0,duration:1.2,ease:'sine.out'},5.1)
    },artwork)
    return ()=>ctx.revert()
  },[phase,still])
  useEffect(()=>{
    if(!final)return
    let cancelled=false;setBlob(null);setError('')
    void exportBouquet(flowers).then(b=>{if(!cancelled)setBlob(b)}).catch(e=>{if(!cancelled)setError(e instanceof Error?e.message:'Please try saving again.')})
    heading.current?.querySelector<HTMLElement>('h1')?.focus({preventScroll:true})
    return ()=>{cancelled=true}
  },[final,flowers])
  useEffect(()=>()=>{if(saveUrl)URL.revokeObjectURL(saveUrl)},[saveUrl])
  const remove=(id:number)=>{setHistory(p=>[...p,flowers]);onChange(flowers.filter(f=>f.id!==id))}
  const undo=()=>{const prev=history.at(-1);if(prev){onChange(prev);setHistory(h=>h.slice(0,-1))}}
  return <section className={`scene bouquet-scene bouquet-${phase}`} aria-labelledby="scene-title">
    {phase==='choose'&&<button className="bouquet-back text-button" onClick={onBack}><ArrowLeft size={13}/>Pick more flowers</button>}
    <div className="bouquet-heading" ref={heading}><Eyebrow>{final?'A little promise, tied with love':phase==='wrapping'?'Gathering your little garden':'Every flower has a little story'}</Eyebrow><Heading id="scene-title">{final?<>{finalMessage[0]}</>:<>Your flowers.<br/><em>Your bouquet.</em></>}</Heading>{final&&<p className="bouquet-final-line">{finalMessage[1]}</p>}</div>
    <div ref={artwork} className="bouquet-artwork" data-bouquet-count={flowers.length} dangerouslySetInnerHTML={{__html:bouquetMarkup(flowers)}}/>
    {phase==='choose'&&<div className="bouquet-editor">
      {!flowers.length?<p className="bouquet-empty">Your bouquet begins with a flower you grew.<br/><button className="text-button" onClick={onBack}>Back to the garden <ArrowRight size={13}/></button></p>:<><div className="bouquet-selection" aria-label="Flowers in your bouquet">{flowers.map(f=><button key={f.id} onClick={()=>remove(f.id)} aria-label={`Remove ${colors[f.color].label.toLowerCase()} ${f.variety} ${f.id}`}><img src={`/images/grow/${f.variety}-head.webp`} alt=""/><span className="sr-only">{colors[f.color].label} {f.variety}</span><X size={10}/></button>)}</div><p className="bouquet-count">{flowers.length} of 12 flowers <span>· Tap a flower to remove it</span></p></>}
      {stock.some(f=>!flowers.some(s=>s.id===f.id))&&<div className="bouquet-available"><p>Flowers you picked</p><div>{stock.filter(f=>!flowers.some(s=>s.id===f.id)).map(f=><button key={f.id} aria-label={`Add picked ${f.variety} ${f.id}`} onClick={()=>{setHistory(p=>[...p,flowers]);onChange([...flowers,f])}}><img src={`/images/grow/${f.variety}-head.webp`} alt=""/><span>{varieties.find(v=>v.id===f.variety)!.label}</span></button>)}</div></div>}
      <div className="bouquet-edit-actions"><button className="text-button" onClick={undo} disabled={!history.length}><RotateCcw size={13}/>Undo removal</button><button className="text-button" onClick={onBack}>Add flowers <ArrowRight size={13}/></button></div>
      <button className="enter-button wrap-button" disabled={!flowers.length} onClick={()=>setPhase('wrapping')}>Wrap My Bouquet<ArrowRight size={15}/></button>
    </div>}
    {phase==='wrapping'&&<p className="wrapping-caption" role="status">A fold of ivory. A ribbon. All yours.</p>}
    {final&&<div className="bouquet-final-actions"><button className="enter-button save-bouquet" disabled={!blob} onClick={()=>{if(blob)void saveBouquet(blob,setSaveUrl).catch(()=>setError('Please use the image link below to save your bouquet.'))}}><Download size={15}/>{blob?'Save My Bouquet':error?'Image unavailable':'Preparing your image…'}</button>
      {error&&<p role="alert">{error}<button className="text-button" onClick={()=>{setError('');void exportBouquet(flowers).then(setBlob).catch(e=>setError(String(e)))}}>Try again</button></p>}
      {saveUrl&&<div className="bouquet-save-fallback"><a href={saveUrl} download="11-11-my-bouquet.png">Download PNG</a><a href={saveUrl} target="_blank" rel="noopener noreferrer">Open image to save</a><p>On iPhone, touch and hold the opened image to save it to Photos.</p></div>}
      <div className="bouquet-secondary"><button className="text-button" onClick={()=>{onAnother();setHistory([]);setPhase('choose');setSaveUrl('')}}>Make Another</button><button className="text-button" onClick={onContinue}>Continue<ArrowRight size={13}/></button></div>
      {phase==='continue'&&<p className="bouquet-continue" role="status">Keep this little piece of our garden.<br/>I'll meet you here, whenever you like.</p>}
    </div>}
    <p className="bouquet-sr sr-only">{flowers.map(f=>`${colors[f.color].label} ${varieties.find(v=>v.id===f.variety)!.label}`).join(', ')}</p>
  </section>
}

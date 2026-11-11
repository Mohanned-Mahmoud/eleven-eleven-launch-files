import type { Dispatch, SetStateAction, RefObject } from 'react'
import { BOUQUET_LIMIT, addPicked } from '../bouquet/composition'
import '../bouquet/bouquet.css'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowLeft, ArrowRight, RotateCcw, Trash2 } from 'lucide-react'
import { Eyebrow, Heading, Handwritten } from '../components/Typography'
import { assets } from '../config/assets'
import { varieties, colors, MAX_FLOWERS, MAX_GROWING, canPlant, validPosition } from '../grow/model'
import type { Flower, Variety } from '../grow/model'
import { FlowerPlant } from '../grow/FlowerPlant'
import '../grow/grow.css'
const intro=["I know I'm a little too far away to show up with flowers today...",'So I thought, why not let you make your own bouquet?','Every flower is yours to choose.','Just tap the garden and watch something beautiful grow.']
export function GrowScene({still,onBack,flowers,setFlowers,bouquet,setBouquet,matureIds,setMatureIds,nextId,onBouquet,pickedFlowers,setPickedFlowers}:{still:boolean;onBack:()=>void;flowers:Flower[];setFlowers:Dispatch<SetStateAction<Flower[]>>;bouquet:Flower[];setBouquet:Dispatch<SetStateAction<Flower[]>>;matureIds:number[];setMatureIds:Dispatch<SetStateAction<number[]>>;nextId:RefObject<number>;onBouquet:()=>void;pickedFlowers:Flower[];setPickedFlowers:Dispatch<SetStateAction<Flower[]>>}) {
  const [ready,setReady]=useState(flowers.length>0||bouquet.length>0)
  const [selectedId,setSelectedId]=useState<number|null>(null)
  const [variety,setVariety]=useState<Variety>('rose')
  const [color,setColor]=useState(0)
  const [message,setMessage]=useState('Choose a flower. Then touch the earth.')
  const [confirmClear,setConfirmClear]=useState(false)
  const active=useRef(new Set<number>())
  const stage=useRef<HTMLDivElement>(null)
  const introduction=useRef<HTMLDivElement>(null)
  const settled=useCallback((id:number)=>{active.current.delete(id);setMatureIds(prev=>prev.includes(id)?prev:[...prev,id])},[setMatureIds])
  const selected=flowers.find(f=>f.id===selectedId)
  function pick(){if(!selected)return;if(pickedFlowers.length>=BOUQUET_LIMIT){setMessage('Your bouquet holds twelve flowers.');return}setBouquet(prev=>addPicked(prev,selected));setPickedFlowers(prev=>addPicked(prev,selected));setFlowers(prev=>prev.filter(f=>f.id!==selected.id));setSelectedId(null);setMessage('A flower for your bouquet. There is room to grow another.')}
  useLayoutEffect(()=>{
    if(ready || !introduction.current || still) return
    const ctx=gsap.context(()=>{gsap.fromTo('.grow-intro-line, .grow-begin',{opacity:0,y:10},{opacity:1,y:0,duration:1.4,stagger:1.1,ease:'sine.out',clearProps:'all'})},introduction)
    return ()=>ctx.revert()
  },[ready,still])
  function plant(x:number,y:number) {
    const box=stage.current!.getBoundingClientRect()
    if(!validPosition(x,y)){setMessage('Touch the oval of earth to plant a flower.');return}
    if(flowers.length>=MAX_FLOWERS){setMessage('Your little garden is full. Undo a flower to make room.');return}
    if(active.current.size>=MAX_GROWING){setMessage('A moment for these flowers to open…');return}
    if(!canPlant(flowers,x,y,box.width,box.height)){setMessage('Give this flower a little more room to bloom.');return}
    const id=nextId.current++
    if(!still) active.current.add(id)
    setFlowers(prev=>[...prev,{id,x,y,variety,color,lean:((id*17)%19)-9}])
    setMessage(`${varieties.find(v=>v.id===variety)!.label} planted. A little beauty, just for you.`)
  }
  function undo(){const last=flowers.at(-1);if(last)active.current.delete(last.id);setFlowers(p=>p.slice(0,-1));setConfirmClear(false);setMessage('A little room for another beginning.')}
  return <section className={`scene grow-scene ${ready?'grow-ready':''}`} aria-labelledby="scene-title">
    <div className="grow-background" aria-hidden="true"><img src={assets.garden.src} alt=""/><div/></div>
    <button className="grow-back text-button" onClick={onBack}><ArrowLeft size={13}/>The garden</button>
    {!ready?<div className="grow-introduction" ref={introduction}><Eyebrow>A little closer, in our own way</Eyebrow><Heading id="scene-title">Flowers,<br/><em>from me to you.</em></Heading><div className="grow-letter">{intro.map((line,i)=><p className="grow-intro-line" key={line}>{i===2?<em>{line}</em>:line}</p>)}</div><button className="enter-button grow-begin" onClick={()=>{setReady(true);requestAnimationFrame(()=>stage.current?.querySelector('button')?.focus())}}>Let's make something beautiful<ArrowRight size={15}/></button></div>:<>
      <div className="grow-heading"><Eyebrow>A small garden. All your own.</Eyebrow><Heading id="scene-title">Let something<br/><em>beautiful grow.</em></Heading><Handwritten>One flower at a time.</Handwritten></div>
      <div ref={stage} className="planting-stage" role="group" aria-label="Planting garden">
        <button className="planting-target" aria-label="Plant a flower in the garden. Tap the earth, or press Enter for an available position." onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();const spots=[[20,76],[42,75],[66,76],[82,88],[18,91],[46,92],[68,91]];const box=stage.current!.getBoundingClientRect();const spot=spots.find(([x,y])=>canPlant(flowers,x,y,box.width,box.height));if(spot)plant(...spot as [number,number]);else setMessage('Your little garden is full.')}}} onPointerUp={e=>{if(e.button!==0)return;const b=e.currentTarget.getBoundingClientRect();plant((e.clientX-b.left)/b.width*100,(e.clientY-b.top)/b.height*100)}}/>
        <div className="planting-earth" aria-hidden="true"><svg width="100%" height="100%"><filter id="soil-grain"><feTurbulence type="fractalNoise" baseFrequency=".3" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#soil-grain)" opacity=".2"/></svg></div>
        <div className="edge-frond edge-frond-left"/><div className="edge-frond edge-frond-right"/>
        {flowers.length===0&&<p className="planting-hint">Your first flower starts here<span>Touch the earth</span></p>}
        <div className="flower-layer">{[...flowers].sort((a,b)=>a.y-b.y).map(f=><FlowerPlant key={f.id} flower={f} still={still} onSettled={settled} alreadyGrown={matureIds.includes(f.id)} selectable={matureIds.includes(f.id)} selected={selectedId===f.id} onSelect={()=>setSelectedId(f.id)}/>)}</div>
      </div>
      <div className="grow-controls">
        <div className="flower-picker" role="group" aria-label="Flower variety">{varieties.map((v,i)=><button key={v.id} aria-pressed={variety===v.id} onClick={()=>{setVariety(v.id);setColor(i)}}><img src={`/images/grow/${v.id}-head.webp`} alt=""/><span>{v.label}</span></button>)}</div>
        <div className="grow-tools"><div className="color-picker" role="group" aria-label="Flower color">{colors.map((c,i)=><button key={c.label} aria-label={c.label} aria-pressed={color===i} style={{'--swatch':c.hex} as React.CSSProperties} onClick={()=>setColor(i)}/>)}</div><span className="flower-count" aria-label={`${flowers.length} of ${MAX_FLOWERS} flowers`}>{flowers.length} / {MAX_FLOWERS}</span><button className="icon-button" aria-label="Undo last flower" disabled={!flowers.length} onClick={undo}><RotateCcw size={16}/></button><button className="icon-button" aria-label="Clear garden" disabled={!flowers.length} onClick={()=>setConfirmClear(true)}><Trash2 size={16}/></button></div>
        {confirmClear?<div className="clear-confirm"><span>Begin again?</span><button onClick={()=>{setFlowers([]);active.current.clear();setConfirmClear(false);setMessage('A fresh beginning.')}}>Clear flowers</button><button onClick={()=>setConfirmClear(false)}>Keep them</button></div>:<p className="grow-status" role="status">{message}</p>}
        {selected&&<div className="grow-pick-panel"><span>{varieties.find(v=>v.id===selected.variety)!.label} · {colors[selected.color].label}</span><button onClick={pick}>Add to bouquet</button></div>}
        <div className="grow-bouquet-actions"><span className="grow-collection-status">Tap a bloom to pick it.</span><button className="enter-button" disabled={!pickedFlowers.length} onClick={onBouquet}>My bouquet · {bouquet.length}<ArrowRight size={13}/></button></div>
      </div>
    </>}
  </section>
}

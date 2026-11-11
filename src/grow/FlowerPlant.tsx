import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { appearance } from '../bouquet/composition'
import { varieties } from './model'
import type { Flower } from './model'

/** Independent botanical parts: root, drawn stem, leaf pivots, bud, opening petals and head. */
export function FlowerPlant({ flower, still, onSettled, onSelect, selected=false, selectable=false, alreadyGrown=false }: { flower: Flower; still: boolean; onSettled: (id:number)=>void; onSelect?:()=>void; selected?:boolean; selectable?:boolean; alreadyGrown?:boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const grown = useRef(alreadyGrown)
  const spec = varieties.find(v=>v.id===flower.variety)!
  const bend = flower.lean
  useLayoutEffect(()=>{
    if(!root.current) return
    const ctx=gsap.context(()=>{
      const stem=root.current!.querySelector<SVGPathElement>('.growing-stem')!
      const length=stem.getTotalLength()
      const finish=()=>{grown.current=true;onSettled(flower.id)}
      if(still || grown.current) {
        gsap.set('.growing-stem',{strokeDasharray:length,strokeDashoffset:0})
        gsap.set('.plant-leaf',{scale:1,opacity:1})
        gsap.set('.flower-head',{opacity:1,clipPath:'inset(0% 0% 0% 0%)'})
        gsap.set('.opening-petal',{opacity:0})
        gsap.set('.plant-bud',{opacity:0})
        gsap.set('.root-shadow',{opacity:.6,scale:1})
        finish()
      } else {
        gsap.set('.growing-stem',{strokeDasharray:length,strokeDashoffset:length})
        gsap.set('.plant-leaf',{scaleX:.03,scaleY:.08,opacity:0,transformOrigin:'0% 100%'})
        gsap.set('.plant-bud',{opacity:0,y:12})
        gsap.set('.flower-head',{opacity:0,clipPath:'inset(85% 35% 0% 35%)'})
        gsap.set('.opening-petal',{opacity:0,rotation:0,scaleX:.15,scaleY:.45,transformOrigin:'50% 100%'})
        gsap.set('.root-shadow',{opacity:0,scale:.3,transformOrigin:'50% 50%'})
        const tl=gsap.timeline({onComplete:finish})
        tl.to('.root-shadow',{opacity:.6,scale:1,duration:.5})
          .to('.growing-stem',{strokeDashoffset:0,duration:1.8,ease:'power1.inOut'},.12)
          .to('.plant-leaf',{scaleX:1,scaleY:1,opacity:1,duration:1.1,stagger:.3,ease:'sine.out'},.8)
          .to('.plant-bud',{opacity:1,y:0,duration:.75,ease:'sine.out'},1.8)
          .to('.opening-petal',{opacity:1,scaleX:1,scaleY:1,rotation:i=>(i-2)*25,duration:1.2,stagger:.09,ease:'sine.inOut'},2.45)
          .to('.plant-bud',{opacity:0,duration:1},2.8)
          .to('.flower-head',{opacity:1,clipPath:'inset(0% 0% 0% 0%)',duration:1.9,ease:'sine.inOut'},2.9)
          .to('.opening-petal',{opacity:0,duration:.8},4.1)
      }
      if(!still) gsap.to('.plant-sway',{rotation:bend*.16,duration:3.7+(flower.id%3)*.6,repeat:-1,yoyo:true,ease:'sine.inOut',transformOrigin:'50% 100%',delay:grown.current?0:4.8})
    },root)
    return ()=>ctx.revert()
  },[flower,still,onSettled,bend])
  const {hue,saturation,brightness}=appearance(flower)
  return <div ref={root} className={`flower-plant flower-plant--${flower.variety}`} data-flower={flower.id} style={{left:`${flower.x}%`,top:`${flower.y}%`,zIndex:Math.round(flower.y*10),height:`${spec.height/255*70}%`}}>
    <svg className="plant-shadow" viewBox="0 0 150 20" aria-hidden="true"><ellipse className="root-shadow" cx="75" cy="10" rx="28" ry="5" fill="#060a09" /></svg>
    <div className="plant-sway">
      <svg className="plant-structure" viewBox="0 0 150 280" fill="none" aria-hidden="true">
        <defs><linearGradient id={`stem-${flower.id}`}><stop stopColor="#495a3d"/><stop offset=".5" stopColor="#a3a880"/><stop offset="1" stopColor="#485541"/></linearGradient><linearGradient id={`leaf-${flower.id}`} x2="1" y2="1"><stop stopColor="#334735"/><stop offset=".5" stopColor="#7d9067"/><stop offset="1" stopColor="#364c3b"/></linearGradient></defs>
        <path className="growing-stem" d={`M75 278 C${75-bend} 208 ${75+bend} 128 ${75+bend} 67`} stroke={`url(#stem-${flower.id})`} strokeWidth={flower.variety==='cosmos'?2:3.4} strokeLinecap="round"/>
        {Array.from({length:flower.variety==='tulip'?2:3},(_,i)=><g key={i} transform={`translate(${75+(i===1?bend*.25:0)} ${flower.variety==='tulip'?264-i*50:225-i*44}) rotate(${i%2?-90:0})`}><g className="plant-leaf"><image href={`/images/grow/${flower.variety==='ranunculus'?'peony':flower.variety}-leaf.webp`} x="-3" y="-85" width={flower.variety==='tulip'?66:57} height="88" preserveAspectRatio="xMinYMax meet"/></g></g>)}
      </svg>
      <div className="flower-crown" style={{left:`${50+bend/1.5}%`,filter:`hue-rotate(${hue}deg) saturate(${saturation}) brightness(${brightness})`}}>
        {onSelect&&<button className="crown-pick" disabled={!selectable} aria-label={`Select grown ${flower.variety} ${flower.id}`} aria-pressed={selected} onPointerUp={e=>e.stopPropagation()} onClick={onSelect}/>}
        <img className="plant-bud" src={`/images/grow/${flower.variety}-bud.webp`} alt="" />
        {[0,1,2,3,4].map(i=><img key={i} className="opening-petal" src={`/images/grow/${flower.variety}-petal.webp`} alt="" />)}
        <img className="flower-head" src={`/images/grow/${flower.variety}-head.webp`} alt="" />
      </div>
    </div>
  </div>
}

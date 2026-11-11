import {useCallback,useEffect,useRef,useState} from 'react'
import type {Personal,MusicTrack} from '../config/personal'
export function Soundtrack({song,tracks}:{song:Personal['song'];tracks?:readonly MusicTrack[]}){
 const eligible=(t:MusicTrack)=>Boolean(t.file&&t.license&&!t.license.startsWith('['))
 const configured=tracks?.filter(eligible)??[]
 const available=configured.length?configured:[{...song,id:'song',label:'Music'}].filter(eligible)
 const audio=useRef<HTMLAudioElement>(null),request=useRef(0)
 const [active,setActive]=useState(''),[error,setError]=useState('')
 const selected=available.find(t=>t.id===active)??available[0]
 const currentTrack=useRef(selected)
 currentTrack.current=selected
 const initialFile=available[0]?.file
 const play=useCallback((track:MusicTrack)=>{
  const el=audio.current;if(!el||!track.file)return
  const current=++request.current
  if(el.getAttribute('src')!==track.file){el.pause();el.src=track.file}
  setActive(track.id);setError('')
  void el.play().catch((reason:unknown)=>{
   if(request.current===current&&!(reason instanceof DOMException&&reason.name==='NotAllowedError'))setError('Unable to play this track. Tap to try the other song.')
  })
 },[])
 useEffect(()=>{
  if(!initialFile)return
  function start(event?:Event){
   if(event?.target instanceof Element&&event.target.closest('.soundtrack'))return
   if(event instanceof KeyboardEvent&&!['Enter',' '].includes(event.key))return
   if(audio.current?.paused&&currentTrack.current)play(currentTrack.current)
  }
  // Try immediately; browsers that block audible autoplay retry within a user gesture.
  start()
  document.addEventListener('click',start,true)
  document.addEventListener('keydown',start,true)
  return ()=>{document.removeEventListener('click',start,true);document.removeEventListener('keydown',start,true);request.current++;audio.current?.pause()}
 },[initialFile,play])
 if(!selected)return null
 return <div className="soundtrack"><audio ref={audio} preload="auto" loop playsInline/>
 {available.length>1&&<button className="text-button" aria-label="Tap to change song" onClick={()=>play(available[(available.findIndex(t=>t.id===selected.id)+1)%available.length])}>Tap to change</button>}
 {error&&<p role="status" className="personal-small">{error}</p>}</div>
}

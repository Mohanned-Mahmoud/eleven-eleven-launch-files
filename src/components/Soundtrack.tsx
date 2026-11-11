import {useRef,useState} from 'react'
import type {Personal,MusicTrack} from '../config/personal'
export function Soundtrack({song,tracks}:{song:Personal['song'];tracks?:readonly MusicTrack[]}){
 const eligible=(t:MusicTrack)=>Boolean(t.file&&t.license&&!t.license.startsWith('['))
 const configured=tracks?.filter(eligible)??[]
 const available=configured.length?configured:[{...song,id:'song',label:'Music'}].filter(eligible)
 const audio=useRef<HTMLAudioElement>(null),request=useRef(0)
 const [active,setActive]=useState(''),[playing,setPlaying]=useState(false),[error,setError]=useState(''),[open,setOpen]=useState(false)
 const selected=available.find(t=>t.id===active)??available[0]
 if(!selected)return null
 function play(track:MusicTrack){const el=audio.current;if(!el)return;const current=++request.current;el.pause();if(el.getAttribute('src')!==track.file)el.src=track.file!;setActive(track.id);setError('');void el.play().then(()=>{if(request.current===current)setPlaying(true)}).catch(()=>{if(request.current===current){setPlaying(false);setError('تعذّر تشغيل الأغنية، جرّب تاني.')}})}
 return <div className="soundtrack"><audio ref={audio} preload="none" loop/>
 {open&&available.length>1&&<div className="soundtrack-choices" role="group" aria-label="اختيار الأغنية">{available.map(track=><button key={track.id} className="text-button" aria-pressed={selected.id===track.id} onClick={()=>{play(track);setOpen(false)}}>{track.label}</button>)}</div>}
 <button className="text-button" aria-label={playing?'Mute soundtrack':'Play soundtrack'} aria-pressed={playing} onClick={()=>{if(playing){request.current++;audio.current?.pause();setPlaying(false)}else play(selected)}}>{playing?'كتم':'تشغيل'}</button>{available.length>1&&<button className="text-button soundtrack-menu-trigger" aria-label="اختيار الأغنية" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>⌄</button>}
 {error&&<p role="status" className="personal-small">{error}</p>}</div>
}

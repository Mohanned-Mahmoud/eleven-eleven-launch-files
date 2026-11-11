import {statSync} from 'node:fs'
import {resolve} from 'node:path'
import type {Personal} from '../src/config/personal.js'

// User-supplied MP3s are served through the existing launch-protected gateway.
export function withLocalAudio(personal:Personal, directory=resolve(process.cwd(),process.env.NODE_ENV==='production'?'dist/audio':'public/audio')):Personal {
 const choices=[{id:'calm',label:'هادي'},{id:'hyper',label:'مهيبر'}]
 const songs=choices.map(choice=>{
  const configured=personal.songs?.find(track=>track.id===choice.id)
  if(configured?.file)return configured
  try {
   const file=statSync(resolve(directory,`${choice.id}.mp3`))
   if(file.isFile()&&file.size>0)return {...choice,title:choice.label,file:`/audio/${choice.id}.mp3`,license:'User-supplied audio; uploader is responsible for usage permission.'}
  } catch { /* Missing tracks stay unavailable rather than showing broken controls. */ }
  return configured??{...choice,title:'',file:null,license:''}
 })
 const custom=personal.songs?.filter(track=>!choices.some(choice=>choice.id===track.id))??[]
 return {...personal,songs:[...songs,...custom]}
}

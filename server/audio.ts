import {createReadStream} from 'node:fs'
import {stat} from 'node:fs/promises'
import {pipeline} from 'node:stream/promises'
import type {IncomingMessage,ServerResponse} from 'node:http'

// Called only after the gateway has checked the launch/preview authorization.
export async function serveAudio(file:string,req:IncomingMessage,res:ServerResponse){
 let size:number
 try{const info=await stat(file);if(!info.isFile())throw Error();size=info.size}catch{res.statusCode=404;res.end();return}
 res.setHeader('Accept-Ranges','bytes')
 res.setHeader('Content-Type',file.endsWith('.m4a')?'audio/mp4':'audio/mpeg')
 let start=0,end=size-1
 if(req.headers.range&&req.method!=='HEAD'){
  const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range)
  let valid=Boolean(match&&(match[1]||match[2]))
  if(match&&valid){
   if(!match[1]){const suffix=Number(match[2]);valid=Number.isSafeInteger(suffix)&&suffix>0;start=Math.max(0,size-suffix)}
   else{start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),size-1):Math.min(start+1024*1024-1,size-1)}
   valid=valid&&Number.isSafeInteger(start)&&Number.isSafeInteger(end)&&start>=0&&start<size&&end>=start
  }
  if(!valid){res.statusCode=416;res.setHeader('Content-Range',`bytes */${size}`);res.setHeader('Content-Length',0);res.end();return}
  res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`)
 }
 res.setHeader('Content-Length',Math.max(0,end-start+1))
 if(req.method==='HEAD'||size===0){res.end();return}
 try{await pipeline(createReadStream(file,{start,end}),res)}catch{if(!res.destroyed)res.destroy()}
}

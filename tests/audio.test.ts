import test from 'node:test'
import assert from 'node:assert/strict'
import {createServer} from 'node:http'
import {mkdtemp,writeFile,rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {serveAudio} from '../server/audio.ts'

test('audio streams initial chunks, Safari probes, seeking, suffixes and HEAD correctly',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'garden-stream-')),file=join(dir,'test.mp3')
 const bytes=Buffer.alloc(2*1024*1024+13);for(let i=0;i<bytes.length;i++)bytes[i]=i%251
 await writeFile(file,bytes)
 const server=createServer((req,res)=>{void serveAudio(file,req,res)})
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve))
 const url=`http://127.0.0.1:${(server.address() as {port:number}).port}/test.mp3`
 try{
  for(const [range,start,end] of [['bytes=0-1',0,1],['bytes=0-',0,1048575],['bytes=1048576-',1048576,2097151],['bytes=-13',bytes.length-13,bytes.length-1],['bytes=2000000-9999999',2000000,bytes.length-1]] as const){
   const r=await fetch(url,{headers:{Range:range}})
   assert.equal(r.status,206);assert.equal(r.headers.get('content-range'),`bytes ${start}-${end}/${bytes.length}`)
   assert.deepEqual(Buffer.from(await r.arrayBuffer()),bytes.subarray(start,end+1))
  }
  for(const range of ['bytes=9999999-','bytes=10-2','bytes=-0','bytes=-','bytes=0-1,4-5']){
   const r=await fetch(url,{headers:{Range:range}});assert.equal(r.status,416);assert.equal(r.headers.get('content-range'),`bytes */${bytes.length}`)
  }
  const head=await fetch(url,{method:'HEAD',headers:{Range:'bytes=0-1'}})
  assert.equal(head.status,200);assert.equal(head.headers.get('content-length'),String(bytes.length));assert.equal((await head.arrayBuffer()).byteLength,0)
  const full=await fetch(url);assert.equal(full.status,200);assert.deepEqual(Buffer.from(await full.arrayBuffer()),bytes)
 }finally{await new Promise<void>(resolve=>server.close(()=>resolve()));await rm(dir,{recursive:true,force:true})}
})

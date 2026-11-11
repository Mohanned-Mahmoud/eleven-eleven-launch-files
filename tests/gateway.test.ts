import test from 'node:test'
import assert from 'node:assert/strict'
import {createServer} from 'node:http'
import {readdir,readFile} from 'node:fs/promises'
import handler from '../api/gateway.ts'
import {LAUNCH} from '../server/policy.ts'
test('real HTTP gateway denies prelaunch content/JS/assets and releases at server boundary',async()=>{
 const original=Date.now;let now=LAUNCH-1;Date.now=()=>now
 const server=createServer((req,res)=>{const u=new URL(req.url!,'http://localhost');req.url='/api/gateway?path='+encodeURIComponent(u.pathname);void handler(req,res).catch(e=>{res.statusCode=500;res.end(String(e))})});await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));const address=server.address() as {port:number};const base=`http://127.0.0.1:${address.port}`
 try{
 const js=(await readdir('dist/assets')).find(f=>f.endsWith('.js'))!
 for(const path of ['/api/content',`/assets/${js}`,'/images/grow/rose-head.webp','/handoff/phase3/source.zip']){const r=await fetch(base+path,{headers:{Date:'Wed, 11 Nov 2037 21:11:00 GMT','x-unlock':'true'}});assert.ok(r.status>=400);assert.match(r.headers.get('cache-control')!,/no-store/)}
 const r=await fetch(base+'/');const html=await r.text();assert.equal(r.status,200,html);assert.match(html,/Good things/);assert.ok(!html.includes('type="module"'));assert.ok(!html.includes('[Recipient nickname]'))
 const status=await(await fetch(base+'/api/status')).json();assert.equal(status.unlocked,false);assert.equal(status.now,LAUNCH-1)
 now=LAUNCH;assert.equal((await fetch(base+`/assets/${js}`)).status,200);const personal=await(await fetch(base+'/api/content')).json();assert.equal(personal.elevenMessages.length,11);assert.equal((await fetch(base+'/handoff/phase3/source.zip')).status,404)
 const bundle=await readFile('dist/assets/'+js,'utf8');assert.ok(!bundle.includes('[Recipient nickname]'));assert.ok(!bundle.includes('Write your personal final letter'))
 }finally{Date.now=original;await new Promise<void>(resolve=>server.close(()=>resolve()))}
})

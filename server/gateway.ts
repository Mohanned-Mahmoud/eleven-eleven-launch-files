import {previewEnabled,previewPassword,previewCookie,validPreview} from '../server/preview.js'
import {pushReady,subscribe,deliver} from '../server/push.js'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { readFile, readdir } from 'node:fs/promises'
import {resolve,extname,sep} from 'node:path'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {CountdownScene} from '../src/scenes/CountdownScene.js'
import {personalization} from '../server/personalization.js'
import {LAUNCH,unlocked,publicBeforeLaunch} from '../server/policy.js'
export default async function handler(req:IncomingMessage,res:ServerResponse){
  res.setHeader('Cache-Control','private, no-store, max-age=0');res.setHeader('CDN-Cache-Control','no-store');res.setHeader('Vercel-CDN-Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer')
  const url=new URL(req.url||'/', 'http://localhost');let path:string
  try{path=decodeURIComponent(url.searchParams.get('path')||'/')}catch{res.statusCode=400;res.end();return}
  if(!path.startsWith('/'))path='/'+path
  const now=Date.now(),launchOpen=unlocked(now),open=launchOpen||validPreview(req.headers.cookie,now)
  if(path==='/api/preview'){
    if(req.method!=='POST'||!previewEnabled()){res.statusCode=404;res.end();return}
    const origin=req.headers.origin;let host='';try{host=new URL(origin||'').host}catch{}
    if(!origin||host!==req.headers.host){res.statusCode=403;res.end();return}
    let body='';for await(const chunk of req){body+=chunk.toString();if(body.length>512){res.statusCode=413;res.end();return}}
    try{if(!previewPassword(JSON.parse(body).password)){res.statusCode=403;res.end('Incorrect preview password');return}}catch{res.statusCode=400;res.end();return}
    res.setHeader('Set-Cookie',previewCookie(now));res.end('Preview enabled for one hour');return
  }
  if(path==='/api/subscribe'){
    if(req.method!=='POST'||!pushReady()){res.statusCode=503;res.end('Notifications unavailable');return}
    if(req.headers.origin!==process.env.APP_ORIGIN){res.statusCode=403;res.end();return}
    try{let body='';for await(const chunk of req){body+=chunk.toString();if(body.length>4096){res.statusCode=413;res.end();return}}await subscribe(JSON.parse(body));res.statusCode=201;res.end('Subscribed')}catch{res.statusCode=400;res.end('Subscription could not be saved')}return
  }
  if(path==='/api/cron'){
    if(!process.env.CRON_SECRET||req.headers.authorization!==`Bearer ${process.env.CRON_SECRET}`){res.statusCode=401;res.end();return}
    if(!launchOpen||now>LAUNCH+3600000||!pushReady()){res.end('Outside launch delivery window or not configured');return}
    try{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(await deliver()))}catch{res.statusCode=503;res.end('Delivery will retry')}return
  }
  if(!['GET','HEAD'].includes(req.method||'')){res.statusCode=405;res.end();return}
  if(path==='/api/status'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({now,launch:LAUNCH,unlocked:open,pushAvailable:pushReady(),vapidPublicKey:pushReady()?process.env.VAPID_PUBLIC_KEY:null}));return}
  if(path==='/api/calendar'){res.setHeader('Content-Type','text/calendar; charset=utf-8');res.setHeader('Content-Disposition','attachment; filename="11-11.ics"');res.end('BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//11:11//Launch//EN\r\nBEGIN:VEVENT\r\nUID:1111-launch-2026@garden.invalid\r\nDTSTAMP:20261111T000000Z\r\nDTSTART:20261111T211100Z\r\nDTEND:20261111T212600Z\r\nSUMMARY:11:11 — A Garden Made for You\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n');return}
  if(path==='/api/content'){res.setHeader('Content-Type','application/json');res.statusCode=open?200:423;res.end(JSON.stringify(open?personalization:{locked:true}));return}
  if(path.startsWith('/api/')){res.statusCode=404;res.end();return}
  if(path.includes('..')||path.includes('\\')||path.includes('\0')||path.startsWith('/handoff')||path.startsWith('/.')){res.statusCode=404;res.end();return}
  const root=resolve(process.cwd(),'dist')
  if(!open&&path==='/'){
    const css=(await readdir(resolve(root,'assets'))).filter(x=>x.endsWith('.css'));const styles=(await Promise.all(css.map(x=>readFile(resolve(root,'assets',x),'utf8')))).join('\n')
    const html=renderToStaticMarkup(createElement(CountdownScene,{now}))
    res.setHeader('Content-Type','text/html; charset=utf-8');res.end(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>11:11 — A Garden Made for You</title><link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" href="/app-icon.png"><style>${styles}</style><body><div class="experience"><header class="site-header"><button id="preview-brand" class="wordmark" style="border:0;background:none;color:inherit;touch-action:none;user-select:none" aria-label="11:11">11:11</button></header>${html}<div style="position:fixed;bottom:15px;left:0;right:0;text-align:center;font:11px sans-serif"><a href="/api/calendar">Add to Calendar</a> · <button id="push" hidden>Notify me</button><button id="alert">Enable in-page launch alert</button><span id="status" role="status"></span></div></div><script>const brand=document.querySelector('#preview-brand');let hold;const cancelHold=()=>clearTimeout(hold);brand.onpointerdown=e=>{if(e.button!==0)return;cancelHold();brand.setPointerCapture(e.pointerId);hold=setTimeout(async()=>{const password=prompt('Preview password');if(!password)return;try{const r=await fetch('/api/preview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});if(r.ok)location.reload();else alert('Preview unavailable or password incorrect. Set PREVIEW_SECRET in Vercel (at least 24 characters).')}catch{alert('Could not connect. Please try again.')}},5000)};brand.onpointerup=cancelHold;brand.onpointercancel=cancelHold;brand.onlostpointercapture=cancelHold;window.addEventListener('blur',cancelHold);let server=${now},base=performance.now(),checking=false,alerts=false;document.querySelector('#alert').onclick=()=>{alerts=true;document.querySelector('#status').textContent=' Keep this page open. We will let you know.'};document.querySelector('#push').onclick=async()=>{try{const s=await(await fetch('/api/status',{cache:'no-store'})).json();const permission=await Notification.requestPermission();if(permission!=='granted')return;const registration=await navigator.serviceWorker.register('/launch-sw.js');await navigator.serviceWorker.ready;const key=Uint8Array.from(atob(s.vapidPublicKey.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));const subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});const result=await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(subscription)});if(!result.ok)throw Error();document.querySelector('#status').textContent=' Notification subscription saved.'}catch{document.querySelector('#status').textContent=' Notifications unavailable. Add to Calendar instead.'}};async function verify(){if(checking)return;checking=true;try{const r=await fetch('/api/status',{cache:'no-store'});if(!r.ok)throw Error();const s=await r.json();server=s.now;base=performance.now();document.querySelector('#push').hidden=!(s.pushAvailable&&'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window);if(s.unlocked){if(alerts)document.querySelector('#status').textContent='Your garden is ready.';location.reload()}}catch{document.querySelector('#status').textContent=' Reconnecting to verify launch…'}finally{checking=false}}setInterval(()=>{const t=Math.max(0,Math.ceil((${LAUNCH}-(server+performance.now()-base))/1000));const v=[Math.floor(t/86400),Math.floor(t/3600)%24,Math.floor(t/60)%60,t%60];document.querySelectorAll('.countdown-value').forEach((e,i)=>e.textContent=String(v[i]).padStart(2,'0'));if(!t)verify()},250);setInterval(verify,10000);document.addEventListener('visibilitychange',verify);verify()</script></body></html>`);return
  }
  if(!open&&!publicBeforeLaunch(path)){res.statusCode=423;res.end('This garden opens at 11:11 PM Cairo.');return}
  const file=resolve(root,path==='/'?'index.html':path.slice(1));if(!file.startsWith(root+sep)){res.statusCode=404;res.end();return}
  try{const body=await readFile(file);const mime:Record<string,string>={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json','.mp3':'audio/mpeg','.m4a':'audio/mp4'};res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.end(req.method==='HEAD'?undefined:body)}catch{res.statusCode=404;res.end()}
}

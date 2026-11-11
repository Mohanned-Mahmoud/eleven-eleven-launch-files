import * as webpush from 'web-push'
import {createHash} from 'node:crypto'
export function pushReady(){return ['REDIS_REST_URL','REDIS_REST_TOKEN','VAPID_PUBLIC_KEY','VAPID_PRIVATE_KEY','VAPID_SUBJECT','CRON_SECRET','APP_ORIGIN'].every(k=>Boolean(process.env[k]))}
async function redis(...args:(string|number)[]){const r=await fetch(process.env.REDIS_REST_URL!,{method:'POST',headers:{Authorization:`Bearer ${process.env.REDIS_REST_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(args)});if(!r.ok)throw Error('Subscription store unavailable');const data=await r.json();if(data.error)throw Error('Subscription store error');return data.result}
export function validSubscription(s:any){try{const u=new URL(s.endpoint);return u.protocol==='https:'&&['fcm.googleapis.com','updates.push.services.mozilla.com','web.push.apple.com'].includes(u.hostname)&&!u.port&&!u.username&&!u.password&&typeof s.keys?.p256dh==='string'&&s.keys.p256dh.length<300&&typeof s.keys?.auth==='string'&&s.keys.auth.length<100}catch{return false}}
export async function subscribe(s:any){if(!validSubscription(s))throw Error('Invalid push subscription');const id=createHash('sha256').update(s.endpoint).digest('hex');await redis('HSET','1111:subscriptions',id,JSON.stringify({endpoint:s.endpoint,keys:s.keys}));return id}
export async function deliver(){
 webpush.setVapidDetails(process.env.VAPID_SUBJECT!,process.env.VAPID_PUBLIC_KEY!,process.env.VAPID_PRIVATE_KEY!)
 const entries=await redis('HGETALL','1111:subscriptions') as string[];let sent=0,failed=0
 for(let i=0;i<entries.length;i+=2){const id=entries[i];if(await redis('HEXISTS','1111:delivered:2026',id))continue
 if(!await redis('SET',`1111:claim:${id}`,'1','NX','EX',120))continue
 try{await webpush.sendNotification(JSON.parse(entries[i+1]),JSON.stringify({title:'11:11 — Your garden is ready',body:'A little universe is waiting for you.',url:process.env.APP_ORIGIN}),{TTL:3600,timeout:5000});await redis('HSET','1111:delivered:2026',id,'1');sent++}catch(e:any){if(e.statusCode===404||e.statusCode===410)await redis('HDEL','1111:subscriptions',id);failed++}finally{await redis('DEL',`1111:claim:${id}`)}
 }return {sent,failed}
}

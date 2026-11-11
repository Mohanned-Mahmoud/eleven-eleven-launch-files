import {createHmac,timingSafeEqual} from 'node:crypto'
const name='garden_preview'
export function previewEnabled(){return (process.env.PREVIEW_SECRET||'').length>=24}
export function previewPassword(value:string){if(!previewEnabled())return false;const a=Buffer.from(value),b=Buffer.from(process.env.PREVIEW_SECRET!);return a.length===b.length&&timingSafeEqual(a,b)}
function signature(value:string){return createHmac('sha256',process.env.PREVIEW_SECRET!).update(value).digest('hex')}
export function previewCookie(now:number){const expires=String(now+3600000);return `${name}=${expires}.${signature(expires)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`}
export function validPreview(cookie:string|undefined,now:number){if(!previewEnabled())return false;const value=cookie?.split(';').map(v=>v.trim()).find(v=>v.startsWith(name+'='))?.slice(name.length+1);if(!value)return false;const [expires,sig]=value.split('.');if(!/^\d+$/.test(expires)||!sig||Number(expires)<=now||Number(expires)>now+3600000)return false;const a=Buffer.from(sig),b=Buffer.from(signature(expires));return a.length===b.length&&timingSafeEqual(a,b)}

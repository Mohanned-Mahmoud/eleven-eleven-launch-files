export const LAUNCH = Date.parse('2026-11-11T21:11:00Z')
export function unlocked(now=Date.now()){return now>=LAUNCH}
export function publicBeforeLaunch(path:string){return path==='/'||path==='/favicon.svg'||path==='/launch-sw.js'||path==='/manifest.webmanifest'||path==='/app-icon.png'||/^\/assets\/[a-zA-Z0-9_-]+\.woff2$/.test(path)||['/images/garden-rose.webp','/images/garden-rose-mobile.webp','/images/roses-dark.webp','/images/roses-dark-mobile.webp'].includes(path)}

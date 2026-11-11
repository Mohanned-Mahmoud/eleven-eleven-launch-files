import type { Flower } from '../grow/model'
import { artworkAssets, bouquetMarkup } from './artwork'
import { finalMessage } from './composition'
const dataCache=new Map<string,Promise<string>>()
function dataUrl(path:string) {
  if(!dataCache.has(path)) dataCache.set(path,fetch(path).then(r=>{if(!r.ok)throw new Error('A flower image could not be loaded. Please try again.');return r.blob()}).then(blob=>new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(blob)})).catch(e=>{dataCache.delete(path);throw e}))
  return dataCache.get(path)!
}
export async function exportBouquet(flowers:readonly Flower[]):Promise<Blob> {
  if(!flowers.length) throw new Error('Choose a flower before saving your bouquet.')
  const embedded=Object.fromEntries(await Promise.all(artworkAssets(flowers).map(async path=>[path,await dataUrl(path)])))
  await document.fonts.load('48px "Cormorant Garamond Variable"')
  await document.fonts.ready
  // All assets embedded before SVG decoding; no foreignObject or cross-origin canvas.
  const svg=new Blob([bouquetMarkup(flowers,embedded)],{type:'image/svg+xml;charset=utf-8'})
  const url=URL.createObjectURL(svg)
  try {
    const image=new Image();image.decoding='sync'
    await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('Could not prepare the bouquet image. Please try again.'));image.src=url})
    const canvas=document.createElement('canvas');canvas.width=1800;canvas.height=2400
    const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Image saving is unavailable in this browser.')
    ctx.fillStyle='#F8EBDD';ctx.fillRect(0,0,1800,2400)
    ctx.strokeStyle='#d2beb0';ctx.lineWidth=2;ctx.strokeRect(72,72,1656,2256)
    ctx.textAlign='center';ctx.fillStyle='#70505d';ctx.font='36px "DM Sans Variable", sans-serif';ctx.fillText('11:11',900,185)
    ctx.drawImage(image,90,150,1620,1890)
    ctx.fillStyle='#292039';ctx.font='72px "Cormorant Garamond Variable", Georgia, serif';ctx.fillText(finalMessage[0],900,2090)
    ctx.font='italic 66px "Cormorant Garamond Variable", Georgia, serif';ctx.fillStyle='#92556e';ctx.fillText(finalMessage[1],900,2200)
    return await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not save the image. Please try again.')),'image/png'))
  } finally {URL.revokeObjectURL(url)}
}
export async function saveBouquet(blob:Blob, fallback:(url:string)=>void) {
  const file=new File([blob],'11-11-my-bouquet.png',{type:'image/png'})
  // Share requires the original tap's activation: prepare the Blob before enabling Save.
  if(navigator.canShare?.({files:[file]})) {
    try {await navigator.share({files:[file],title:'My 11:11 bouquet'});return}
    catch(e){if(e instanceof Error&&e.name==='AbortError')return}
  }
  const url=URL.createObjectURL(blob);fallback(url)
  const link=document.createElement('a');link.href=url;link.download=file.name;document.body.append(link);link.click();link.remove()
  // Retain URL while the inline iOS save fallback is displayed; caller owns cleanup.
}

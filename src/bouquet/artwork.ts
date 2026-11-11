import type { Flower } from '../grow/model'
import { appearance, arrangeBouquet } from './composition'
export type AssetMap=Record<string,string>
export const artworkAssets=(flowers:readonly Flower[])=>[...new Set(flowers.flatMap(f=>[`/images/grow/${f.variety}-head.webp`,`/images/grow/${f.variety==='ranunculus'?'peony':f.variety}-leaf.webp`]))]
/** Shared screen/export geometry. Images, SVG filters, folds and ribbon are identical. */
export function bouquetMarkup(flowers:readonly Flower[], embedded:AssetMap={}) {
  const src=(path:string)=>embedded[path]??path
  const placements=arrangeBouquet(flowers)
  const flora=placements.map(({flower:f,x,y,size,rotation,stemEnd})=>{
    const a=appearance(f)
    return `<g class="bouquet-flower" data-bouquet-flower="${f.id}" data-variety="${f.variety}" data-color="${f.color}" transform="rotate(${rotation} ${x} ${y})">
      <defs><clipPath id="head-crop-${f.id}"><rect x="${x-size*.475}" y="${y-size/2}" width="${size*.93}" height="${size}"/></clipPath><clipPath id="leaf-crop-${f.id}"><ellipse cx="${x-18+size*.36}" cy="${y+43+size*.43}" rx="${size*.34}" ry="${size*.43}"/></clipPath><filter id="bouquet-color-${f.id}" color-interpolation-filters="sRGB"><feColorMatrix type="hueRotate" values="${a.hue}"/><feColorMatrix type="saturate" values="${a.saturation}"/><feComponentTransfer><feFuncR type="linear" slope="${a.brightness}"/><feFuncG type="linear" slope="${a.brightness}"/><feFuncB type="linear" slope="${a.brightness}"/></feComponentTransfer></filter></defs>
      <path d="M${x} ${y+18} C${x+f.lean*2} ${y+130} 294 461 ${292+(f.id%5)*4} ${stemEnd}" fill="none" stroke="#586d49" stroke-width="4"/>
      <path d="M${x+1} ${y+22} Q${x+10} ${y+130} 301 475" fill="none" stroke="#98a577" stroke-width="1" opacity=".65"/>
      <image href="${src(`/images/grow/${f.variety==='ranunculus'?'peony':f.variety}-leaf.webp`)}" x="${x-18}" y="${y+43}" width="${size*.72}" height="${size*.86}" clip-path="url(#leaf-crop-${f.id})" transform="rotate(${f.id%2?-45:18} ${x} ${y+100})"/>
      <image href="${src(`/images/grow/${f.variety}-head.webp`)}" x="${x-size/2}" y="${y-size/2}" width="${size}" height="${size}" filter="url(#bouquet-color-${f.id})" clip-path="url(#head-crop-${f.id})"/>
    </g>`
  }).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 600 700" role="img" aria-label="Your bouquet of ${flowers.length} selected flowers"><defs>
    <linearGradient id="paper-left" x1="0" x2="1" y2=".4"><stop stop-color="#c6b6a3"/><stop offset=".3" stop-color="#f8ebdd"/><stop offset="1" stop-color="#dfd0be"/></linearGradient>
    <linearGradient id="paper-right"><stop stop-color="#e0d0bb"/><stop offset=".6" stop-color="#fff1dd"/><stop offset="1" stop-color="#c8b5a0"/></linearGradient>
    <linearGradient id="satin"><stop stop-color="#764454"/><stop offset=".42" stop-color="#d99aaf"/><stop offset=".65" stop-color="#b56c88"/><stop offset="1" stop-color="#7c465d"/></linearGradient>
    <radialGradient id="ground-shadow"><stop stop-color="#000" stop-opacity=".2"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  </defs>
  <ellipse cx="300" cy="650" rx="151" ry="21" fill="url(#ground-shadow)"/>
  <g class="paper-back"><path d="M115 295 L290 365 L490 285 L361 620 Q302 655 250 619Z" fill="url(#paper-left)"/><path d="M115 295 L298 472 L490 285 L360 558 L253 561Z" fill="#f4e7d5" opacity=".65"/></g>
  <g class="bouquet-flowers">${flora}</g>
  <g class="paper-fold paper-fold-left"><path d="M109 327 Q185 361 300 480 L342 625 Q291 653 245 616Z" fill="url(#paper-left)"/><path d="M109 327 Q179 409 249 615" fill="none" stroke="#ac9a85" stroke-width="1" opacity=".6"/><path d="M118 343 L305 489 L260 585Z" fill="#fff4e5" opacity=".2"/></g>
  <g class="paper-fold paper-fold-right"><path d="M487 329 Q412 383 298 479 L254 621 Q310 645 355 610Z" fill="url(#paper-right)"/><path d="M487 329 Q418 458 355 610" fill="none" stroke="#c5b19b" stroke-width="1"/><path d="M302 487L455 362L346 603Z" fill="#fff7ed" opacity=".2"/></g>
  <g class="ribbon-band"><path d="M230 525 Q300 548 372 523 L365 544 Q300 563 238 546Z" fill="url(#satin)"/><path d="M235 528 Q302 550 369 527" fill="none" stroke="#edc5d1" opacity=".6"/></g>
  <g class="ribbon-bow"><path d="M300 541 C230 481 200 518 247 546 Q273 555 300 541Z" fill="url(#satin)" stroke="#a56b7f" stroke-width=".6"/><path d="M300 541 C359 483 401 520 350 548 Q325 555 300 541Z" fill="url(#satin)" stroke="#a56b7f" stroke-width=".6"/><path d="M292 542 Q286 588 258 617 L274 610 L281 624 Q305 577 307 548Z" fill="url(#satin)"/><path d="M305 543 Q325 585 345 601 L329 600 L329 613 Q302 580 297 547Z" fill="url(#satin)"/><ellipse cx="300" cy="542" rx="11" ry="8" fill="url(#satin)"/><path d="M296 537 L302 546" stroke="#efc2d1" opacity=".5"/></g></svg>`
}

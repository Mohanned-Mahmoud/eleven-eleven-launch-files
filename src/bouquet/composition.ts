import type { Flower } from '../grow/model'
export const BOUQUET_LIMIT = 12
export const finalMessage = ['Until I can bring you real ones.', 'These are yours. Every single one.'] as const
export function appearance(flower: Flower) {
  const native = {rose:346,tulip:45,peony:346,ranunculus:25,cosmos:295}[flower.variety]
  return { hue:flower.color===1?0:[346,45,346,25,295][flower.color]-native, saturation:flower.color===1?.25:flower.color===2?.73:1, brightness:flower.color===1?1.15:1 }
}
/** Deterministic, identity-preserving staggered rows around one hand-tied binding point. */
export function arrangeBouquet(flowers: readonly Flower[]) {
  if(flowers.length>BOUQUET_LIMIT) throw new Error('A bouquet holds at most twelve flowers.')
  if(new Set(flowers.map(f=>f.id)).size!==flowers.length) throw new Error('A flower can only be picked once.')
  const rows=flowers.length<=3?[flowers.length]:flowers.length<=5?[3,flowers.length-3]:flowers.length<=8?[3,3,flowers.length-6]:[4,4,flowers.length-8]
  let index=0
  return rows.flatMap((count,row)=>Array.from({length:count},(_,col)=>{
    const f=flowers[index++];const spread=count===1?0:Math.min(300,flowers.length>8?305:270)
    const x=300+(count===1?0:(col/(count-1)-.5)*spread)+(row%2?13:-5)
    const y=flowers.length===1?225:170+row*65+((col+f.id)%3)*9
    return {flower:f,x,y,size:flowers.length===1?160:flowers.length<=3?145:flowers.length<=8?128:112,rotation:(x-300)*.065+f.lean*.3,stemEnd:614+(index%3)*13}
  }))
}
export function addPicked(flowers: readonly Flower[], flower:Flower) {
  return flowers.some(f=>f.id===flower.id)||flowers.length>=BOUQUET_LIMIT?[...flowers]:[...flowers,flower]
}

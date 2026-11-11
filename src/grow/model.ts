export const varieties = [
  { id: 'rose', label: 'Rose', color: 'Blush pink', height: 210, leaves: 'serrated' },
  { id: 'tulip', label: 'Tulip', color: 'Ivory', height: 245, leaves: 'lance' },
  { id: 'peony', label: 'Peony', color: 'Dusty rose', height: 195, leaves: 'lobed' },
  { id: 'ranunculus', label: 'Ranunculus', color: 'Soft peach', height: 225, leaves: 'lobed' },
  { id: 'cosmos', label: 'Cosmos', color: 'Muted lavender', height: 255, leaves: 'feathery' },
] as const
export const colors = [
  { label: 'Blush pink', hex: '#e6b0bf', hue: 0 },
  { label: 'Ivory', hex: '#eee2cf', hue: 0 },
  { label: 'Dusty rose', hex: '#ba7b90', hue: -12 },
  { label: 'Soft peach', hex: '#e7b99e', hue: 28 },
  { label: 'Muted lavender', hex: '#b3a0c2', hue: -32 },
] as const
export type Variety = typeof varieties[number]['id']
export type Flower = { id: number; x: number; y: number; variety: Variety; color: number; lean: number }
export const MAX_FLOWERS = 8
export const MAX_GROWING = 2
export function validPosition(x: number, y: number) { return x >= 10 && x <= 90 && y >= 71 && y <= 92 && ((x-50)/43)**2 + ((y-82)/12)**2 <= 1 }
export function canPlant(flowers: Flower[], x: number, y: number, width: number, height: number) {
  return validPosition(x,y) && flowers.length < MAX_FLOWERS && flowers.every(f => Math.hypot((f.x-x)*width/100,(f.y-y)*height/100) >= Math.max(54,Math.min(78,width*.16)))
}

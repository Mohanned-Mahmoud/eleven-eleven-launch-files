import test from 'node:test'
import assert from 'node:assert/strict'
import type { Flower } from '../src/grow/model.ts'
import {addPicked,arrangeBouquet,appearance} from '../src/bouquet/composition.ts'
import {bouquetMarkup,artworkAssets} from '../src/bouquet/artwork.ts'
const make=(n:number):Flower[]=>Array.from({length:n},(_,i)=>({id:i+1,x:50,y:80,variety:(['rose','tulip','peony','ranunculus','cosmos'] as const)[i%5],color:(i+2)%5,lean:i%7-3}))
for(const n of [1,3,5,8,12])test(`${n} actual flowers retain identities, varieties and colors in arrangement and export`,()=>{const f=make(n),a=arrangeBouquet(f);assert.deepEqual(a.map(p=>p.flower),f);assert.deepEqual(arrangeBouquet(f),a);assert.equal((bouquetMarkup(f).match(/data-bouquet-flower=/g)||[]).length,n);for(const p of a){assert.ok(p.x-p.size/2>40&&p.x+p.size/2<560);assert.ok(p.y-p.size/2>45);assert.ok(bouquetMarkup(f).includes(`data-color="${p.flower.color}"`))}assert.ok(artworkAssets(f).every(path=>path.startsWith('/images/grow/')))})
test('harvesting rejects duplicates and a thirteenth flower',()=>{const f=make(12);assert.deepEqual(addPicked(f,f[0]),f);assert.deepEqual(addPicked(f,{...f[0],id:99}),f);assert.throws(()=>arrangeBouquet([...f,{...f[0],id:99}]))})
test('palette filters match original growing scene interpretation',()=>{assert.deepEqual(appearance(make(1)[0]),{hue:0,saturation:.73,brightness:1});assert.equal(appearance({...make(1)[0],color:1}).brightness,1.15)})

import test from 'node:test'
import assert from 'node:assert/strict'
import {canPlant, validPosition, MAX_FLOWERS, varieties} from '../src/grow/model.ts'
import type {Flower} from '../src/grow/model.ts'
const flower:Flower={id:1,x:50,y:80,variety:'rose',color:0,lean:3}
test('safe earth excludes headings, edges and controls',()=>{assert.equal(validPosition(50,80),true);for(const [x,y] of [[9,80],[91,80],[50,70],[50,93]])assert.equal(validPosition(x,y),false)})
test('overlap and density are bounded at every viewport',()=>{for(const [w,h] of [[276,176],[346,320],[386,340]]){assert.equal(canPlant([flower],50,80,w,h),false);assert.equal(canPlant([flower],10,80,w,h),true)}assert.equal(canPlant(Array(MAX_FLOWERS).fill(flower),10,80,346,320),false)})
test('five distinct species are configured',()=>{assert.equal(new Set(varieties.map(v=>v.id)).size,5);assert.equal(new Set(varieties.map(v=>v.height)).size,5)})

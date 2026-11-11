import test from 'node:test'
import assert from 'node:assert/strict'
import {LAUNCH,unlocked,publicBeforeLaunch} from '../server/policy.ts'
test('server launch boundary is exact',()=>{assert.equal(unlocked(LAUNCH-1),false);assert.equal(unlocked(LAUNCH),true)})
test('private bundles, memories, audio and old source handoffs are denied before launch',()=>{for(const p of ['/assets/index-private.js','/images/private.jpg','/song.mp3','/handoff/phase3/source.zip','/server/personalization.ts'])assert.equal(publicBeforeLaunch(p),false);assert.equal(publicBeforeLaunch('/'),true)})

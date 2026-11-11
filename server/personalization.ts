// SERVER ONLY. Actual personal details belong in PERSONALIZATION_JSON, not public Git.
import type {Personal} from '../src/config/personal.js'
import {withLocalAudio} from './local-audio.js'
const defaults:Personal={
 nickname:'[Recipient nickname]',signature:'[Sender signature]',
 elevenMessages:Array.from({length:11},(_,i)=>`[Personal message ${i+1} — add a real detail]`),
 insideJokes:['[Inside joke — replace with your own words]'],
 memories:[{title:'[Memory title]',caption:'[Describe a real shared memory]',image:null}],
 song:{title:'[Song title]',file:null,license:'[License/permission reference required]'},
 songs:[{id:'calm',label:'هادي',title:'[Calm track]',file:null,license:''},{id:'hyper',label:'مهيبر',title:'[Upbeat track]',file:null,license:''}],
 letter:['[Write your personal final letter here.]'],hiddenMessages:['[A hidden message for her]'],
}
let overrides:Partial<Personal>={}
if(process.env.PERSONALIZATION_JSON){try{const parsed=JSON.parse(process.env.PERSONALIZATION_JSON);if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))overrides=parsed}catch{console.error('Invalid PERSONALIZATION_JSON; using placeholders')}}
export const personalization:Personal=withLocalAudio({...defaults,...overrides})

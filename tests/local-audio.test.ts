import test from 'node:test'
import assert from 'node:assert/strict'
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {withLocalAudio} from '../server/local-audio.ts'
import {personalization} from '../server/personalization.ts'

test('uploaded tracks become available individually; missing or empty files stay hidden',()=>{
 const dir=mkdtempSync(join(tmpdir(),'garden-audio-'))
 const base={...personalization,songs:[]}
 try {
  assert.equal(withLocalAudio(base,dir).songs?.filter(t=>t.file).length,0)
  writeFileSync(join(dir,'calm.mp3'),'user audio')
  writeFileSync(join(dir,'hyper.mp3'),'')
  assert.deepEqual(withLocalAudio(base,dir).songs?.filter(t=>t.file).map(t=>t.file),['/audio/calm.mp3'])
  writeFileSync(join(dir,'hyper.mp3'),'user audio')
  assert.equal(withLocalAudio(base,dir).songs?.filter(t=>t.file).length,2)
  const explicit={id:'calm',label:'Calm',title:'Custom',file:'/private/custom.mp3',license:'Permission'}
  assert.deepEqual(withLocalAudio({...base,songs:[explicit]},dir).songs?.[0],explicit)
  assert.equal(base.songs.length,0,'does not mutate configuration')
 } finally {rmSync(dir,{recursive:true,force:true})}
})

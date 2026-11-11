import {chromium} from '@playwright/test'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=user-gesture-required']})
try {
 const page=await browser.newPage({viewport:{width:320,height:568},reducedMotion:'reduce'})
 await page.route('**/api/content',async route=>{
  const response=await route.fetch(),data=await response.json()
  data.songs=['calm','hyper'].map(id=>({id,label:id,title:id,file:`/audio/${id}.mp3`,license:'User supplied'}))
  await route.fulfill({response,json:data})
 })
 await page.goto(`${process.env.TEST_BASE_URL||'http://localhost:5175'}/?scene=opening&clean=1`)
 await page.getByRole('button',{name:'Enter my little universe'}).click()
 await page.waitForFunction(()=>{const a=document.querySelector('audio');return a&&!a.paused&&a.currentTime>0})
 assert.match(await page.locator('audio').getAttribute('src'),/calm.mp3$/)
 const scene=await page.locator('main').getAttribute('data-scene')
 await page.getByRole('button',{name:'Tap to change song'}).click()
 await page.waitForFunction(()=>{const a=document.querySelector('audio');return a?.src.endsWith('hyper.mp3')&&!a.paused&&a.currentTime>0})
 await page.getByRole('button',{name:'Tap to change song'}).click()
 await page.waitForFunction(()=>{const a=document.querySelector('audio');return a?.src.endsWith('calm.mp3')&&!a.paused&&a.currentTime>0})
 assert.equal(await page.locator('main').getAttribute('data-scene'),scene)
 assert.equal(await page.getByRole('button',{name:/Mute soundtrack|Play soundtrack/}).count(),0)
 assert.equal(await page.locator('audio').getAttribute('controls'),null)
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
 await page.screenshot({path:'work/screenshots/audio-footer/switch-only-320.png'})
 console.log('PASS: first-interaction playback, both actual MP3s, repeat switching, no pause control, scene preserved, 320px layout')
} finally {await browser.close()}

import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const base = process.env.TEST_BASE_URL || 'http://localhost:5173'
const output = process.env.SCREENSHOT_DIR || 'work/screenshots'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] })
const sizes = [[320,568], [375,667], [390,844], [430,932], [1440,900]]
const errors = []
const measurements = []
try {
  await Promise.all(['countdown','opening','garden'].map(async scene => {
    const page = await browser.newPage({ reducedMotion: 'reduce', deviceScaleFactor: 1 })
    page.on('pageerror', e => errors.push(e.message))
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`) })
    for (const [width,height] of sizes) {
      await page.setViewportSize({ width, height })
      await page.goto(`${base}/?scene=${scene}&at=2026-11-11T17:18:06Z`)
      await page.evaluate(() => document.fonts.ready)
      await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0))
      await page.locator(`[data-scene="${scene}"]`).waitFor()
      await page.screenshot({ path: `${output}/${scene}-${width}x${height}.png`, fullPage: true })
      const metric = await page.evaluate(() => ({width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, heading: document.querySelector('h1').getBoundingClientRect().toJSON(), main: document.querySelector('main').getBoundingClientRect().toJSON()}))
      assert.ok(metric.scrollWidth <= width, `${scene} horizontal overflow at ${width}`)
      assert.ok(metric.scrollHeight <= height + 1, `${scene} vertical overflow at ${width}x${height}: ${metric.scrollHeight}`)
      assert.ok(metric.heading.top > 50 && metric.heading.bottom < height - 70, `${scene} heading clipped`)
      measurements.push({ scene, ...metric })
    }
    await page.close()
  }))
  const page = await browser.newPage({ viewport: {width:390,height:844}, reducedMotion: 'reduce' })
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(`${base}/?scene=opening`)
  await page.getByRole('button', {name: 'Enter my little universe'}).click()
  await prologue(page)
  await page.locator('[data-scene="garden"]').waitFor()
  assert.equal(await page.locator('h1').evaluate(e => e === document.activeElement), true, 'focus follows scene change')
  await page.getByRole('button', {name:'Discover a little rose'}).click()
  await page.getByRole('heading', {name: 'Every lovely thing starts small.'}).waitFor()
  await page.screenshot({path: `${output}/garden-detail-390x844.png`})
  await page.getByRole('button', {name:'Close garden note'}).click()
  await page.getByRole('button', {name:'Back to our moment'}).click()
  await page.locator('[data-scene="memories"]').waitFor()
  await page.getByRole('button',{name:'Continue',exact:true}).click()
  assert.equal(await page.getByRole('button', {name:'Botanical notes'}).count(), 0)
  // Live clock crossing: normal entry, no preview scene override.
  await page.clock.install({time: new Date('2026-11-11T21:10:59.000Z')})
  await page.goto(base)
  await page.locator('[data-scene="countdown"]').waitFor()
  await page.clock.runFor(1200)
  await page.locator('[data-scene="opening"]').waitFor()
  await page.clock.resume()
  await page.emulateMedia({reducedMotion:'no-preference'})
  await page.goto(`${base}/?scene=opening`)
  await page.getByRole('button', {name:'Pause motion'}).click()
  assert.equal(await page.locator('.experience').evaluate(e=>e.classList.contains('is-still')), true)
  await page.getByRole('button', {name:'Resume motion'}).click()
  await page.getByRole('button', {name:'Enter my little universe'}).click()
  await prologue(page)
  await page.locator('[data-scene="garden"]').waitFor()
  await page.waitForTimeout(1600)
  await page.screenshot({path:`${output}/garden-motion-390x844.png`})
  assert.deepEqual(errors, [])
  await writeFile(`${output}/verification.json`, JSON.stringify({ passed:true, sizes, measurements, errors, checks:['15 scene/viewport captures','No horizontal or vertical overflow','All images loaded','No browser or network errors','Opening to garden and back','Garden note opens and closes','Botanical notes removed','Release boundary automatically transitions','Reduced motion and pause/resume','Focus follows scene transitions'] },null,2))
  console.log(`PASS: 15 scene/viewport captures, 2 interaction captures, release and accessibility checks. ${output}`)
} finally { await browser.close() }

async function prologue(page){await page.getByRole('button',{name:'Continue',exact:true}).click();for(let i=0;i<10;i++)await page.getByRole('button',{name:'Another little thing'}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();for(let i=1;i<=11;i++)await page.getByRole('button',{name:`Collect light ${i}`,exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click()}

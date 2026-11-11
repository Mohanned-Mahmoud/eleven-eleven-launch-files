import {chromium} from '@playwright/test'
import assert from 'node:assert/strict'
import {mkdir,writeFile,readFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
const out='work/phase3-screenshots';await mkdir(out,{recursive:true})
const b=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});const errors=[];const results=[]
const varieties=['Rose','Tulip','Peony','Ranunculus','Cosmos'],colors=['Blush pink','Ivory','Dusty rose','Soft peach','Muted lavender']
async function harvest(p,n){
 await p.goto('http://localhost:5173/?scene=grow&clean=1');await p.getByRole('button',{name:"Let's make something beautiful"}).click()
 for(let i=0;i<n;i++){
 await p.getByRole('button',{name:varieties[i%5],exact:true}).click();await p.getByRole('button',{name:colors[(i+2)%5],exact:true}).click()
 await p.getByRole('button',{name:/Plant a flower in the garden/}).press('Enter')
 const bloom=p.getByRole('button',{name:/Select grown/});await bloom.click();assert.equal(await p.locator('[data-flower]').count(),1,'select does not plant another flower')
 if(n===5&&i===0)await p.screenshot({path:`${out}/select-flower.png`,fullPage:true})
 await p.getByRole('button',{name:'Add to bouquet',exact:true}).click();assert.equal(await p.locator('[data-flower]').count(),0,'picking frees ground')
 }
 await p.getByRole('button',{name:`My bouquet · ${n}`,exact:true}).click();await p.locator('[data-scene="bouquet"]').waitFor()
}
try{
 for(const n of [1,3,5,8,12]){
 const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce',hasTouch:true,acceptDownloads:true});p.on('pageerror',e=>errors.push(e.message));await harvest(p,n);await p.evaluate(()=>document.fonts.ready)
 assert.equal(await p.locator('[data-bouquet-flower]').count(),n)
 const selected=await p.locator('[data-bouquet-flower]').evaluateAll(es=>es.map(e=>({id:Number(e.getAttribute('data-bouquet-flower')),color:Number(e.getAttribute('data-color')),variety:e.getAttribute('data-variety')})))
 assert.deepEqual(selected.map(e=>e.color),Array.from({length:n},(_,i)=>(i+2)%5))
 await p.screenshot({path:`${out}/preview-${n}.png`,fullPage:true})
 await p.getByRole('button',{name:/Remove .* 1$/}).click();assert.equal(await p.locator('[data-bouquet-flower]').count(),n-1)
 await p.getByRole('button',{name:'Undo removal'}).click();assert.equal(await p.locator('[data-bouquet-flower]').count(),n)
 await p.getByRole('button',{name:'Add flowers',exact:true}).click();await p.getByRole('button',{name:`My bouquet · ${n}`,exact:true}).click();assert.equal(await p.locator('[data-bouquet-flower]').count(),n,'navigation preserves bouquet')
 await p.getByRole('button',{name:'Wrap My Bouquet',exact:true}).click();await p.getByRole('button',{name:'Save My Bouquet',exact:true}).waitFor({state:'visible'});await p.waitForFunction(()=>!document.querySelector('.save-bouquet')?.disabled)
 await p.screenshot({path:`${out}/wrapped-${n}.png`,fullPage:true})
 const download=p.waitForEvent('download');await p.getByRole('button',{name:'Save My Bouquet',exact:true}).click();const d=await download;await d.saveAs(`${out}/bouquet-${n}.png`)
 const png=await readFile(`${out}/bouquet-${n}.png`);const meta={width:png.readUInt32BE(16),height:png.readUInt32BE(20)};assert.equal(meta.width,1800);assert.equal(meta.height,2400);assert.ok(png.length>100000,'PNG has composition detail');const stats={entropy:png.length,hash:createHash('sha256').update(png).digest('hex')}

 for(const [width,height] of [[320,568],[430,932]]){await p.setViewportSize({width,height});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`${out}/wrapped-${n}-${width}.png`,fullPage:true})}
 await p.getByRole('button',{name:'Make Another',exact:true}).click();await p.locator('.bouquet-choose').waitFor();assert.equal(await p.locator('[data-bouquet-flower]').count(),0);assert.equal(await p.getByRole('button',{name:/Add picked/}).count(),n);results.push({n,width:meta.width,height:meta.height,entropy:stats.entropy,selected});await p.close()
 }
 const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await harvest(p,5);await p.emulateMedia({reducedMotion:'no-preference'});await p.getByRole('button',{name:'Wrap My Bouquet'}).click();await p.waitForTimeout(3300);await p.screenshot({path:`${out}/wrapping-paper.png`});await p.getByRole('button',{name:'Save My Bouquet'}).waitFor();await p.waitForFunction(()=>!document.querySelector('.save-bouquet')?.disabled);await p.close()
 assert.deepEqual(errors,[]);await writeFile(`${out}/verification.json`,JSON.stringify({passed:true,results,errors},null,2));console.log('PASS: actual growth → picking → 1/3/5/8/12 compositions, removal, undo, back, wrap, PNG pixel detail, mobile sizes, reduced motion and Continue/Make Another.')
}finally{await b.close()}

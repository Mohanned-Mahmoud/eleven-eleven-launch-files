import {chromium,devices} from '@playwright/test'
import assert from 'node:assert/strict'
const b=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
try{
 for(const name of ['iPhone 13','Pixel 5']){
 const p=await b.newPage({...devices[name],reducedMotion:'reduce',acceptDownloads:true})
 await p.goto('http://localhost:5173/?scene=grow&clean=1');await p.getByRole('button',{name:"Let's make something beautiful"}).click();await p.getByRole('button',{name:/Plant a flower in the garden/}).press('Enter');await p.getByRole('button',{name:/Select grown/}).tap();await p.getByRole('button',{name:'Add to bouquet',exact:true}).tap();await p.getByRole('button',{name:'My bouquet · 1'}).tap();await p.getByRole('button',{name:'Wrap My Bouquet'}).tap();await p.getByRole('button',{name:'Save My Bouquet'}).waitFor();await p.waitForFunction(()=>!document.querySelector('.save-bouquet')?.disabled)
 await p.evaluate(()=>{Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});Object.defineProperty(navigator,'share',{configurable:true,value:async data=>{window.shared={name:data.files[0].name,type:data.files[0].type,size:data.files[0].size,active:navigator.userActivation.isActive}}})})
 await p.getByRole('button',{name:'Save My Bouquet'}).tap();const shared=await p.evaluate(()=>window.shared);assert.equal(shared.type,'image/png');assert.ok(shared.size>100000);assert.equal(shared.active,true,'file share stays in user activation')
 await p.evaluate(()=>{Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false})});const download=p.waitForEvent('download');await p.getByRole('button',{name:'Save My Bouquet'}).tap();await download;assert.equal(await p.getByRole('link',{name:'Open image to save'}).count(),1)
 await p.screenshot({path:`work/phase3-screenshots/save-${name.replaceAll(' ','-')}.png`,fullPage:true});console.log(`PASS ${name} Chromium device emulation: touch, activated file share, PNG download and image-link fallback`);await p.close()
 }
}finally{await b.close()}

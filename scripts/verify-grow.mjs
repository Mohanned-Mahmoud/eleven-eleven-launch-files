import {chromium} from '@playwright/test'
import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
const out='work/phase2-screenshots';await mkdir(out,{recursive:true});const errors=[];const results=[]
try{
for(const [w,h] of [[320,568],[390,844],[430,932]]){
 const p=await browser.newPage({viewport:{width:w,height:h},reducedMotion:'reduce',hasTouch:true});p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:5173/?scene=grow&clean=1');await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:`${out}/intro-${w}.png`});await p.getByRole('button',{name:"Let's make something beautiful"}).click();await p.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));await p.screenshot({path:`${out}/before-${w}.png`});
 const zone=p.getByRole('button',{name:/Plant a flower in the garden/});const b=await zone.boundingBox();
 const names=['Rose','Tulip','Peony','Ranunculus','Cosmos'];const spots=[[.105,.82],[.30,.89],[.50,.72],[.70,.90],[.895,.82]];
 for(let i=0;i<5;i++){await p.getByRole('button',{name:names[i],exact:true}).click();await p.touchscreen.tap(b.x+b.width*spots[i][0],b.y+b.height*spots[i][1]);}
 await p.screenshot({path:`${out}/after-${w}.png`});
 assert.equal(await p.locator('[data-flower]').count(),5,`five flowers at ${w}`);
 await p.touchscreen.tap(b.x+b.width*.105,b.y+b.height*.82);assert.equal(await p.locator('[data-flower]').count(),5,'collision prevented');
 await p.touchscreen.tap(b.x+b.width*.5,b.y+b.height*.2);assert.equal(await p.locator('[data-flower]').count(),5,'invalid ground prevented');
 await p.getByRole('button',{name:'Undo last flower'}).click();assert.equal(await p.locator('[data-flower]').count(),4);
 await p.getByRole('button',{name:'Clear garden',exact:true}).click();await p.getByRole('button',{name:'Keep them'}).click();assert.equal(await p.locator('[data-flower]').count(),4);
 await p.getByRole('button',{name:'Clear garden',exact:true}).click();await p.getByRole('button',{name:'Clear flowers',exact:true}).click();assert.equal(await p.locator('[data-flower]').count(),0);
 await zone.focus();await p.keyboard.press('Enter');assert.equal(await p.locator('[data-flower]').count(),1);
 const metric=await p.evaluate(()=>({height:innerHeight,scroll:document.documentElement.scrollHeight,width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));assert.ok(metric.scrollWidth<=w);results.push({w,h,...metric});
 await p.setViewportSize({width:430,height:932});assert.equal(await p.locator('[data-flower]').count(),1,'resize retains flowers');
 await p.getByRole('button',{name:'The garden',exact:true}).click();await p.locator('[data-scene="garden"]').waitFor();await p.getByRole('button',{name:'Grow your flowers'}).click();await p.locator('[data-scene="grow"]').waitFor();await p.close();
}
const p=await browser.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:5173/?scene=grow&clean=1');await p.getByRole('button',{name:"Let's make something beautiful"}).click();const zone=p.getByRole('button',{name:/Plant a flower in the garden/});await zone.focus();await p.keyboard.press('Enter');await p.waitForTimeout(900);await p.screenshot({path:`${out}/growth-stem-390.png`});await p.keyboard.press('Enter');await p.keyboard.press('Enter');assert.equal(await p.locator('[data-flower]').count(),2,'bounded concurrent growth');await p.waitForTimeout(2200);await p.screenshot({path:`${out}/growth-bud-390.png`});await p.waitForTimeout(3000);await p.screenshot({path:`${out}/growth-bloom-390.png`});await p.getByRole('button',{name:'Pause motion'}).click();await p.getByRole('button',{name:'Resume motion'}).click();await p.close();assert.deepEqual(errors,[]);await writeFile(`${out}/verification.json`,JSON.stringify({passed:true,results,errors},null,2));console.log('PASS grow touch, collision, safe zone, undo, clear, keyboard, resize, concurrency, reduced motion, navigation.');
}finally{await browser.close()}

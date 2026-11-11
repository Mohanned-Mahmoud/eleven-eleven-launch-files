import {mkdir,rm,writeFile} from 'node:fs/promises'
await rm('dist/handoff',{recursive:true,force:true})
await mkdir('vercel-public',{recursive:true})
// Vercel requires a non-empty output directory. This inert fallback contains no
// application code or private content; all requests still use the gateway.
await writeFile('vercel-public/index.html','<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex"><title>11:11</title><body>The garden is waiting for server verification.</body></html>')

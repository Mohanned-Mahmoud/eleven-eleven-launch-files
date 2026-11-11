import {mkdir,rm} from 'node:fs/promises'
await rm('dist/handoff',{recursive:true,force:true})
await mkdir('vercel-public',{recursive:true})

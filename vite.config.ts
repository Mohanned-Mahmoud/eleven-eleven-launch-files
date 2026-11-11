import {personalization} from './server/personalization'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss(),{name:'local-personalization',configureServer(server){server.middlewares.use('/api/content',(_req,res)=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(personalization))})}}],
  server: { host: '0.0.0.0', port: 5173, strictPort: true },
  preview: { host: '0.0.0.0', port: 4173, strictPort: true },
  build: { target: 'es2022', sourcemap: false },
})

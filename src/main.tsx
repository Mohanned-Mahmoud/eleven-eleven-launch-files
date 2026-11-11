import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/cormorant-garamond'
import '@fontsource-variable/cormorant-garamond/wght-italic.css'
import '@fontsource-variable/dm-sans'
import '@fontsource-variable/caveat'
import './styles/tokens.css'
import './styles/index.css'
import { SceneManager } from './SceneManager'

async function bootstrap() {
  const response=await fetch('/api/content',{cache:'no-store'})
  if(!response.ok){document.getElementById('root')!.textContent='Verifying the garden opening time. Please refresh to reconnect.';return}
  const personal=await response.json()
  const preview = import.meta.env.DEV ? (await import('./dev/preview')).readPreview() : undefined
  ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><SceneManager preview={preview} personal={personal} serverUnlocked={!import.meta.env.DEV} /></React.StrictMode>)
}
void bootstrap()

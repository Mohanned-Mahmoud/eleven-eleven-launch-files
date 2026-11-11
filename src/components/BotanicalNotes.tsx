import { useEffect, useRef } from 'react'
import { X, ArrowUpRight } from 'lucide-react'
import { assets } from '../config/assets'
import { Eyebrow } from './Typography'
import { Sprig } from './Ornament'
export function BotanicalNotes({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close() }, [open])
  return <dialog ref={dialog} className="botanical-dialog" onCancel={onClose} onClose={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }} aria-labelledby="notes-title">
    <div className="botanical-dialog-inner"><button className="dialog-close icon-button" aria-label="Close botanical notes" onClick={onClose}><X size={20} strokeWidth={1.3} /></button><Sprig /><Eyebrow>A note from the garden</Eyebrow><h2 id="notes-title">Beautiful things,<br /><em>from the real world.</em></h2><p>Real roses. Real light. A little borrowed beauty, with gratitude to the people who captured it.</p><div className="photo-credits">{Object.entries(assets).map(([key, asset]) => <a href={asset.source} target="_blank" rel="noopener noreferrer" key={key}><span>{asset.photographer}<small>Photography · Unsplash</small></span><ArrowUpRight size={15} /></a>)}</div><p className="credit-license">Photographs used under the <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash License</a>.</p></div>
  </dialog>
}

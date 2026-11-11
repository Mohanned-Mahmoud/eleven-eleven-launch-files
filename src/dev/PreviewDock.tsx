import { sceneIds } from '../config/experience'
import type { SceneId } from '../config/experience'
const labels = { countdown: 'The wait', opening: 'The wish', garden: 'The garden', grow: 'Grow flowers', bouquet: 'Bouquet', invitation:'Invitation', eleven:'Eleven', play:'Play', memories:'Memories', wish:'Wish', letter:'Letter' }
export default function PreviewDock({ scene, onSelect, frozen }: { scene: SceneId; onSelect: (scene: SceneId) => void; frozen?: number }) {
  return <nav className="preview-dock" aria-label="Development scene preview"><span className="preview-label">Studio preview{frozen !== undefined ? ' · Clock held' : ''}</span><div>{sceneIds.map((id, index) => <button key={id} aria-current={scene === id ? 'page' : undefined} onClick={() => onSelect(id)}><span>0{index + 1}</span>{labels[id]}</button>)}</div></nav>
}

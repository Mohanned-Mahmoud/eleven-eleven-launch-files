import { sceneIds } from '../config/experience'
import type { SceneId } from '../config/experience'
/** This entire module is dynamically imported ONLY in DEV and absent from dist. */
export function readPreview() {
  const params = new URLSearchParams(window.location.search)
  const candidate = params.get('scene')
  const scene = sceneIds.includes(candidate as SceneId) ? candidate as SceneId : undefined
  const value = params.get('at')
  const parsed = value ? Date.parse(value) : NaN
  return { scene, frozen: Number.isFinite(parsed) ? parsed : undefined, clean: params.get('clean') === '1' }
}
export type PreviewSettings = ReturnType<typeof readPreview>

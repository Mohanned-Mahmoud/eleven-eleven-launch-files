/** @jsxRuntime automatic */
import { assets } from '../config/assets.js'
export function FloralBackdrop({ variant }: { variant: 'countdown' | 'opening' }) {
  return <div className={`floral-stage floral-stage--${variant}`} aria-hidden="true">
    <div className="floral-ambient" />
    <div className="floral-photo floral-photo--left" data-drift>
      <picture><source media="(max-width: 600px)" srcSet={assets.gardenRose.mobile} /><img src={assets.gardenRose.src} width={1400} height={2096} alt="" fetchPriority="high" data-photo /></picture>
    </div>
    <div className="floral-photo floral-photo--right" data-drift>
      <picture><source media="(max-width: 600px)" srcSet={assets.roses.mobile} /><img src={assets.roses.src} width={1600} height={2000} alt="" fetchPriority="high" data-photo /></picture>
    </div>
    <div className="floral-shade" />
    <div className="invitation-frame"><span className="frame-star">✦</span></div>
  </div>
}

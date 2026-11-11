import { useEffect, useState } from 'react'
/** Re-read wall time rather than decrementing a counter, including after tab sleep. */
export function useClock(frozen?: number) {
  const [now, setNow] = useState(() => frozen ?? Date.now())
  useEffect(() => {
    if (frozen !== undefined) { setNow(frozen); return }
    const update = () => setNow(Date.now())
    update()
    const timer = window.setInterval(update, 250)
    document.addEventListener('visibilitychange', update)
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', update) }
  }, [frozen])
  return frozen ?? now
}

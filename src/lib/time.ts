export type Remaining = { days: number; hours: number; minutes: number; seconds: number; total: number }
export function remainingUntil(target: string, now = Date.now()): Remaining {
  const targetTime = Date.parse(target)
  if (!Number.isFinite(targetTime) || !Number.isFinite(now)) throw new Error('A valid release time and clock are required.')
  const total = Math.max(0, Math.ceil((targetTime - now) / 1000))
  return { total, days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24, minutes: Math.floor(total / 60) % 60, seconds: total % 60 }
}
export const pad = (value: number) => String(value).padStart(2, '0')

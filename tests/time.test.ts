import test from 'node:test'
import assert from 'node:assert/strict'
import { remainingUntil } from '../src/lib/time.ts'
import { experience } from '../src/config/experience.ts'
const target = experience.unlockAt
const epoch = Date.parse(target)
test('clock breaks duration into exact days, hours, minutes and seconds', () => {
  assert.deepEqual(remainingUntil(target, epoch - (86400 + 2 * 3600 + 3 * 60 + 4) * 1000), { total: 93784, days: 1, hours: 2, minutes: 3, seconds: 4 })
})
test('never unlocks in the final fractional second', () => {
  assert.equal(remainingUntil(target, epoch - 1).total, 1)
  assert.equal(remainingUntil(target, epoch).total, 0)
  assert.equal(remainingUntil(target, epoch + 1000).total, 0)
})
test('UTC release corresponds to the requested Cairo date and 23:11 local time', () => {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: experience.timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date(target))
  const part = (type: string) => parts.find(p => p.type === type)?.value
  assert.deepEqual(['year','month','day','hour','minute'].map(part), ['2026','11','11','23','11'])
})
test('invalid dates fail clearly rather than showing NaN', () => {
  assert.throws(() => remainingUntil('invalid', epoch))
})

/** @jsxRuntime automatic */
import { experience } from '../config/experience'
import { remainingUntil, pad } from '../lib/time'
import { FloralBackdrop } from '../components/FloralBackdrop'
import { SceneLayout } from '../components/SceneLayout'
import { Eyebrow, Heading } from '../components/Typography'
import { Sprig } from '../components/Ornament'

export function CountdownScene({ now }: { now: number }) {
  const time = remainingUntil(experience.unlockAt, now)
  const units = [['days', time.days], ['hours', time.hours], ['minutes', time.minutes], ['seconds', time.seconds]] as const
  return <SceneLayout className="countdown-scene">
    <FloralBackdrop variant="countdown" />
    <div className="invitation-content countdown-content">
      <Sprig className="intro-sprig" />
      <Eyebrow data-reveal>{experience.countdown.eyebrow}</Eyebrow>
      <Heading id="scene-title" data-reveal>{experience.countdown.title[0]}<br /><em>{experience.countdown.title[1]}</em></Heading>
      <p className="scene-subtitle" data-reveal>{experience.countdown.subtitle}</p>
      <div className="countdown" role="timer" aria-label={`${time.days} days, ${time.hours} hours, ${time.minutes} minutes, ${time.seconds} seconds remaining`} data-reveal>
        {units.map(([label, value]) => <div className="countdown-unit" key={label}><span className="countdown-value" aria-hidden="true">{pad(value)}</span><span className="countdown-label" aria-hidden="true">{label}</span></div>)}
      </div>
      <div className="occasion" data-reveal><span className="occasion-rule" /><p>{experience.dateLabel}</p><p className="occasion-time">{experience.timeLabel}</p></div>
    </div>
    <p className="scene-side-note" aria-hidden="true">Something beautiful is on its way</p>
  </SceneLayout>
}

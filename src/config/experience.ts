/** All narrative, release timing and spatial interaction anchors live here. */
export const experience = {
  title: '11:11 — A Garden Made for You',
  unlockAt: '2026-11-11T21:11:00Z',
  timeZone: 'Africa/Cairo',
  dateLabel: 'November 11, 2026',
  timeLabel: '11:11 PM — Cairo Time',
  countdown: {
    eyebrow: 'A little longer. A little closer.',
    title: ['Good things', 'take time.'],
    subtitle: "And this one's just for you.",
  },
  opening: {
    eyebrow: 'Some moments are made for magic',
    title: '11:11',
    wish: "They say it's the perfect time to make a wish.",
    promise: 'But tonight, I have something else in mind.',
    action: 'Enter my little universe',
  },
  garden: {
    eyebrow: 'Welcome to your little universe',
    title: ['A garden', 'made for you.'],
    subtitle: 'A quiet place for something beautiful to begin.',
    invitation: 'Take a moment. Stay a little.',
    points: [
      { id: 'rose', label: 'A little rose', x: 73, y: 65, title: 'Every lovely thing starts small.', body: 'A rose, a moment, a little thought of you. This is where our garden begins.', botanical: 'Rosa · The rose garden' },
      { id: 'path', label: 'The quiet path', x: 43, y: 70, title: 'There is no hurry here.', body: 'A path between the roses. A little room to breathe. For this moment, the world can wait.', botanical: 'A place to pause' },
    ],
  },
} as const

export const sceneIds = ['countdown', 'opening', 'invitation', 'eleven', 'play', 'memories', 'garden', 'grow', 'bouquet', 'wish', 'letter'] as const
export type SceneId = typeof sceneIds[number]
export type GardenPoint = typeof experience.garden.points[number]

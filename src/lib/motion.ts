import gsap from 'gsap'
export const motion = { enter: 1.3, exit: 0.55, stagger: 0.12, ease: 'power2.out' } as const

/** Call inside a GSAP context; all tweens then share the scene's cleanup. */
export function revealScene(root: HTMLElement, still: boolean) {
  if (still) return
  gsap.fromTo(root.querySelectorAll('[data-reveal]'), { autoAlpha: 0, y: 13 }, {
    autoAlpha: 1, y: 0, duration: motion.enter, stagger: motion.stagger, ease: motion.ease, clearProps: 'transform,opacity,visibility',
  })
  gsap.fromTo(root.querySelectorAll('[data-photo]'), { scale: 1.035 }, { scale: 1, duration: 3.2, ease: 'power2.out', clearProps: 'transform' })
  gsap.to(root.querySelectorAll('[data-drift]'), { y: -7, rotation: 0.3, duration: 12, ease: 'sine.inOut', repeat: -1, yoyo: true })
}

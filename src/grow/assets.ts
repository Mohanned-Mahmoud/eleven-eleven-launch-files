/** Generated photographic studies, NOT commissioned/licensed botanical photography.
 * See docs/PHASE2.md for provenance and the outstanding professional asset brief.
 */
export const growAssets = {
  status: 'generated-art-direction-study',
  heads: ['rose','tulip','peony','ranunculus','cosmos'].map(id=>({id,head:`/images/grow/${id}-head.webp`,bud:`/images/grow/${id}-bud.webp`,petal:`/images/grow/${id}-petal.webp`})),
  leaves: ['rose','tulip','peony','cosmos'].map(id=>`/images/grow/${id}-leaf.webp`),
  earth:'/images/grow/earth.webp',
  provenance:'Created using the image generation tool for this project; locally cropped and WebP encoded. No third-party photography attribution claimed.',
} as const

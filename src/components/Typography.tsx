/** @jsxRuntime automatic */
import type { ComponentPropsWithoutRef } from 'react'
export function Eyebrow({ className = '', ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={`eyebrow ${className}`} {...props} />
}
export function Heading({ className = '', ...props }: ComponentPropsWithoutRef<'h1'>) {
  return <h1 tabIndex={-1} className={`scene-heading ${className}`} {...props} />
}
export function Handwritten({ className = '', ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={`handwritten ${className}`} {...props} />
}

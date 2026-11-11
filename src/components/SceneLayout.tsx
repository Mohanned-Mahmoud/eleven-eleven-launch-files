/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
export function SceneLayout({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`scene ${className}`} aria-labelledby="scene-title">{children}</section>
}

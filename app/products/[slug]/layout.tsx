import type { ReactNode } from 'react'
export { generateMetadata } from './seo'

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}



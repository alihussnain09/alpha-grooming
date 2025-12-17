import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Shop Products | Alpha Grooming',
  description: "Browse Alpha Grooming's premium men's grooming products including beard oils, face care and hair care.",
  alternates: { canonical: 'https://www.alphagrooming.com/products' },
}

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}



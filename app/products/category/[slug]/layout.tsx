import type { Metadata } from 'next'
import type { ReactNode } from 'react'

function slugToReadable(slug: string): string {
  if (!slug) return ''
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = slugToReadable(slug)
  const title = `${category} | Alpha Grooming`
  const description = `Shop ${category.toLowerCase()} products at Alpha Grooming. Premium men's grooming for beard, face, hair, and more.`
  const url = `https://www.alphagrooming.com/products/category/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: '/og-image.svg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.svg'],
    },
  }
}

export default function CategoryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}



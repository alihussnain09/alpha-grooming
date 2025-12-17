import type { Metadata } from 'next'
import { connectDB } from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    await connectDB()
    const product = await Product.findOne({ slug }).lean()
    if (!product) {
      return {
        title: 'Product not found',
        robots: { index: false, follow: false },
      }
    }

    const title = `${product.name} – Buy Online | Alpha Grooming`
    const description = product.description?.slice(0, 155) || 'Premium men\'s grooming product at Alpha Grooming.'
    const url = `https://www.alphagrooming.com/products/${slug}`
    const image = product.image || '/og-image.svg'

    return {
      alternates: { canonical: url },
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        type: 'website',
        images: [{ url: image }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    }
  } catch {
    return {}
  }
}



"use client"

import { useEffect, useMemo, useState } from "react"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"
import { useParams } from "next/navigation"
import { StructuredData } from "@/components/structured-data"
import { generateBreadcrumbSchema } from "@/lib/structured-data"

function slugToCategory(slug: string): string {
  if (!slug) return ""
  const words = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  return words.join(" ")
}

export default function ProductsByCategoryPage() {
  const params = useParams()
  const slug = String((params as any).slug || "")
  const category = useMemo(() => slugToCategory(slug), [slug])

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => (p.category || "").toLowerCase() === category.toLowerCase())
  }, [products, category])

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={generateBreadcrumbSchema([
        { name: 'Home', url: 'https://www.alphagrooming.com' },
        { name: 'Products', url: 'https://www.alphagrooming.com/products' },
        { name: category || 'Category', url: `https://www.alphagrooming.com/products/category/${slug}` },
      ])} />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">{category || 'Category'}</h1>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product: any, index: number) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                priority={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



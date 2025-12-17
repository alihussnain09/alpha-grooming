"use client"

import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { Star, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    const productId = ((product as any)._id || product.id)?.toString()
    if (productId) {
      addToCart(productId, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-48 bg-muted overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform"
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : undefined}
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg hover:text-primary transition line-clamp-2">{product.name}</h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>

        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-primary">PKR {product.price.toFixed(2)}</span>
          <Button size="sm" onClick={handleAddToCart} variant={added ? "default" : "outline"} className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            {added ? "Added" : "Add"}
          </Button>
        </div>

        {product.stock < 5 && product.stock > 0 && (
          <p className="text-xs text-destructive mt-2">Only {product.stock} left!</p>
        )}
        {product.stock === 0 && <p className="text-xs text-destructive mt-2">Out of stock</p>}
      </div>
    </Card>
  )
}

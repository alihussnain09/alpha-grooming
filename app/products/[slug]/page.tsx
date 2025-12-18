"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/types"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { Star, ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { StructuredData } from "@/components/structured-data"
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/structured-data"

interface Review {
  _id: string
  customerName: string
  customerEmail: string
  rating: number
  comment: string
  verified: boolean
  createdAt: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const productSlug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  
  // Review states
  const [reviews, setReviews] = useState<Review[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    customerName: "",
    customerEmail: "",
    rating: 5,
    comment: "",
  })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/products")
        if (response.ok) {
          const products = await response.json()
          const foundProduct = products.find((p: any) => p.slug === productSlug)
          setProduct(foundProduct || null)
          
          // Fetch reviews if product found
          if (foundProduct && foundProduct._id) {
            fetchReviews(foundProduct._id)
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productSlug])

  const fetchReviews = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setSubmittingReview(true)
    try {
      const productId = (product as any)._id
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      })

      if (response.ok) {
        alert("Review submitted successfully!")
        setReviewForm({
          customerName: "",
          customerEmail: "",
          rating: 5,
          comment: "",
        })
        setShowReviewForm(false)
        // Refresh reviews
        fetchReviews(productId)
        // Refresh product to update rating
        window.location.reload()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Error submitting review")
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      const productId = (product as any)._id || product.id
      addToCart(productId, quantity)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={generateProductSchema(product)} />
      <StructuredData 
        data={generateBreadcrumbSchema([
          { name: 'Home', url: 'https://www.alphagrooming.com' },
          { name: 'Products', url: 'https://www.alphagrooming.com/products' },
          { name: product.name, url: `https://www.alphagrooming.com/products/${product.slug}` }
        ])} 
      />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
              fetchPriority="high"
              loading="eager"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div 
              className="text-lg text-muted-foreground mb-6 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">PKR {product.price.toFixed(2)}</span>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-sm text-green-600">In Stock ({product.stock} available)</p>
              ) : (
                <p className="text-sm text-destructive">Out of Stock</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                variant={added ? "default" : "default"}
                className="flex-1 gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? "Added to Cart" : "Add to Cart"}
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Product Details */}
            <div className="border-t border-border pt-6">
              <h3 className="font-bold mb-4">Product Details</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong>Category:</strong> {product.category}
                </li>
                <li>
                  <strong>SKU:</strong> {((product as any)._id || product.id || "").toString().substring(0, 8).toUpperCase()}
                </li>
                <li>
                  <strong>Availability:</strong> {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Customer Reviews ({reviews.length})</h2>
            <Button onClick={() => setShowReviewForm(!showReviewForm)}>
              {showReviewForm ? "Cancel" : "Write a Review"}
            </Button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Write Your Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={reviewForm.customerName}
                    onChange={(e) => setReviewForm({ ...reviewForm, customerName: e.target.value })}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={reviewForm.customerEmail}
                    onChange={(e) => setReviewForm({ ...reviewForm, customerEmail: e.target.value })}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= reviewForm.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder="Share your experience with this product..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  required
                />
                <Button type="submit" disabled={submittingReview}>
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-muted rounded-lg">
                <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{review.customerName}</h4>
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-3">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/types"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { Card } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"
import { StructuredData } from "@/components/structured-data"
import { generateBreadcrumbSchema } from "@/lib/structured-data"
import { useRouter } from "next/navigation"
import { generateSlug } from "@/lib/utils"

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState("featured")
  const [loading, setLoading] = useState(true)

  const categories = ["Beard Care", "Face Care", "Hair Care"]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })
        if (response.ok) {
          const data = await response.json()
          console.log("Fetched products:", data.length)
          setProducts(data)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, priceRange, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={generateBreadcrumbSchema([
        { name: 'Home', url: 'https://www.alphagrooming.com' },
        { name: 'Products', url: 'https://www.alphagrooming.com/products' },
      ])} />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Category</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === "" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat)
                        const slug = generateSlug(cat)
                        router.push(`/products/category/${slug}`)
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedCategory === cat ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span>PKR {priceRange[0]}</span>
                    <span>PKR {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">Showing {filteredProducts.length} products</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product: any, index: number) => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                      priority={index === 0}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

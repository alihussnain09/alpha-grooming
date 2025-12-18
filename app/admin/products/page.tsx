"use client"

import { useEffect } from "react"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Trash2, Plus, ArrowLeft, Edit } from "lucide-react"

interface Product {
  _id?: string
  id?: string
  name: string
  slug?: string
  description: string
  metaTitle?: string
  metaDescription?: string
  price: number
  category: string
  stock: number
  image: string
  rating: number
  reviews: number
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    metaTitle: "",
    metaDescription: "",    metaKeywords: "",    price: "",
    category: "Beard Care",
    stock: "",
    image: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [generatingSEO, setGeneratingSEO] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("admin-token")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      fetchProducts()
    }
  }, [router])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }
  const handleGenerateSEO = async () => {
    if (!formData.name || !formData.description) {
      alert("Please enter product name and description first")
      return
    }

    setGeneratingSEO(true)
    try {
      const response = await fetch("/api/generate-seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: formData.name,
          productDescription: formData.description,
        }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        console.error("API Error:", result)
        throw new Error(result.error || "Failed to generate SEO content")
      }

      console.log("Generated SEO:", result)
      
      setFormData((prev) => ({
        ...prev,
        metaTitle: result.metaTitle || prev.metaTitle,
        metaDescription: result.metaDescription || prev.metaDescription,
        metaKeywords: result.metaKeywords || prev.metaKeywords,
      }))

      alert("SEO content generated successfully!")
    } catch (error: any) {
      console.error("Error generating SEO:", error)
      alert(`Failed to generate SEO: ${error.message || 'Please try again.'}`)
    } finally {
      setGeneratingSEO(false)
    }
  }
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageData = formData.image || "/placeholder.svg"

      // If user uploaded a file, convert to base64
      if (imageFile) {
        imageData = await convertImageToBase64(imageFile)
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          price: Number.parseFloat(formData.price),
          category: formData.category,
          stock: Number.parseInt(formData.stock),
          image: imageData,
        }),
      })

      if (response.ok) {
        const newProduct = await response.json()
        console.log("Product added:", newProduct)
        
        // Refresh products list
        await fetchProducts()
        
        // Reset form
        setFormData({
          name: "",
          description: "",
          metaTitle: "",
          metaDescription: "",
          price: "",
          category: "Beard Care",
          stock: "",
          image: "",
        })
        setImageFile(null)
        setImagePreview("")
        setShowForm(false)
        alert("Product added successfully!")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to add product")
      }
    } catch (error) {
      console.error("Error adding product:", error)
      alert("Error adding product")
    } finally {
      setUploading(false)
    }
  }

  const handleEditProduct = (product: Product) => {
    console.log("Editing product:", product)
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      metaTitle: product.metaTitle || "",
      metaDescription: product.metaDescription || "",
      metaKeywords: product.metaKeywords || "",
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image,
    })
    setImagePreview(product.image)
    setShowForm(false) // Close add form
    setShowEditForm(true) // Open edit form
    setImageFile(null) // Clear any previous image file
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    setUploading(true)

    try {
      let imageData = formData.image

      // If user uploaded a new file, convert to base64
      if (imageFile) {
        imageData = await convertImageToBase64(imageFile)
      }

      const productId = editingProduct._id || editingProduct.id
      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          price: Number.parseFloat(formData.price),
          category: formData.category,
          stock: Number.parseInt(formData.stock),
          image: imageData,
        }),
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        console.log("Product updated:", updatedProduct)
        
        // Refresh the products list
        await fetchProducts()
        
        // Reset form
        setFormData({
          name: "",
          description: "",
          metaTitle: "",
          metaDescription: "",
          price: "",
          category: "Beard Care",
          stock: "",
          image: "",
        })
        setImageFile(null)
        setImagePreview("")
        setShowEditForm(false)
        setEditingProduct(null)
        alert("Product updated successfully!")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update product")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Error updating product")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    console.log("Deleting product with ID:", productId)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      })

      console.log("Delete response status:", response.status)

      if (response.ok) {
        setProducts(products.filter((p) => (p._id || p.id) !== productId))
        alert("Product deleted successfully!")
        // Refresh products list
        fetchProducts()
      } else {
        const data = await response.json()
        console.error("Delete error:", data)
        alert(data.error || "Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error deleting product")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin")} className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Product Management</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm)
              setShowEditForm(false)
              setEditingProduct(null)
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Beard Care</option>
                  <option>Face Care</option>
                  <option>Hair Care</option>
                </select>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  step="0.01"
                  required
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Product Description</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                  placeholder="Enter product description with rich formatting..."
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">SEO Metadata</label>
                  <Button
                    type="button"
                    onClick={handleGenerateSEO}
                    disabled={generatingSEO || !formData.name || !formData.description}
                    className="text-sm"
                  >
                    {generatingSEO ? "Generating..." : "✨ Auto-Generate SEO"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Title</label>
                    <input
                      type="text"
                      name="metaTitle"
                      placeholder="Enter meta title for SEO"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      maxLength={60}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.metaTitle.length}/60 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Description</label>
                    <textarea
                      name="metaDescription"
                      placeholder="Enter meta description for SEO"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      maxLength={160}
                      rows={3}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.metaDescription.length}/160 characters
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Meta Keywords</label>
                  <input
                    type="text"
                    name="metaKeywords"
                    placeholder="Enter keywords separated by commas (e.g., beard oil, grooming, men's care)"
                    value={formData.metaKeywords}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate keywords with commas
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Product Image</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Upload from device (recommended)</p>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="image"
                      placeholder="Or paste image URL"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Alternative: Paste URL</p>
                  </div>
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Uploading..." : "Add Product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Edit Product Form */}
        {showEditForm && editingProduct && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Beard Care</option>
                  <option>Face Care</option>
                  <option>Hair Care</option>
                </select>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  step="0.01"
                  required
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Product Description</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                  placeholder="Enter product description with rich formatting..."
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">SEO Metadata</label>
                  <Button
                    type="button"
                    onClick={handleGenerateSEO}
                    disabled={generatingSEO || !formData.name || !formData.description}
                    className="text-sm"
                  >
                    {generatingSEO ? "Generating..." : "✨ Auto-Generate SEO"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Title</label>
                    <input
                      type="text"
                      name="metaTitle"
                      placeholder="Enter meta title for SEO"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      maxLength={60}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.metaTitle.length}/60 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Description</label>
                    <textarea
                      name="metaDescription"
                      placeholder="Enter meta description for SEO"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      maxLength={160}
                      rows={3}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.metaDescription.length}/160 characters
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Meta Keywords</label>
                  <input
                    type="text"
                    name="metaKeywords"
                    placeholder="Enter keywords separated by commas (e.g., beard oil, grooming, men's care)"
                    value={formData.metaKeywords}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate keywords with commas
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Product Image</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Upload new image (optional)</p>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="image"
                      placeholder="Or paste image URL"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Alternative: Paste URL</p>
                  </div>
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Updating..." : "Update Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditForm(false)
                    setEditingProduct(null)
                    setImageFile(null)
                    setImagePreview("")
                    setFormData({
                      name: "",
                      description: "",
                      price: "",
                      category: "Beard Care",
                      stock: "",
                      image: "",
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Products Table */}
        <Card className="overflow-hidden">
          {products.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">No products found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id || product.id} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="px-6 py-4 text-sm">{product.name}</td>
                      <td className="px-6 py-4 text-sm">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-semibold">PKR {product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">{product.stock}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                            className="gap-2 bg-transparent"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProduct(product._id || product.id || "")}
                            className="gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}


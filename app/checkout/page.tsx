"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/types"
import { useCart } from "@/hooks/use-cart"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  })

  useEffect(() => {
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
        setProductsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const cartItems = useMemo(() => {
    return cart.map((item) => ({
      ...item,
      product: products.find((p: any) => {
        const productId = p._id?.toString() || p.id?.toString()
        return productId === item.productId
      }),
    }))
  }, [cart, products])

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity
  }, 0)

  const tax = subtotal * 0.1
  const shipping = subtotal > 10000 ? 0 : 300
  const total = subtotal + tax + shipping

  const validateCardNumber = (value: string) => {
    // Remove spaces and dashes
    const cleaned = value.replace(/[\s-]/g, "")
    // Check if it contains only digits
    if (!/^\d*$/.test(cleaned)) return false
    // Check length (13-19 digits for most cards)
    if (cleaned.length > 19) return false
    return true
  }

  const validateCardExpiry = (value: string) => {
    // Remove non-digits except slash
    const cleaned = value.replace(/[^\d/]/g, "")
    // Check format MM/YY
    if (!/^\d{0,2}\/?\d{0,2}$/.test(cleaned)) return false
    if (cleaned.length > 5) return false
    return true
  }

  const validateCVC = (value: string) => {
    // Only digits, max 4 characters
    if (!/^\d*$/.test(value)) return false
    if (value.length > 4) return false
    return true
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let isValid = true
    let newValue = value
    const newErrors = { ...errors }

    // Validate card fields
    if (name === "cardNumber") {
      const cleaned = value.replace(/[\s-]/g, "")
      if (!validateCardNumber(value)) {
        newErrors.cardNumber = "Invalid card number. Only digits allowed (max 19)."
        isValid = false
      } else {
        delete newErrors.cardNumber
        // Format card number with spaces every 4 digits
        newValue = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ")
      }
    } else if (name === "cardExpiry") {
      if (!validateCardExpiry(value)) {
        newErrors.cardExpiry = "Invalid expiry. Use MM/YY format."
        isValid = false
      } else {
        delete newErrors.cardExpiry
        // Auto-format MM/YY
        const cleaned = value.replace(/\D/g, "")
        if (cleaned.length >= 2) {
          newValue = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4)
        } else {
          newValue = cleaned
        }
      }
    } else if (name === "cardCVC") {
      if (!validateCVC(value)) {
        newErrors.cardCVC = "Invalid CVC. Only 3-4 digits allowed."
        isValid = false
      } else {
        delete newErrors.cardCVC
      }
    }

    setErrors(newErrors)
    if (isValid || name === "cardExpiry" || name === "cardNumber") {
      setFormData((prev) => ({ ...prev, [name]: newValue }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate card details before submission
    const newErrors: Record<string, string> = {}
    const cardNumberClean = formData.cardNumber.replace(/\s/g, "")
    
    if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
      newErrors.cardNumber = "Card number must be 13-19 digits"
    }
    if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = "Invalid expiry format. Use MM/YY"
    } else {
      const [month, year] = formData.cardExpiry.split("/")
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.cardExpiry = "Invalid month"
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.cardExpiry = "Card has expired"
      }
    }
    if (formData.cardCVC.length < 3 || formData.cardCVC.length > 4) {
      newErrors.cardCVC = "CVC must be 3-4 digits"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      // Prepare order data
      const orderData = {
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        paymentInfo: {
          cardNumber: cardNumberClean,
          cardExpiry: formData.cardExpiry,
          cardCVC: formData.cardCVC,
        },
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product?.price || 0,
          name: item.product?.name || "",
        })),
        subtotal,
        tax,
        shipping,
        total,
      }

      // Save order to database
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        clearCart()
        router.push("/order-confirmation")
      } else {
        const errorData = await response.json()
        alert(errorData.error || "Failed to place order. Please try again.")
        setLoading(false)
      }
    } catch (error) {
      console.error("Error placing order:", error)
      alert("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="col-span-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="col-span-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="col-span-2 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="col-span-2 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="col-span-2 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="col-span-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="col-span-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="col-span-2 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </Card>

              {/* Payment Information */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number (e.g., 1234 5678 9012 3456)"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.cardNumber ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary"
                      }`}
                      required
                      maxLength={23}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 w-full ${
                          errors.cardExpiry ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary"
                        }`}
                        required
                        maxLength={5}
                      />
                      {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="cardCVC"
                        placeholder="CVC"
                        value={formData.cardCVC}
                        onChange={handleInputChange}
                        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 w-full ${
                          errors.cardCVC ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary"
                        }`}
                        required
                        maxLength={4}
                      />
                      {errors.cardCVC && <p className="text-red-500 text-xs mt-1">{errors.cardCVC}</p>}
                    </div>
                  </div>
                </div>
              </Card>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-2 mb-6 text-sm">
                <p className="text-muted-foreground">{cart.length} items in cart</p>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>PKR {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>PKR {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `PKR ${shipping.toFixed(2)}`}</span>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">PKR {total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export interface Product {
  _id?: string
  id?: string
  name: string
  slug: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  rating: number
  reviews: number
  createdAt?: Date
  updatedAt?: Date
}

export interface CartItem {
  productId: string
  quantity: number
  product?: Product
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  createdAt: Date
}

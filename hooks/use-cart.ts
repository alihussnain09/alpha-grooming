"use client"

import { useState, useEffect } from "react"
import type { CartItem } from "@/lib/types"

const CART_KEY = "alpha-grooming-cart"

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY)
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    setLoading(false)
  }, [])

  const saveCart = (items: CartItem[]) => {
    setCart(items)
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }

  const addToCart = (productId: string, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === productId)
      let newCart
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        newCart = [...prevCart, { productId, quantity }]
      }
      saveCart(newCart)
      return newCart
    })
  }

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.productId !== productId)
    saveCart(newCart)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      const newCart = cart.map((item) => (item.productId === productId ? { ...item, quantity } : item))
      saveCart(newCart)
    }
  }

  const clearCart = () => {
    saveCart([])
  }

  return { cart, loading, addToCart, removeFromCart, updateQuantity, clearCart }
}

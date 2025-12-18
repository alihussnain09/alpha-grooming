"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { CartItem } from "@/lib/types"

const CART_KEY = "alpha-grooming-cart"

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY)
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch {
        setCart([])
      }
    }
    setLoading(false)
  }, [])

  const saveCart = useCallback((items: CartItem[]) => {
    setCart(items)
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [])

  const addToCart = useCallback((productId: string, quantity = 1) => {
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
      localStorage.setItem(CART_KEY, JSON.stringify(newCart))
      return newCart
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.productId !== productId)
      localStorage.setItem(CART_KEY, JSON.stringify(newCart))
      return newCart
    })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prevCart) => {
        const newCart = prevCart.filter((item) => item.productId !== productId)
        localStorage.setItem(CART_KEY, JSON.stringify(newCart))
        return newCart
      })
    } else {
      setCart((prevCart) => {
        const newCart = prevCart.map((item) => 
          item.productId === productId ? { ...item, quantity } : item
        )
        localStorage.setItem(CART_KEY, JSON.stringify(newCart))
        return newCart
      })
    }
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    localStorage.setItem(CART_KEY, JSON.stringify([]))
  }, [])

  return useMemo(() => ({ 
    cart, 
    loading, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  }), [cart, loading, addToCart, removeFromCart, updateQuantity, clearCart])
}

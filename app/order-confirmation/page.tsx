"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { clearCart } = useCart()
  const hasCleared = useRef(false)

  useEffect(() => {
    if (sessionId && !hasCleared.current) {
      // Clear cart after successful payment
      clearCart()
      hasCleared.current = true
      setLoading(false)
    } else if (!sessionId) {
      setError("No payment session found")
      setLoading(false)
    }
  }, [sessionId, clearCart])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8 text-center">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold mb-2">Processing your order...</h1>
          <p className="text-muted-foreground">Please wait while we confirm your payment</p>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-2 text-red-600">Payment Error</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Link href="/checkout">
            <Button>Return to Checkout</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Card className="p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-2">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        {sessionId && (
          <p className="text-xs text-muted-foreground mb-8">
            Session ID: {sessionId.slice(0, 20)}...
          </p>
        )}

        <div className="bg-muted p-6 rounded-lg mb-8 text-left">
          <h2 className="font-bold mb-4">What's Next?</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ You'll receive an order confirmation email shortly</li>
            <li>✓ Your order will be processed within 24 hours</li>
            <li>✓ You'll receive a tracking number once shipped</li>
            <li>✓ Estimated delivery: 5-7 business days</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Card className="p-8 text-center">
        <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
        <h1 className="text-2xl font-bold mb-2">Loading...</h1>
      </Card>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <OrderConfirmationContent />
      </Suspense>
    </div>
  )
}

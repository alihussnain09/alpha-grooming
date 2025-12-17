"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>

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
    </div>
  )
}

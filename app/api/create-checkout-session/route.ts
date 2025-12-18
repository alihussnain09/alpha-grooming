import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

export async function POST(request: NextRequest) {
  try {
    console.log("=== Stripe Checkout Session Creation ===")
    
    const { items, customerInfo } = await request.json()
    
    console.log("Items:", items.length)
    console.log("Customer:", customerInfo.email)

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      )
    }

    // Create line items for Stripe (without images to avoid URL validation issues)
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "pkr",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Add shipping if applicable
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    if (subtotal <= 10000) {
      lineItems.push({
        price_data: {
          currency: "pkr",
          product_data: {
            name: "Shipping Fee",
          },
          unit_amount: 30000, // PKR 300 in cents
        },
        quantity: 1,
      })
    }

    const origin = request.headers.get("origin") || "http://localhost:3000"
    console.log("Origin:", origin)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
      customer_email: customerInfo.email,
      metadata: {
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zipCode: customerInfo.zipCode,
      },
    })

    console.log("Session created:", session.id)
    console.log("Checkout URL:", session.url)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Stripe checkout error:", error.message)
    console.error("Full error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    )
  }
}

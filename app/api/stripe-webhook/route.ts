import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { connectDB } from "@/lib/mongodb"
import Order from "@/lib/models/Order"
import Product from "@/lib/models/Product"

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe configuration missing" },
      { status: 500 }
    )
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  })

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      await connectDB()

      // Get line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

      // Prepare order items
      const items = lineItems.data
        .filter((item) => item.description !== "Shipping Fee")
        .map((item) => ({
          productId: item.price?.product as string,
          name: item.description || "",
          quantity: item.quantity || 1,
          price: (item.amount_total || 0) / 100,
        }))

      // Create order in database
      const order = await Order.create({
        customerName: session.metadata?.customerName || "",
        customerEmail: session.customer_email || "",
        customerPhone: session.metadata?.phone || "",
        shippingAddress: {
          address: session.metadata?.address || "",
          city: session.metadata?.city || "",
          state: session.metadata?.state || "",
          zipCode: session.metadata?.zipCode || "",
        },
        items,
        totalAmount: (session.amount_total || 0) / 100,
        paymentStatus: "paid",
        paymentMethod: "stripe",
        stripeSessionId: session.id,
        status: "pending",
      })

      // Update product stock
      for (const item of items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        })
      }

      console.log("Order created successfully:", order._id)
    } catch (error) {
      console.error("Error processing webhook:", error)
      return NextResponse.json(
        { error: "Failed to process order" },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}

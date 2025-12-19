import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import mongoose from "mongoose"
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

      // Calculate amounts
      const subtotal = (session.amount_subtotal || 0) / 100
      const total = (session.amount_total || 0) / 100
      const shipping = subtotal >= 2000 ? 0 : 200 // Free shipping over PKR 2000
      const tax = subtotal * 0.05 // 5% tax

      // Prepare order items - use product name instead of ID since Stripe IDs don't match MongoDB
      const items = lineItems.data
        .filter((item) => item.description !== "Shipping Fee")
        .map((item) => {
          // Find matching product in DB by name
          return {
            name: item.description || "",
            quantity: item.quantity || 1,
            price: (item.amount_total || 0) / 100 / (item.quantity || 1), // Unit price
          }
        })

      // Get product IDs from MongoDB by matching names
      const productNames = items.map(item => item.name)
      const dbProducts = await Product.find({ name: { $in: productNames } })
      
      // Map items with actual MongoDB product IDs
      const orderItems = items.map(item => {
        const dbProduct = dbProducts.find(p => p.name === item.name)
        return {
          productId: dbProduct?._id || new mongoose.Types.ObjectId(), // Use found ID or create new one
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }
      })

      // Parse customer name
      const fullName = session.metadata?.customerName || ""
      const nameParts = fullName.split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""

      // Create order in database
      const order = await Order.create({
        customerInfo: {
          firstName,
          lastName,
          email: session.customer_email || "",
          phone: session.metadata?.phone || "",
          address: session.metadata?.address || "",
          city: session.metadata?.city || "",
          state: session.metadata?.state || "",
          zipCode: session.metadata?.zipCode || "",
        },
        items: orderItems,
        subtotal,
        tax,
        shipping,
        total,
        paymentStatus: "paid",
        paymentMethod: "stripe",
        stripeSessionId: session.id,
        status: "pending",
      })

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

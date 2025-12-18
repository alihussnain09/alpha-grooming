import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Order from "@/lib/models/Order"
import Product from "@/lib/models/Product"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    if (!token?.startsWith("admin-token-")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const orders = await Order.find({})
      .select("total status createdAt items customerInfo paymentInfo")
      .sort({ createdAt: -1 })
      .populate({ path: "items.productId", select: "name price image slug" })
      .lean()

    return NextResponse.json(orders, {
      headers: {
        "Cache-Control": "private, no-store",
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()

    // Validate order data
    if (!body.customerInfo || !body.items || body.items.length === 0) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 })
    }

    // Validate payment info
    if (!body.paymentInfo || !body.paymentInfo.cardNumber || !body.paymentInfo.cardExpiry || !body.paymentInfo.cardCVC) {
      return NextResponse.json({ error: "Payment information is required" }, { status: 400 })
    }

    // First, validate all products and stock availability
    const stockChecks = []
    for (const item of body.items) {
      if (!item.productId) {
        return NextResponse.json({ error: "Invalid product ID in order" }, { status: 400 })
      }
      
      const product = await Product.findById(item.productId)
      
      if (!product) {
        return NextResponse.json({ error: `Product "${item.name}" not found` }, { status: 404 })
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${item.name}". Only ${product.stock} available.` },
          { status: 400 }
        )
      }
      
      stockChecks.push({ product, quantity: item.quantity })
    }

    // If all validations pass, deduct stock
    for (const { product, quantity } of stockChecks) {
      product.stock -= quantity
      await product.save()
    }

    // Create the order
    let newOrder
    try {
      newOrder = await Order.create({
        customerInfo: body.customerInfo,
        paymentInfo: body.paymentInfo,
        items: body.items,
        subtotal: body.subtotal,
        tax: body.tax,
        shipping: body.shipping,
        total: body.total,
        status: "pending",
      })
    } catch (orderError) {
      // Rollback stock if order creation fails
      console.error("Order creation failed, rolling back stock:", orderError)
      for (const { product, quantity } of stockChecks) {
        product.stock += quantity
        await product.save()
      }
      throw orderError
    }

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


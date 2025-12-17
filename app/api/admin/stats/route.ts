import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Product from "@/lib/models/Product"
import Order from "@/lib/models/Order"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    if (!token?.startsWith("admin-token-")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const [totalProducts, totalOrders, orders] = await Promise.all([
      Product.countDocuments().lean(),
      Order.countDocuments().lean(),
      Order.find({}).select("total customerInfo.email").lean(),
    ])

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Count unique customers (by email)
    const uniqueCustomers = new Set(orders.map((order) => order.customerInfo.email)).size

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCustomers: uniqueCustomers,
    }, {
      headers: {
        "Cache-Control": "private, no-store",
      },
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}


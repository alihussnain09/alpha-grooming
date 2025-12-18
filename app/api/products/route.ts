import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Product from "@/lib/models/Product"
import { generateSlug } from "@/lib/utils"
import { DUMMY_PRODUCTS } from "@/lib/dummy-data"

export async function GET(request: NextRequest) {
  try {
    // Try to connect to database, fall back to dummy data if not available
    try {
      await connectDB()
      const { searchParams } = new URL(request.url)
      const limitParam = Number(searchParams.get("limit") || "0")
      const fieldsParam = searchParams.get("fields") || "name slug description price category stock image rating reviews createdAt"

      const query = Product.find({})
        .select(fieldsParam)
        .sort({ createdAt: -1 })
        .lean()

      if (limitParam && Number.isFinite(limitParam) && limitParam > 0) {
        query.limit(limitParam)
      }

      const products = await query

      return NextResponse.json(products, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      })
    } catch (dbError) {
      // Database not available, use dummy data
      console.log("Database not connected, using dummy data")
      const { searchParams } = new URL(request.url)
      const limitParam = Number(searchParams.get("limit") || "0")
      
      let products = [...DUMMY_PRODUCTS]
      
      if (limitParam && Number.isFinite(limitParam) && limitParam > 0) {
        products = products.slice(0, limitParam)
      }

      return NextResponse.json(products, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      })
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    if (!token?.startsWith("admin-token-")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()

    // Generate slug from name
    const slug = generateSlug(body.name)

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug })
    if (existingProduct) {
      return NextResponse.json({ error: "Product with this name already exists" }, { status: 400 })
    }

    const newProduct = await Product.create({
      name: body.name,
      slug,
      description: body.description,
      price: body.price,
      category: body.category,
      stock: body.stock,
      image: body.image || "/placeholder.svg",
      rating: 5,
      reviews: 0,
    })

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

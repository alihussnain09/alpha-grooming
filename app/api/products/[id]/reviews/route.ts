import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Product from "@/lib/models/Product"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()

    const { customerName, customerEmail, rating, comment } = body

    if (!customerName || !customerEmail || !rating || !comment) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const product = await Product.findById(id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if user already reviewed
    const existingReview = product.reviewsData?.find(
      (review: any) => review.customerEmail === customerEmail
    )

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 })
    }

    // Add review
    product.reviewsData = product.reviewsData || []
    product.reviewsData.push({
      customerName,
      customerEmail,
      rating,
      comment,
      verified: false,
    })

    await product.save() // This will trigger the pre-save hook to update rating

    return NextResponse.json({ success: true, message: "Review added successfully", product })
  } catch (error) {
    console.error("Error adding review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const product = await Product.findById(id).select("reviewsData").lean()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product.reviewsData || [], {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


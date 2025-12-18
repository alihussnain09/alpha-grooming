import mongoose, { Schema, models } from "mongoose"

const ReviewSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false, // Set to true if customer actually bought the product
    },
  },
  {
    timestamps: true,
  }
)

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    metaKeywords: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Beard Care", "Face Care", "Hair Care"],
    },
    image: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    reviewsData: [ReviewSchema], // Array of actual reviews
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Middleware to automatically update rating and review count
ProductSchema.pre('save', function(next) {
  if (this.reviewsData && this.reviewsData.length > 0) {
    const totalRating = this.reviewsData.reduce((sum: number, review: any) => sum + review.rating, 0)
    this.rating = totalRating / this.reviewsData.length
    this.reviews = this.reviewsData.length
  }
  next()
})

const Product = models.Product || mongoose.model("Product", ProductSchema)

export default Product


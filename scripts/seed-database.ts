import mongoose from "mongoose"
import * as dotenv from "dotenv"
import * as path from "path"

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const MONGODB_URI = process.env.MONGODB_URI || ""

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  rating: Number,
  reviews: Number,
}, { timestamps: true })

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema)

const products = [
  {
    name: "Premium Beard Oil",
    slug: "premium-beard-oil",
    description: "Nourishing beard oil with argan and jojoba oils. Softens beard and promotes healthy growth.",
    price: 29.99,
    category: "Beard Care",
    image: "/premium-beard-oil.jpg",
    stock: 45,
    rating: 4.8,
    reviews: 128,
  },
  {
    name: "Beard Growth Serum",
    slug: "beard-growth-serum",
    description: "Advanced formula to stimulate beard growth and thickness. Results visible in 4-6 weeks.",
    price: 39.99,
    category: "Beard Care",
    image: "/beard-growth-serum.jpg",
    stock: 32,
    rating: 4.6,
    reviews: 95,
  },
  {
    name: "Charcoal Face Wash",
    slug: "charcoal-face-wash",
    description: "Deep cleansing face wash with activated charcoal. Removes impurities and excess oil.",
    price: 19.99,
    category: "Face Care",
    image: "/charcoal-face-wash.jpg",
    stock: 60,
    rating: 4.7,
    reviews: 156,
  },
  {
    name: "Moisturizing Face Cream",
    slug: "moisturizing-face-cream",
    description: "Lightweight moisturizer for men. Hydrates without feeling greasy. SPF 30 protection.",
    price: 24.99,
    category: "Face Care",
    image: "/moisturizing-face-cream.jpg",
    stock: 50,
    rating: 4.5,
    reviews: 112,
  },
  {
    name: "Hair Growth Oil",
    slug: "hair-growth-oil",
    description: "Stimulates hair growth and reduces hair fall. Enriched with natural herbs and oils.",
    price: 34.99,
    category: "Hair Care",
    image: "/hair-growth-oil.jpg",
    stock: 38,
    rating: 4.7,
    reviews: 142,
  },
  {
    name: "Premium Hair Wax",
    slug: "premium-hair-wax",
    description: "Strong hold hair wax with matte finish. Perfect for styling and all-day hold.",
    price: 22.99,
    category: "Hair Care",
    image: "/premium-hair-wax.jpg",
    stock: 55,
    rating: 4.6,
    reviews: 118,
  },
  {
    name: "Beard Balm",
    slug: "beard-balm",
    description: "Conditioning beard balm with beeswax. Shapes and softens your beard naturally.",
    price: 26.99,
    category: "Beard Care",
    image: "/premium-beard-oil.jpg",
    stock: 42,
    rating: 4.8,
    reviews: 134,
  },
  {
    name: "Anti-Dandruff Shampoo",
    slug: "anti-dandruff-shampoo",
    description: "Medicated shampoo to eliminate dandruff and scalp irritation. Gentle on hair.",
    price: 18.99,
    category: "Hair Care",
    image: "/charcoal-face-wash.jpg",
    stock: 70,
    rating: 4.5,
    reviews: 98,
  },
]

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing products
    await Product.deleteMany({})
    console.log("Cleared existing products")

    // Insert new products
    await Product.insertMany(products)
    console.log(`Seeded ${products.length} products successfully`)

    await mongoose.connection.close()
    console.log("Database connection closed")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()


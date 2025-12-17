import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const products = [
  {
    name: "Premium Beard Oil",
    description: "Nourishing beard oil with natural ingredients for a healthy, shiny beard",
    price: 24.99,
    category: "Beard Care",
    image: "/premium-beard-oil.jpg",
    stock: 50,
    rating: 4.8,
    reviews: 124,
  },
  {
    name: "Beard Growth Serum",
    description: "Advanced formula to promote beard growth and thickness",
    price: 34.99,
    category: "Beard Care",
    image: "/beard-growth-serum.jpg",
    stock: 35,
    rating: 4.6,
    reviews: 89,
  },
  {
    name: "Charcoal Face Wash",
    description: "Deep cleansing face wash with activated charcoal",
    price: 16.99,
    category: "Face Care",
    image: "/charcoal-face-wash.jpg",
    stock: 60,
    rating: 4.7,
    reviews: 156,
  },
  {
    name: "Moisturizing Face Cream",
    description: "Lightweight moisturizer for all skin types",
    price: 28.99,
    category: "Face Care",
    image: "/moisturizing-face-cream.jpg",
    stock: 45,
    rating: 4.5,
    reviews: 102,
  },
  {
    name: "Hair Growth Oil",
    description: "Stimulating oil blend to promote hair growth and reduce hair fall",
    price: 22.99,
    category: "Hair Care",
    image: "/hair-growth-oil.jpg",
    stock: 55,
    rating: 4.7,
    reviews: 134,
  },
  {
    name: "Premium Hair Wax",
    description: "Strong hold hair wax for styling and shaping",
    price: 19.99,
    category: "Hair Care",
    image: "/premium-hair-wax.jpg",
    stock: 70,
    rating: 4.6,
    reviews: 98,
  },
  {
    name: "Beard Shampoo",
    description: "Gentle shampoo specifically formulated for beards",
    price: 14.99,
    category: "Beard Care",
    image: "/beard-shampoo.jpg",
    stock: 80,
    rating: 4.8,
    reviews: 167,
  },
  {
    name: "Anti-Aging Serum",
    description: "Powerful anti-aging serum with vitamin C and retinol",
    price: 39.99,
    category: "Face Care",
    image: "/anti-aging-serum.png",
    stock: 30,
    rating: 4.9,
    reviews: 145,
  },
]

async function seedProducts() {
  try {
    console.log("[v0] Starting to seed products...")
    const productsRef = collection(db, "products")

    for (const product of products) {
      await addDoc(productsRef, {
        ...product,
        createdAt: serverTimestamp(),
      })
      console.log(`[v0] Added product: ${product.name}`)
    }

    console.log("[v0] Successfully seeded all products!")
  } catch (error) {
    console.error("[v0] Error seeding products:", error)
  }
}

seedProducts()

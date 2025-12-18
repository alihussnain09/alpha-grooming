import type { Product } from "./types"

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Beard Oil",
    slug: "premium-beard-oil",
    description: "Nourishing beard oil with argan and jojoba oils. Softens beard and promotes healthy growth.",
    price: 1299,
    category: "Beard Care",
    image: "/premium-beard-oil.jpg",
    stock: 45,
    rating: 4.8,
    reviews: 128,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Beard Growth Serum",
    slug: "beard-growth-serum",
    description: "Advanced formula to stimulate beard growth and thickness. Results visible in 4-6 weeks.",
    price: 1499,
    category: "Beard Care",
    image: "/beard-growth-serum.jpg",
    stock: 32,
    rating: 4.6,
    reviews: 95,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Charcoal Face Wash",
    slug: "charcoal-face-wash",
    description: "Deep cleansing face wash with activated charcoal. Removes impurities and excess oil.",
    price: 749,
    category: "Face Care",
    image: "/charcoal-face-wash.jpg",
    stock: 60,
    rating: 4.7,
    reviews: 156,
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Moisturizing Face Cream",
    slug: "moisturizing-face-cream",
    description: "Lightweight moisturizer for men. Hydrates without feeling greasy. SPF 30 protection.",
    price: 999,
    category: "Face Care",
    image: "/moisturizing-face-cream.jpg",
    stock: 50,
    rating: 4.5,
    reviews: 112,
    createdAt: new Date(),
  },
  {
    id: "5",
    name: "Hair Growth Oil",
    slug: "hair-growth-oil",
    description: "Stimulates hair growth and reduces hair fall. Enriched with natural herbs and oils.",
    price: 1199,
    category: "Hair Care",
    image: "/hair-growth-oil.jpg",
    stock: 38,
    rating: 4.7,
    reviews: 142,
    createdAt: new Date(),
  },
  {
    id: "6",
    name: "Premium Hair Wax",
    slug: "premium-hair-wax",
    description: "Strong hold hair wax with matte finish. Perfect for styling and all-day hold.",
    price: 649,
    category: "Hair Care",
    image: "/premium-hair-wax.jpg",
    stock: 55,
    rating: 4.6,
    reviews: 118,
    createdAt: new Date(),
  },
  {
    id: "7",
    name: "Beard Balm",
    slug: "beard-balm",
    description: "Conditioning beard balm with beeswax. Shapes and softens your beard naturally.",
    price: 899,
    category: "Beard Care",
    image: "/premium-beard-oil.jpg",
    stock: 42,
    rating: 4.8,
    reviews: 134,
    createdAt: new Date(),
  },
  {
    id: "8",
    name: "Anti-Dandruff Shampoo",
    slug: "anti-dandruff-shampoo",
    description: "Medicated shampoo to eliminate dandruff and scalp irritation. Gentle on hair.",
    price: 599,
    category: "Hair Care",
    image: "/charcoal-face-wash.jpg",
    stock: 70,
    rating: 4.5,
    reviews: 98,
    createdAt: new Date(),
  },
]

export const DUMMY_GUIDES = [
  {
    id: "1",
    title: "The Complete Beard Care Guide",
    category: "Beard Care",
    excerpt: "Learn how to grow, maintain, and style the perfect beard.",
    content: `
      # The Complete Beard Care Guide

      Growing and maintaining a healthy beard requires dedication and the right products. Here's everything you need to know.

      ## Getting Started
      - Let your beard grow for at least 4-6 weeks without trimming
      - Wash with beard-specific shampoo 2-3 times per week
      - Use beard oil daily to keep it soft and healthy

      ## Maintenance Tips
      1. Trim every 4-6 weeks to maintain shape
      2. Brush your beard daily to train the hair
      3. Use beard balm for styling and conditioning
      4. Keep your skin underneath clean and moisturized

      ## Common Mistakes to Avoid
      - Using regular shampoo (too harsh for beards)
      - Not conditioning regularly
      - Trimming too frequently
      - Ignoring the skin underneath

      ## Product Recommendations
      - Premium Beard Oil for daily conditioning
      - Beard Growth Serum for faster growth
      - Beard Balm for styling and hold
    `,
    readTime: "8 min read",
    author: "Alpha Grooming Team",
    image: "/premium-beard-oil.jpg",
  },
  {
    id: "2",
    title: "Face Care Routine for Men",
    category: "Face Care",
    excerpt: "Develop a simple yet effective daily face care routine.",
    content: `
      # Face Care Routine for Men

      A proper face care routine doesn't have to be complicated. Follow these simple steps for healthy, clear skin.

      ## Morning Routine
      1. Wash with Charcoal Face Wash
      2. Apply Moisturizing Face Cream with SPF
      3. You're ready for the day!

      ## Evening Routine
      1. Wash with Charcoal Face Wash
      2. Apply Moisturizing Face Cream
      3. Let it absorb before bed

      ## Weekly Treatment
      - Use a face mask once a week for deep cleansing
      - Exfoliate gently to remove dead skin

      ## Tips for Best Results
      - Use lukewarm water, not hot
      - Pat dry gently, don't rub
      - Apply moisturizer to damp skin
      - Be consistent with your routine
    `,
    readTime: "5 min read",
    author: "Alpha Grooming Team",
    image: "/charcoal-face-wash.jpg",
  },
  {
    id: "3",
    title: "Hair Growth Tips & Tricks",
    category: "Hair Care",
    excerpt: "Discover proven methods to promote healthy hair growth.",
    content: `
      # Hair Growth Tips & Tricks

      Want thicker, healthier hair? These proven tips will help you achieve your hair goals.

      ## Nutrition Matters
      - Eat protein-rich foods
      - Include biotin-rich foods (eggs, nuts, seeds)
      - Stay hydrated
      - Take hair vitamins if needed

      ## Hair Care Practices
      1. Use Hair Growth Oil regularly
      2. Massage your scalp daily (5 minutes)
      3. Avoid excessive heat styling
      4. Get regular trims to prevent split ends
      5. Use Anti-Dandruff Shampoo for scalp health

      ## Lifestyle Changes
      - Get 7-9 hours of sleep
      - Exercise regularly
      - Manage stress
      - Avoid smoking

      ## Timeline
      - Weeks 1-4: Scalp health improves
      - Weeks 4-8: New growth appears
      - Weeks 8-12: Noticeable thickness increase
      - Months 3-6: Significant growth visible
    `,
    readTime: "7 min read",
    author: "Alpha Grooming Team",
    image: "/hair-growth-oil.jpg",
  },
  {
    id: "4",
    title: "Styling Your Hair with Wax",
    category: "Hair Care",
    excerpt: "Master the art of hair styling with premium hair wax.",
    content: `
      # Styling Your Hair with Wax

      Hair wax is a versatile styling product. Learn how to use it for the perfect look.

      ## Choosing the Right Wax
      - Matte finish for natural look
      - Shiny finish for polished appearance
      - Strong hold for all-day styling

      ## Application Steps
      1. Start with damp hair
      2. Warm the wax between your fingers
      3. Apply from roots to tips
      4. Style as desired
      5. Let it dry for 5 minutes

      ## Styling Ideas
      - Textured crop
      - Slicked back
      - Messy quiff
      - Side part

      ## Maintenance
      - Wash out completely at night
      - Use shampoo to remove all residue
      - Don't sleep with wax in your hair
    `,
    readTime: "6 min read",
    author: "Alpha Grooming Team",
    image: "/premium-hair-wax.jpg",
  },
]

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StructuredData } from "@/components/structured-data"
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/structured-data"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={generateOrganizationSchema()} />
      <StructuredData data={generateWebsiteSchema()} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-primary/10 to-primary/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Premium Men's Grooming</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Elevate your grooming routine with Alpha Grooming's premium collection of beard oils, face washes, and
              hair care products.
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      

      {/* Featured Categories */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Beard Care", icon: "🧔", slug: "beard-care" },
              { name: "Face Care", icon: "✨", slug: "face-care" },
              { name: "Hair Care", icon: "💇", slug: "hair-care" },
            ].map((category) => (
              <Link key={category.name} href={`/products/category/${category.slug}`}>
                <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg mb-8 opacity-90">Get grooming tips, product recommendations, and exclusive offers</p>
          <Link href="/guides">
            <Button variant="secondary" size="lg">
              Read Grooming Guides
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Alpha Grooming</h4>
              <p className="text-sm text-muted-foreground">Premium grooming products for the modern man.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/products" className="hover:text-foreground">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products/category/beard-care" className="hover:text-foreground">
                    Beard Care
                  </Link>
                </li>
                <li>
                  <Link href="/products/category/face-care" className="hover:text-foreground">
                    Face Care
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/guides" className="hover:text-foreground">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Alpha Grooming. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

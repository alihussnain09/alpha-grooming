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
      <section className="relative min-h-[500px] bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-20">
          <div className="flex-1">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              🇵🇰 Made in Pakistan
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
              Premium Men's <br />
              <span className="text-primary">Grooming Products</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Elevate your grooming routine with Alpha Grooming's premium collection of beard oils, face washes, and
              hair care products. Quality you can trust.
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2 text-lg px-10 py-6">
                Shop Now
              </Button>
            </Link>
            <div className="flex items-center gap-8 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>Free Shipping over PKR 2000</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>100% Natural Ingredients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Featured Categories */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Explore our carefully curated collections designed specifically for the modern man</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Beard Care", icon: "🧔", slug: "beard-care", desc: "Oils, balms & serums" },
              { name: "Face Care", icon: "✨", slug: "face-care", desc: "Wash, cream & more" },
              { name: "Hair Care", icon: "💇", slug: "hair-care", desc: "Oils, wax & shampoo" },
            ].map((category) => (
              <Link key={category.name} href={`/products/category/${category.slug}`}>
                <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: "🚚", title: "Free Shipping", desc: "Orders over PKR 2000" },
              { icon: "💯", title: "100% Natural", desc: "Premium ingredients" },
              { icon: "🔒", title: "Secure Payment", desc: "Stripe protected" },
              { icon: "📞", title: "24/7 Support", desc: "Always here to help" },
            ].map((feature, i) => (
              <div key={i} className="p-6">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Get grooming tips, product recommendations, and exclusive offers. Be the first to know about new arrivals!</p>
          <Link href="/guides">
            <Button variant="secondary" size="lg" className="px-8">
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

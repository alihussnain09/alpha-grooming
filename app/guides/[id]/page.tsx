"use client"

import type React from "react"

import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Clock, User, ArrowLeft } from "lucide-react"

interface GuideContent {
  id: string
  title: string
  category: string
  author: string
  readTime: number
  date: string
  image: string
  content: string
}

export default function GuidePage() {
  const params = useParams()
  const guideId = params.id as string

  // Sample guide content
  const guides: Record<string, GuideContent> = {
    "1": {
      id: "1",
      title: "The Complete Beard Growth Guide",
      category: "Beard Care",
      author: "John Smith",
      readTime: 8,
      date: "2025-01-15",
      image: "/placeholder.svg?key=guide1",
      content: `
        <h2>Understanding Beard Growth</h2>
        <p>Beard growth is a natural process that varies from person to person. On average, beards grow about half an inch per month, but this can vary based on genetics, age, and overall health.</p>
        
        <h2>Factors That Affect Beard Growth</h2>
        <ul>
          <li><strong>Genetics:</strong> Your genes play the biggest role in beard growth rate and thickness</li>
          <li><strong>Age:</strong> Beard growth typically peaks in your 20s and 30s</li>
          <li><strong>Nutrition:</strong> A diet rich in proteins and vitamins supports healthy beard growth</li>
          <li><strong>Sleep:</strong> Quality sleep helps regulate hormones that affect beard growth</li>
          <li><strong>Stress:</strong> High stress levels can slow down beard growth</li>
        </ul>
        
        <h2>Tips for Maximizing Beard Growth</h2>
        <p>To get the most out of your beard growth potential, follow these tips:</p>
        <ul>
          <li>Keep your beard clean with a quality beard shampoo</li>
          <li>Use beard oil to nourish and moisturize</li>
          <li>Trim regularly to remove split ends</li>
          <li>Maintain a healthy diet with plenty of protein</li>
          <li>Get adequate sleep and manage stress</li>
          <li>Exercise regularly to boost circulation</li>
        </ul>
        
        <h2>Patience is Key</h2>
        <p>Growing a full, healthy beard takes time. Most experts recommend giving your beard at least 3-6 months to reach its full potential. During this time, resist the urge to trim too much and focus on maintaining good grooming habits.</p>
      `,
    },
    "2": {
      id: "2",
      title: "Beard Oil vs Beard Balm: Which One Should You Use?",
      category: "Beard Care",
      author: "Mike Johnson",
      readTime: 6,
      date: "2025-01-10",
      image: "/placeholder.svg?key=guide2",
      content: `
        <h2>Understanding Beard Oil</h2>
        <p>Beard oil is a liquid product designed to moisturize and condition your beard. It typically contains carrier oils like jojoba or argan oil mixed with essential oils for fragrance.</p>
        
        <h2>Understanding Beard Balm</h2>
        <p>Beard balm is a thicker, wax-based product that provides both conditioning and styling hold. It's ideal for shaping and controlling your beard throughout the day.</p>
        
        <h2>When to Use Beard Oil</h2>
        <ul>
          <li>For daily moisturizing and conditioning</li>
          <li>When you want a softer, more natural look</li>
          <li>For shorter beards that don't need much styling</li>
          <li>To reduce itchiness and beard dandruff</li>
        </ul>
        
        <h2>When to Use Beard Balm</h2>
        <ul>
          <li>When you need styling and hold</li>
          <li>For longer beards that need shaping</li>
          <li>When you want a more polished appearance</li>
          <li>For special occasions or professional settings</li>
        </ul>
        
        <h2>The Best Approach</h2>
        <p>Many beard enthusiasts use both products. Apply beard oil in the morning for conditioning, and use beard balm in the evening for styling and hold. This combination gives you the best of both worlds.</p>
      `,
    },
    "3": {
      id: "3",
      title: "Skincare Routine for Men: A Beginner's Guide",
      category: "Face Care",
      author: "Dr. Sarah Lee",
      readTime: 10,
      date: "2025-01-08",
      image: "/placeholder.svg?key=guide3",
      content: `
        <h2>Why Skincare Matters</h2>
        <p>Taking care of your skin is essential for maintaining a healthy, youthful appearance. A good skincare routine can prevent acne, reduce wrinkles, and improve overall skin health.</p>
        
        <h2>The Basic Skincare Routine</h2>
        <p>A simple skincare routine consists of three main steps:</p>
        
        <h3>1. Cleanse</h3>
        <p>Use a gentle facial cleanser twice daily to remove dirt, oil, and impurities. Choose a cleanser suited to your skin type.</p>
        
        <h3>2. Moisturize</h3>
        <p>Apply a moisturizer to keep your skin hydrated. This is crucial even for oily skin types.</p>
        
        <h3>3. Protect</h3>
        <p>Use a sunscreen with at least SPF 30 during the day to protect your skin from UV damage.</p>
        
        <h2>Additional Steps for Advanced Care</h2>
        <ul>
          <li><strong>Exfoliate:</strong> Use a gentle exfoliant 2-3 times per week to remove dead skin cells</li>
          <li><strong>Treat:</strong> Use targeted treatments for specific concerns like acne or aging</li>
          <li><strong>Eye Care:</strong> Apply an eye cream to address fine lines and dark circles</li>
        </ul>
        
        <h2>Consistency is Key</h2>
        <p>The most important aspect of any skincare routine is consistency. Stick with your routine for at least 4-6 weeks to see results.</p>
      `,
    },
    "4": {
      id: "4",
      title: "Hair Loss Prevention: Tips and Treatments",
      category: "Hair Care",
      author: "Dr. Robert Brown",
      readTime: 12,
      date: "2025-01-05",
      image: "/placeholder.svg?key=guide4",
      content: `
        <h2>Understanding Hair Loss</h2>
        <p>Hair loss is a common concern for many men. While some hair loss is normal, excessive hair loss can indicate an underlying issue that needs attention.</p>
        
        <h2>Common Causes of Hair Loss</h2>
        <ul>
          <li>Genetics (male pattern baldness)</li>
          <li>Hormonal changes</li>
          <li>Nutritional deficiencies</li>
          <li>Stress and anxiety</li>
          <li>Poor scalp health</li>
          <li>Certain medications</li>
        </ul>
        
        <h2>Prevention Tips</h2>
        <ul>
          <li>Maintain a healthy diet rich in vitamins and minerals</li>
          <li>Manage stress through exercise and meditation</li>
          <li>Use a gentle shampoo and avoid harsh treatments</li>
          <li>Massage your scalp regularly to improve circulation</li>
          <li>Avoid tight hairstyles that pull on hair</li>
          <li>Get adequate sleep and stay hydrated</li>
        </ul>
        
        <h2>Treatment Options</h2>
        <p>If you're experiencing significant hair loss, consider consulting a dermatologist about treatment options such as minoxidil or finasteride.</p>
      `,
    },
    "5": {
      id: "5",
      title: "Grooming Tips for Different Face Shapes",
      category: "General Tips",
      author: "Alex Turner",
      readTime: 7,
      date: "2025-01-01",
      image: "/placeholder.svg?key=guide5",
      content: `
        <h2>Why Face Shape Matters</h2>
        <p>Your face shape plays a crucial role in determining which beard styles and haircuts will look best on you. Understanding your face shape can help you make better grooming decisions.</p>
        
        <h2>Face Shapes and Beard Styles</h2>
        
        <h3>Round Face</h3>
        <p>For round faces, longer beards with angular lines work best. Try a Van Dyke or a full beard with sharp edges to add definition.</p>
        
        <h3>Square Face</h3>
        <p>Square faces benefit from softer beard styles. A full, rounded beard or a goatee can complement your features well.</p>
        
        <h3>Oval Face</h3>
        <p>Oval faces are versatile and can pull off most beard styles. Experiment with different styles to find what you like best.</p>
        
        <h3>Rectangular Face</h3>
        <p>For rectangular faces, fuller beards with width help balance your features. Avoid thin, long beards.</p>
        
        <h2>General Grooming Tips</h2>
        <ul>
          <li>Keep your beard clean and well-maintained</li>
          <li>Use quality grooming products</li>
          <li>Get regular trims to maintain your style</li>
          <li>Experiment to find what works for you</li>
        </ul>
      `,
    },
    "6": {
      id: "6",
      title: "Winter Beard Care: Keeping Your Beard Healthy",
      category: "Beard Care",
      author: "John Smith",
      readTime: 5,
      date: "2024-12-28",
      image: "/placeholder.svg?key=guide6",
      content: `
        <h2>Winter Beard Challenges</h2>
        <p>Winter weather can be harsh on your beard. Cold temperatures, dry air, and wind can cause itchiness, dryness, and beard dandruff.</p>
        
        <h2>Winter Beard Care Tips</h2>
        <ul>
          <li><strong>Moisturize More:</strong> Use beard oil daily to combat dryness</li>
          <li><strong>Use a Beard Balm:</strong> Provides extra protection and conditioning</li>
          <li><strong>Wash Less Frequently:</strong> Reduce washing to 2-3 times per week</li>
          <li><strong>Use Warm Water:</strong> Avoid hot water which can dry out your beard</li>
          <li><strong>Protect from Wind:</strong> Wear a scarf or balaclava to shield your beard</li>
          <li><strong>Stay Hydrated:</strong> Drink plenty of water to keep your skin and beard healthy</li>
        </ul>
        
        <h2>Winter Grooming Products</h2>
        <p>Consider using heavier beard oils and balms during winter. Look for products with ingredients like shea butter and coconut oil for extra nourishment.</p>
      `,
    },
  }

  const guide = guides[guideId]

  if (!guide) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Guide not found</h1>
            <Link href="/guides">
              <Button>Back to Guides</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/guides" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Guides
        </Link>

        <article>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded">
                {guide.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-4">{guide.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {guide.author}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {guide.readTime} min read
              </div>
              <div>{new Date(guide.date).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 bg-muted rounded-lg overflow-hidden mb-8">
            <img src={guide.image || "/placeholder.svg"} alt={guide.title} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <Card className="p-8 prose prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: guide.content }}
              className="space-y-6 text-foreground"
              style={
                {
                  "--tw-prose-body": "var(--foreground)",
                  "--tw-prose-headings": "var(--foreground)",
                  "--tw-prose-links": "var(--primary)",
                } as React.CSSProperties
              }
            />
          </Card>

          {/* Related Guides CTA */}
          <div className="mt-12 p-8 bg-primary/10 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Explore More Guides</h2>
            <p className="text-muted-foreground mb-6">Discover more grooming tips and expert advice</p>
            <Link href="/guides">
              <Button>View All Guides</Button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}

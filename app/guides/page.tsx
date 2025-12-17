"use client"

import { useState } from "react"
import { DUMMY_GUIDES } from "@/lib/dummy-data"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Clock, User } from "lucide-react"

interface Guide {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  readTime: number
  date: string
  image: string
}

export default function GuidesPage() {
  const [selectedCategory, setSelectedCategory] = useState("")

  const categories = ["Beard Care", "Face Care", "Hair Care", "General Tips"]

  const filteredGuides = selectedCategory ? DUMMY_GUIDES.filter((g) => g.category === selectedCategory) : DUMMY_GUIDES

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Grooming Guides & Tips</h1>
          <p className="text-lg text-muted-foreground">
            Expert advice and tips to help you master your grooming routine
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 rounded-lg transition ${
              selectedCategory === ""
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-foreground"
            }`}
          >
            All Guides
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">No guides found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer">
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <img
                      src={guide.image || "/placeholder.svg"}
                      alt={guide.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                        {guide.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-primary transition">{guide.title}</h3>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{guide.excerpt}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {guide.readTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {guide.author}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

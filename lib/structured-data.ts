export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Alpha Grooming',
  url: 'https://www.alphagrooming.com',
  logo: 'https://www.alphagrooming.com/logo.png',
  description: 'Premium men\'s grooming products including beard care, face care, and hair care solutions.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'PK',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    availableLanguage: ['English', 'Urdu'],
  },
})

export const generateWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Alpha Grooming',
  url: 'https://www.alphagrooming.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.alphagrooming.com/products?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
})

export const generateProductSchema = (product: {
  name: string
  description: string
  image: string
  price: number
  rating: number
  reviews: number
  stock: number
  slug: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'PKR',
    availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    url: `https://www.alphagrooming.com/products/${product.slug}`,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: product.rating,
    reviewCount: product.reviews,
    bestRating: 5,
    worstRating: 1,
  },
})

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})



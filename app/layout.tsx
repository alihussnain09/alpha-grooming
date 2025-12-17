import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.alphagrooming.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-PK': '/',
    },
  },
  title: {
    default: 'Alpha Grooming - Premium Men\'s Grooming Products',
    template: '%s | Alpha Grooming'
  },
  description: 'Alpha Grooming - Your destination for premium men\'s grooming products including beard care, face care, and hair care solutions. Shop quality grooming essentials for the modern man.',
  keywords: ['mens grooming', 'beard care', 'face care', 'hair care', 'grooming products', 'mens skincare', 'beard oil', 'face wash', 'shampoo', 'Pakistan grooming'],
  authors: [{ name: 'Alpha Grooming' }],
  creator: 'Alpha Grooming',
  publisher: 'Alpha Grooming',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://www.alphagrooming.com',
    title: 'Alpha Grooming - Premium Men\'s Grooming Products',
    description: 'Your destination for premium men\'s grooming products including beard care, face care, and hair care solutions.',
    siteName: 'Alpha Grooming',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Alpha Grooming - Premium Men\'s Grooming Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alpha Grooming - Premium Men\'s Grooming Products',
    description: 'Your destination for premium men\'s grooming products including beard care, face care, and hair care solutions.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when you get them
    // google: 'your-google-verification-code',
    // bing: 'your-bing-verification-code',
  },
  icons: {
    icon: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://vitals.vercel-insights.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

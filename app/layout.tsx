import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wayward Coins – Hypixel SkyBlock Coin Packages',
  description:
    'Buy Hypixel SkyBlock coin packages with instant delivery and competitive pricing. Standard (1–5B), Premium (10–50B), and custom amounts.',
  applicationName: 'Wayward Coins',
  generator: 'Next.js',
  openGraph: {
    title: 'Wayward Coins – Hypixel SkyBlock Coin Packages',
    description:
      'Buy Hypixel SkyBlock coin packages with instant delivery and competitive pricing. Standard (1–5B), Premium (10–50B), and custom amounts.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wayward Coins – Hypixel SkyBlock Coin Packages',
    description:
      'Buy Hypixel SkyBlock coin packages with instant delivery and competitive pricing. Standard (1–5B), Premium (10–50B), and custom amounts.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.className} antialiased`}>{children}</body>
    </html>
  )
}

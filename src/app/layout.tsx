import type { Metadata } from 'next'
import { Urbanist, DM_Mono } from 'next/font/google'
import './globals.css'

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'prep — EDAIC Part I Practice',
  description: 'MTF question bank for anaesthesia residents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${urbanist.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}

import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RED AI NAVIGATOR',
  description: 'Finde deine perfekte AI Money Making Methode',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}

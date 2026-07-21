import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crime Analytics Platform',
  description: 'Intelligent Crime Analytics Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* This forces the whole background to be dark */}
      <body className="bg-slate-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
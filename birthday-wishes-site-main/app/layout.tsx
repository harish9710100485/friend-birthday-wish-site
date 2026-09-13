import '../styles/globals.css'
import { Playfair_Display, Inter } from 'next/font/google'
import content from '../data/content.json'

const display = Playfair_Display({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700'] })
const body = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata = {
  title: content.site.title,
  description: content.site.description
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} text-[#193B4A]`}>
        {children}
      </body>
    </html>
  )
}

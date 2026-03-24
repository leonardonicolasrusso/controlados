import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CONTROLADOS',
  description: 'Tu catálogo de controles remotos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

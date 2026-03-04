import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Estudio de Toma de Decisiones — Universidad de La Sabana',
  description: 'Proyecto de Doctorado en Psicología — Decisiones emocionales y morales e Inteligencia Artificial',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#f7f8fc] min-h-screen">
        {children}
      </body>
    </html>
  )
}

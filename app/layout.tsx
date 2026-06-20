import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import BottomNav from "./components/BottomNav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Biblia 365",
  description: "Tu companero diario de lectura biblica",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex min-h-screen flex-col pb-16 md:pb-0`}>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
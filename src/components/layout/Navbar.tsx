"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/biblia",        label: "Biblia" },
  { href: "/devocionales",  label: "Devocionales" },
  { href: "/planes",        label: "Planes" },
  { href: "/favoritos",     label: "Favoritos" },
  { href: "/frase-del-dia", label: "Frase del Dia" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold text-[#061B44]">
          BIBLIA <span className="text-[#D4AF37]">365</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-[#D4AF37] ${
                pathname === link.href ? "text-[#D4AF37]" : "text-gray-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-gray-600 hover:text-[#D4AF37] transition"
          >
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="text-sm bg-[#D4AF37] text-black px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  )
}
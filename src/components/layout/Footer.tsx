import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xl font-bold text-[#061B44]">
            BIBLIA <span className="text-[#D4AF37]">365</span>
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/biblia" className="hover:text-[#D4AF37] transition">Biblia</Link>
            <Link href="/devocionales" className="hover:text-[#D4AF37] transition">Devocionales</Link>
            <Link href="/planes" className="hover:text-[#D4AF37] transition">Planes</Link>
            <Link href="/favoritos" className="hover:text-[#D4AF37] transition">Favoritos</Link>
          </div>
          <p className="text-sm text-gray-400">
            2025 Biblia 365. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
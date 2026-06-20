"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface FavoriteVerse {
  book: string
  chapter: number
  verse: number
  text: string
}

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([])

  useEffect(() => {
    const keys = JSON.parse(localStorage.getItem("biblia365_favorites") ?? "[]")
    const data: FavoriteVerse[] = keys.map((key: string) => {
      const saved = localStorage.getItem(`biblia365_fav_${key}`)
      return saved ? JSON.parse(saved) : null
    }).filter(Boolean)
    setFavorites(data)
  }, [])

  function removeFavorite(verse: FavoriteVerse) {
    const key = `${verse.book}-${verse.chapter}-${verse.verse}`
    const keys = JSON.parse(localStorage.getItem("biblia365_favorites") ?? "[]")
    const updated = keys.filter((k: string) => k !== key)
    localStorage.setItem("biblia365_favorites", JSON.stringify(updated))
    localStorage.removeItem(`biblia365_fav_${key}`)
    setFavorites(prev => prev.filter(f => !(f.book === verse.book && f.chapter === verse.chapter && f.verse === verse.verse)))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#061B44] mb-6">Mis Favoritos</h1>

        {favorites.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-400 mb-4">No tienes versiculos favoritos todavia.</p>
            <Link href="/biblia" className="text-[#D4AF37] font-semibold hover:underline">
              Ir a la Biblia
            </Link>
          </div>
        )}

        {favorites.map((v, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 mb-4 border-l-4 border-[#D4AF37]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#D4AF37] mb-2">
                  {v.book} {v.chapter}:{v.verse}
                </p>
                <p className="text-gray-800 leading-relaxed">{v.text}</p>
              </div>
              <button
                onClick={() => removeFavorite(v)}
                className="text-red-400 hover:text-red-600 shrink-0 text-xl"
              >
                ❤️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
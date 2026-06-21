"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

interface Noticia {
  id: string
  title: string
  content: string
  image_url: string
  created_at: string
}

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Noticia | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("noticias")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
      if (data) setNoticias(data)
      setLoading(false)
    }
    load()
  }, [])

  if (selected) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setSelected(null)} className="text-[#D4AF37] hover:underline text-sm mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          {selected.image_url && (
            <img src={selected.image_url} alt={selected.title} className="w-full rounded-xl mb-6 object-cover max-h-64" />
          )}
          <h1 className="text-2xl font-bold text-[#061B44] mb-4">{selected.title}</h1>
          <p className="text-xs text-gray-400 mb-6">{new Date(selected.created_at).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}</p>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selected.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#061B44] mb-6">Noticias Cristianas</h1>

        {loading && <p className="text-gray-400">Cargando...</p>}

        {!loading && noticias.length === 0 && (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-400">No hay noticias disponibles aun.</p>
          </div>
        )}

        <div className="space-y-4">
          {noticias.map(n => (
            <div key={n.id} onClick={() => setSelected(n)}
              className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md transition flex gap-4">
              {n.image_url && (
                <img src={n.image_url} alt={n.title} className="w-20 h-20 rounded-lg object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-[#061B44] mb-1">{n.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">{n.content}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(n.created_at).toLocaleDateString("es-CO")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

interface Musica {
  id: string
  title: string
  artist: string
  youtube_url: string
  category: string
}

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export default function MusicaPage() {
  const [songs, setSongs] = useState<Musica[]>([])
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("musica")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
      if (data) setSongs(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#061B44] mb-6">Musica Cristiana</h1>

        {loading && <p className="text-gray-400">Cargando...</p>}

        {!loading && songs.length === 0 && (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-400">No hay musica disponible aun.</p>
          </div>
        )}

        <div className="space-y-4">
          {songs.map(s => {
            const videoId = getYouTubeId(s.youtube_url)
            const isPlaying = playing === s.id
            return (
              <div key={s.id} className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPlaying(isPlaying ? null : s.id)}
                    className="w-12 h-12 bg-[#061B44] rounded-full flex items-center justify-center shrink-0 hover:bg-[#D4AF37] transition-colors"
                  >
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#061B44] truncate">{s.title}</p>
                    <p className="text-sm text-gray-500 truncate">{s.artist}</p>
                  </div>
                </div>
                {isPlaying && videoId && (
                  <div className="mt-4 relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                      title={s.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
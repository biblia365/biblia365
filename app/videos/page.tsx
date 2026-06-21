"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

interface Video {
  id: string
  title: string
  youtube_url: string
  category: string
  created_at: string
}

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("videos")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
      if (data) setVideos(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#061B44] mb-6">Videos</h1>

        {loading && <p className="text-gray-400">Cargando...</p>}

        {!loading && videos.length === 0 && (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-400">No hay videos disponibles aun.</p>
          </div>
        )}

        <div className="space-y-6">
          {videos.map(v => {
            const videoId = getYouTubeId(v.youtube_url)
            return (
              <div key={v.id} className="bg-white rounded-xl shadow overflow-hidden">
                {videoId && (
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="font-semibold text-[#061B44]">{v.title}</h2>
                  <p className="text-xs text-gray-400 mt-1 capitalize">{v.category}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
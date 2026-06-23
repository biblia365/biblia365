"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [stats, setStats] = useState({ users: 0, phrases: 0, audios: 0, videos: 0, noticias: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
      if (profile?.role !== "admin") { router.push("/"); return }

      const [users, phrases, audios, videos, noticias] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("phrases").select("id", { count: "exact", head: true }),
        supabase.from("audios").select("id", { count: "exact", head: true }),
        supabase.from("videos").select("id", { count: "exact", head: true }),
        supabase.from("noticias").select("id", { count: "exact", head: true }),
      ])

      setStats({
        users: users.count ?? 0,
        phrases: phrases.count ?? 0,
        audios: audios.count ?? 0,
        videos: videos.count ?? 0,
        noticias: noticias.count ?? 0,
      })
      setLoading(false)
    }
    check()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Cargando...</p>
    </div>
  )

  const cards = [
    { label: "Usuarios", value: stats.users, color: "border-[#D4AF37]" },
    { label: "Versiculos del dia", value: stats.phrases, color: "border-[#061B44]" },
    { label: "Audios", value: stats.audios, color: "border-green-500" },
    { label: "Videos", value: stats.videos, color: "border-blue-500" },
    { label: "Noticias", value: stats.noticias, color: "border-purple-500" },
  ]

  const modules = [
    { href: "/admin/frases", label: "Versiculos del dia", desc: "Agregar y gestionar versiculos programados." },
    { href: "/admin/audios", label: "Audios diarios", desc: "Subir reflexiones de audio para cada dia." },
    { href: "/admin/videos", label: "Videos", desc: "Agregar predicas y ensenanzas de YouTube." },
    { href: "/admin/musica", label: "Musica", desc: "Agregar alabanzas y musica cristiana." },
    { href: "/admin/noticias", label: "Noticias", desc: "Publicar noticias y anuncios." },
    { href: "/admin/usuarios", label: "Usuarios", desc: "Ver y gestionar usuarios registrados." },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 pb-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#061B44] mb-8">Panel Admin</h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {cards.map(c => (
            <div key={c.label} className={`bg-white rounded-xl shadow p-4 border-l-4 ${c.color}`}>
              <p className="text-xs text-gray-500 mb-1">{c.label}</p>
              <p className="text-3xl font-bold text-[#061B44]">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map(m => (
            <a key={m.href} href={m.href} className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-[#061B44] mb-2">{m.label}</h2>
              <p className="text-gray-500 text-sm">{m.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
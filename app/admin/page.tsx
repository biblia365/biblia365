"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [stats, setStats] = useState({ users: 0, phrases: 0, devotionals: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profile?.role !== "admin") { router.push("/"); return }

      const [users, phrases, devotionals] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("phrases").select("id", { count: "exact", head: true }),
        supabase.from("devotionals").select("id", { count: "exact", head: true }),
      ])

      setStats({
        users: users.count ?? 0,
        phrases: phrases.count ?? 0,
        devotionals: devotionals.count ?? 0,
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#061B44] mb-8">Panel Admin</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-[#D4AF37]">
            <p className="text-sm text-gray-500 mb-1">Usuarios</p>
            <p className="text-4xl font-bold text-[#061B44]">{stats.users}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-[#061B44]">
            <p className="text-sm text-gray-500 mb-1">Versiculos del dia</p>
            <p className="text-4xl font-bold text-[#061B44]">{stats.phrases}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-500 mb-1">Devocionales</p>
            <p className="text-4xl font-bold text-[#061B44]">{stats.devotionals}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/admin/frases" className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-[#061B44] mb-2">Versiculos del dia</h2>
            <p className="text-gray-500 text-sm">Agregar y gestionar versiculos programados.</p>
          </a>
          <a href="/admin/audios" className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-[#061B44] mb-2">Audios diarios</h2>
            <p className="text-gray-500 text-sm">Subir reflexiones de audio para cada dia.</p>
          </a>
          <a href="/admin/devocionales" className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-[#061B44] mb-2">Devocionales</h2>
            <p className="text-gray-500 text-sm">Gestionar el libro devocional.</p>
          </a>
          <a href="/admin/usuarios" className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-[#061B44] mb-2">Usuarios</h2>
            <p className="text-gray-500 text-sm">Ver y gestionar usuarios registrados.</p>
          </a>
        </div>
      </div>
    </div>
  )
}
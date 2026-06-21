"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      setUser(user)
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile(data)
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/inicio" className="text-[#D4AF37] hover:underline text-sm">Inicio</Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-2xl font-bold text-[#061B44]">Mi Perfil</h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-4 space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Nombre</p>
            <p className="text-gray-800 font-medium">{profile?.full_name ?? user?.user_metadata?.full_name ?? "Sin nombre"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Correo</p>
            <p className="text-gray-800 font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Rol</p>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              profile?.role === "admin" ? "bg-[#D4AF37] text-black" : "bg-gray-100 text-gray-600"
            }`}>
              {profile?.role ?? "usuario"}
            </span>
          </div>
        </div>

        {profile?.role === "admin" && (
          <Link href="/admin"
            className="block w-full text-center rounded-xl bg-[#061B44] py-3 text-white font-semibold hover:opacity-90 transition mb-3">
            Ir al Panel Admin
          </Link>
        )}

        <Link href="/inicio"
          className="block w-full text-center rounded-xl bg-gray-100 py-3 text-gray-700 font-semibold hover:bg-gray-200 transition mb-3">
          Ir a Inicio
        </Link>

        <button onClick={handleLogout}
          className="w-full rounded-xl bg-red-500 py-3 text-white font-semibold hover:opacity-90 transition">
          Cerrar sesion
        </button>
      </div>
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      setUser(user)
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-[#061B44] mb-6">Mi Perfil</h1>
        <div className="bg-white rounded-xl shadow p-6 mb-4">
          <p className="text-sm text-gray-500 mb-1">Correo</p>
          <p className="text-gray-800 font-medium">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full rounded-xl bg-red-500 py-3 text-white font-semibold hover:opacity-90 transition"
        >
          Cerrar sesion
        </button>
      </div>
    </div>
  )
}
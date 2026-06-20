"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
      if (profile?.role !== "admin") { router.push("/"); return }
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })
      if (data) setUsers(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Cargando...</p></div>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="text-[#D4AF37] hover:underline text-sm">Panel Admin</Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-2xl font-bold text-[#061B44]">Usuarios</h1>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600">Correo</th>
                <th className="text-left px-4 py-3 text-gray-600">Nombre</th>
                <th className="text-left px-4 py-3 text-gray-600">Rol</th>
                <th className="text-left px-4 py-3 text-gray-600">Registro</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{u.email}</td>
                  <td className="px-4 py-3 text-gray-600">{u.full_name ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.role === "admin" ? "bg-[#D4AF37] text-black" : "bg-gray-100 text-gray-600"
                    }`}>
                      {u.role ?? "user"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(u.created_at).toLocaleDateString("es-CO")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
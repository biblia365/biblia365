"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError("Correo o contrasena incorrectos")
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/biblia")
    }
    router.refresh()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-[#061B44] mb-6">Iniciar sesion</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Correo electronico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full rounded-xl bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
            placeholder="tu@correo.com"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Contrasena</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full rounded-xl bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#D4AF37] py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm text-gray-500">
        <p>
          No tienes cuenta?{" "}
          <Link href="/auth/register" className="text-[#D4AF37] hover:underline">
            Registrate
          </Link>
        </p>
        <p>
          <Link href="/auth/recover" className="text-[#D4AF37] hover:underline">
            Olvide mi contrasena
          </Link>
        </p>
      </div>
    </div>
  )
}
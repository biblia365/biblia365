"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/auth/login?registered=true")
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-[#061B44] mb-6">Crear cuenta</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Nombre completo</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            className="w-full rounded-xl bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
            placeholder="Tu nombre"
          />
        </div>

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
            minLength={6}
            className="w-full rounded-xl bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
            placeholder="Minimo 6 caracteres"
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
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-[#D4AF37] hover:underline">
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

export default function RecoverPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRecover(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
        <h2 className="text-2xl font-semibold text-[#061B44] mb-4">Revisa tu correo</h2>
        <p className="text-gray-500 mb-6">Te enviamos un enlace para restablecer tu contrasena.</p>
        <Link href="/auth/login" className="text-[#D4AF37] hover:underline text-sm">
          Volver al inicio de sesion
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-[#061B44] mb-2">Recuperar contrasena</h2>
      <p className="text-gray-500 text-sm mb-6">Te enviaremos un enlace a tu correo.</p>

      <form onSubmit={handleRecover} className="space-y-4">
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

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#D4AF37] py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <Link href="/auth/login" className="text-[#D4AF37] hover:underline">
          Volver al inicio de sesion
        </Link>
      </div>
    </div>
  )
}
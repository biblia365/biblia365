"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminMusicaPage() {
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [url, setUrl] = useState("")
  const [msg, setMsg] = useState("")
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
      if (profile?.role !== "admin") { router.push("/"); return }
      const { data } = await supabase.from("musica").select("*").order("created_at", { ascending: false })
      if (data) setSongs(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !url) { setMsg("Completa todos los campos"); return }
    setSaving(true)
    const { error } = await supabase.from("musica").insert({ title, artist, youtube_url: url, published: true })
    if (error) { setMsg("Error: " + error.message); setSaving(false); return }
    setMsg("Cancion agregada")
    setTitle("")
    setArtist("")
    setUrl("")
    const { data } = await supabase.from("musica").select("*").order("created_at", { ascending: false })
    if (data) setSongs(data)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    await supabase.from("musica").delete().eq("id", id)
    setSongs(prev => prev.filter(s => s.id !== id))
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Cargando...</p></div>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="text-[#D4AF37] hover:underline text-sm">Panel Admin</Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-2xl font-bold text-[#061B44]">Musica</h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#061B44] mb-4">Agregar cancion</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Titulo</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="Nombre de la cancion" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Artista</label>
              <input type="text" value={artist} onChange={e => setArtist(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="Nombre del artista" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">URL de YouTube</label>
              <input type="url" value={url} onChange={e => setUrl(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            {msg && <p className={`text-sm ${msg.includes("Error") ? "text-red-500" : "text-green-600"}`}>{msg}</p>}
            <button type="submit" disabled={saving}
              className="w-full bg-[#D4AF37] text-black font-semibold py-2 rounded-lg hover:opacity-90 disabled:opacity-50">
              {saving ? "Guardando..." : "Agregar cancion"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600">Titulo</th>
                <th className="text-left px-4 py-3 text-gray-600">Artista</th>
                <th className="text-left px-4 py-3 text-gray-600">Accion</th>
              </tr>
            </thead>
            <tbody>
              {songs.map(s => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{s.title}</td>
                  <td className="px-4 py-3 text-gray-500">{s.artist}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600 text-xs font-semibold">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {songs.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400">No hay canciones</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
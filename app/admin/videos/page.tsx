"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [category, setCategory] = useState("predica")
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
      const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false })
      if (data) setVideos(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !url) { setMsg("Completa todos los campos"); return }
    setSaving(true)
    const { error } = await supabase.from("videos").insert({ title, youtube_url: url, category, published: true })
    if (error) { setMsg("Error: " + error.message); setSaving(false); return }
    setMsg("Video agregado")
    setTitle("")
    setUrl("")
    const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false })
    if (data) setVideos(data)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    await supabase.from("videos").delete().eq("id", id)
    setVideos(prev => prev.filter(v => v.id !== id))
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Cargando...</p></div>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="text-[#D4AF37] hover:underline text-sm">Panel Admin</Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-2xl font-bold text-[#061B44]">Videos</h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#061B44] mb-4">Agregar video</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Titulo</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="Titulo del video" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">URL de YouTube</label>
              <input type="url" value={url} onChange={e => setUrl(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Categoria</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]">
                <option value="predica">Predica</option>
                <option value="ensenanza">Ensenanza</option>
                <option value="testimonio">Testimonio</option>
                <option value="alabanza">Alabanza</option>
              </select>
            </div>
            {msg && <p className={`text-sm ${msg.includes("Error") ? "text-red-500" : "text-green-600"}`}>{msg}</p>}
            <button type="submit" disabled={saving}
              className="w-full bg-[#D4AF37] text-black font-semibold py-2 rounded-lg hover:opacity-90 disabled:opacity-50">
              {saving ? "Guardando..." : "Agregar video"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600">Titulo</th>
                <th className="text-left px-4 py-3 text-gray-600">Categoria</th>
                <th className="text-left px-4 py-3 text-gray-600">Accion</th>
              </tr>
            </thead>
            <tbody>
              {videos.map(v => (
                <tr key={v.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{v.title}</td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{v.category}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(v.id)} className="text-red-400 hover:text-red-600 text-xs font-semibold">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {videos.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400">No hay videos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
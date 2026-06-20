"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminAudiosPage() {
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [audios, setAudios] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [msg, setMsg] = useState("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
      if (profile?.role !== "admin") { router.push("/"); return }
      const { data } = await supabase.from("audios").select("*").order("scheduled_date", { ascending: false })
      if (data) setAudios(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !title || !date) { setMsg("Completa todos los campos"); return }
    setUploading(true)
    setMsg("")

    const ext = file.name.split(".").pop()
    const fileName = `audio-${date}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("audios")
      .upload(fileName, file, { upsert: true })

    if (uploadError) { setMsg("Error subiendo audio: " + uploadError.message); setUploading(false); return }

    const { data: urlData } = supabase.storage.from("audios").getPublicUrl(fileName)

    const { error: dbError } = await supabase.from("audios").insert({
      title,
      scheduled_date: date,
      audio_url: urlData.publicUrl,
      published: true,
    })

    if (dbError) { setMsg("Error guardando: " + dbError.message); setUploading(false); return }

    setMsg("Audio subido correctamente")
    setTitle("")
    setDate("")
    setFile(null)
    const { data } = await supabase.from("audios").select("*").order("scheduled_date", { ascending: false })
    if (data) setAudios(data)
    setUploading(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Cargando...</p></div>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="text-[#D4AF37] hover:underline text-sm">Panel Admin</Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-2xl font-bold text-[#061B44]">Audios diarios</h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#061B44] mb-4">Subir nuevo audio</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Titulo</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="Reflexion del dia" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fecha programada</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Archivo de audio (mp3)</label>
              <input type="file" accept="audio/*" onChange={e => setFile(e.target.files?.[0] ?? null)}
                className="w-full border rounded-lg px-4 py-2 text-sm" />
            </div>
            {msg && <p className={`text-sm ${msg.includes("Error") ? "text-red-500" : "text-green-600"}`}>{msg}</p>}
            <button type="submit" disabled={uploading}
              className="w-full bg-[#D4AF37] text-black font-semibold py-2 rounded-lg hover:opacity-90 disabled:opacity-50">
              {uploading ? "Subiendo..." : "Subir audio"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600">Titulo</th>
                <th className="text-left px-4 py-3 text-gray-600">Fecha</th>
                <th className="text-left px-4 py-3 text-gray-600">Audio</th>
              </tr>
            </thead>
            <tbody>
              {audios.map((a, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{a.title}</td>
                  <td className="px-4 py-3 text-gray-500">{a.scheduled_date}</td>
                  <td className="px-4 py-3">
                    <audio controls src={a.audio_url} className="h-8" />
                  </td>
                </tr>
              ))}
              {audios.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400">No hay audios subidos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
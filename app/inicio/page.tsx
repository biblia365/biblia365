"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Phrase {
  text: string
  verse_ref: string
}

interface Audio {
  title: string
  audio_url: string
}

const DAYS_ES = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]
const MONTHS_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

function getLocalDateStr() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export default function InicioPage() {
  const [user, setUser] = useState<any>(null)
  const [phrase, setPhrase] = useState<Phrase | null>(null)
  const [audio, setAudio] = useState<Audio | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const today = new Date()
  const dayName = DAYS_ES[today.getDay()]
  const day = today.getDate()
  const month = MONTHS_ES[today.getMonth()]
  const year = today.getFullYear()
  const dateLabel = `${dayName} ${day} de ${month} del ${year}`
  const todayStr = getLocalDateStr()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      setUser(user)
      const [phraseRes, audioRes] = await Promise.all([
        supabase.from("phrases").select("*").eq("scheduled_date", todayStr).eq("published", true).limit(1),
        supabase.from("audios").select("*").eq("scheduled_date", todayStr).eq("published", true).limit(1),
      ])
      if (phraseRes.data && phraseRes.data.length > 0) setPhrase(phraseRes.data[0])
      if (audioRes.data && audioRes.data.length > 0) setAudio(audioRes.data[0])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Cargando...</p></div>

  const name = user?.user_metadata?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Bienvenido"

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="bg-[#061B44] rounded-2xl p-6 text-white">
          <p className="text-sm text-slate-400 capitalize">{dateLabel}</p>
          <h1 className="text-2xl font-bold mt-1">Hola, {name}</h1>
          <p className="text-slate-300 text-sm mt-1">Que la Palabra de Dios guie tu dia.</p>
        </div>

        {phrase && (
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-[#D4AF37]">
            <p className="text-xs font-semibold text-[#D4AF37] uppercase mb-3">Versiculo del dia</p>
            <p className="text-gray-800 leading-relaxed italic mb-3">"{phrase.text}"</p>
            <p className="text-[#D4AF37] font-semibold text-sm text-right">— {phrase.verse_ref}</p>
          </div>
        )}

        {audio && (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-xs font-semibold text-[#061B44] uppercase mb-3">Reflexion del dia</p>
            <p className="text-gray-800 font-medium mb-4">{audio.title}</p>
            <audio controls src={audio.audio_url} className="w-full" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Link href="/biblia" className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 hover:shadow-md transition">
            <span className="text-2xl">&#128214;</span>
            <span className="font-semibold text-[#061B44]">Biblia</span>
            <span className="text-xs text-gray-500">Leer la Palabra</span>
          </Link>
          <Link href="/favoritos" className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 hover:shadow-md transition">
            <span className="text-2xl">&#9733;</span>
            <span className="font-semibold text-[#061B44]">Favoritos</span>
            <span className="text-xs text-gray-500">Mis versiculos</span>
          </Link>
          <Link href="/frase-del-dia" className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 hover:shadow-md transition">
            <span className="text-2xl">&#10024;</span>
            <span className="font-semibold text-[#061B44]">Versiculo</span>
            <span className="text-xs text-gray-500">Del dia de hoy</span>
          </Link>
          <Link href="/perfil" className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 hover:shadow-md transition">
            <span className="text-2xl">&#128100;</span>
            <span className="font-semibold text-[#061B44]">Perfil</span>
            <span className="text-xs text-gray-500">Mi cuenta</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
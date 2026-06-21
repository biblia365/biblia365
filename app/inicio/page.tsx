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

const modules = [
  {
    href: "/biblia",
    label: "Biblia",
    desc: "Leer la Palabra",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5A2.5 2.5 0 016.5 3H20v18H6.5A2.5 2.5 0 014 18.5v-13z" />
      </svg>
    )
  },
  {
    href: "/frase-del-dia",
    label: "Versiculo del Dia",
    desc: "Palabra de hoy",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17.5l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3" />
      </svg>
    )
  },
  {
    href: "/videos",
    label: "Videos",
    desc: "Predicas y ensenanzas",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    href: "/musica",
    label: "Musica",
    desc: "Alabanzas y adoracion",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    )
  },
  {
    href: "/noticias",
    label: "Noticias",
    desc: "Noticias cristianas",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    )
  },
  {
    href: "/favoritos",
    label: "Favoritos",
    desc: "Mis versiculos",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    href: "/donaciones",
    label: "Donar",
    desc: "Apoya el ministerio",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    href: "/audio-del-dia",
    label: "Audio del Dia",
    desc: "Reflexion diaria",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6a7 7 0 010 12M8.464 8.464a5 5 0 000 7.072" />
      </svg>
    )
  }
]

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-24">
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

        <div>
          <h2 className="text-lg font-bold text-[#061B44] mb-4">Explorar</h2>
          <div className="grid grid-cols-2 gap-4">
            {modules.map(m => (
              <Link key={m.href} href={m.href}
                className="bg-white rounded-xl shadow p-5 flex flex-col gap-3 hover:shadow-md transition">
                {m.icon}
                <div>
                  <p className="font-bold text-[#061B44]">{m.label}</p>
                  <p className="text-xs text-gray-500">{m.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
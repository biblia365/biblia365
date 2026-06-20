"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

interface Audio {
  id: string
  title: string
  scheduled_date: string
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

export default function AudioDelDiaPage() {
  const [audio, setAudio] = useState<Audio | null>(null)
  const [loading, setLoading] = useState(true)
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
      const { data } = await supabase
        .from("audios")
        .select("*")
        .eq("scheduled_date", todayStr)
        .eq("published", true)
        .limit(1)
      if (data && data.length > 0) setAudio(data[0])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#061B44]">Reflexion del Dia</h1>
          <p className="text-gray-500 mt-2 capitalize">{dateLabel}</p>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-400">Cargando...</p>
          </div>
        )}

        {!loading && !audio && (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-400">No hay reflexion programada para hoy.</p>
          </div>
        )}

        {!loading && audio && (
          <div className="bg-white rounded-2xl shadow p-8 border-l-4 border-[#D4AF37]">
            <h2 className="text-xl font-semibold text-[#061B44] mb-6">{audio.title}</h2>
            <audio controls src={audio.audio_url} className="w-full" />
          </div>
        )}
      </div>
    </div>
  )
}
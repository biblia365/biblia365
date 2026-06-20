"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

interface Phrase {
  id: string
  text: string
  author: string
  verse_ref: string
  category: string
  scheduled_date: string
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

export default function FraseDelDiaPage() {
  const [phrase, setPhrase] = useState<Phrase | null>(null)
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
    async function loadPhrase() {
      const { data } = await supabase
        .from("phrases")
        .select("*")
        .eq("scheduled_date", todayStr)
        .eq("published", true)
        .single()
      setPhrase(data)
      setLoading(false)
    }
    loadPhrase()
  }, [])

  const orations: Record<string, string> = {
    amor: "Senor, llenanos de tu amor para amar a los demas como tu nos amas. Amen.",
    fe: "Padre, aumenta nuestra fe y confianza en tus promesas. Amen.",
    esperanza: "Dios, que tu esperanza llene nuestro corazon en cada momento. Amen.",
    oracion: "Senor, ensenanos a orar y a buscar tu presencia cada dia. Amen.",
    sabiduria: "Padre, danos sabiduria para tomar decisiones conforme a tu voluntad. Amen.",
    proposito: "Dios, revela tu proposito en nuestra vida y guia cada paso. Amen.",
    familia: "Senor, bendice y protege cada hogar y cada familia. Amen.",
    perdon: "Padre, ayudanos a perdonar como tu nos has perdonado. Amen.",
    alabanza: "Dios, que nuestra vida sea un canto de alabanza a tu nombre. Amen.",
    identidad: "Senor, recordanos cada dia que somos hijos amados por ti. Amen.",
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#061B44]">Versiculo del Dia</h1>
          <p className="text-gray-500 mt-2 capitalize">{dateLabel}</p>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-400">Cargando...</p>
          </div>
        )}

        {!loading && !phrase && (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-400">No hay versiculo programado para hoy.</p>
          </div>
        )}

        {!loading && phrase && (
          <>
            <div className="bg-white rounded-2xl shadow p-8 mb-6 border-l-4 border-[#D4AF37]">
              <p className="text-xl text-gray-800 leading-relaxed italic mb-6">
                "{phrase.text}"
              </p>
              <p className="text-[#D4AF37] font-semibold text-right">— {phrase.verse_ref}</p>
            </div>

            <div className="bg-[#061B44] rounded-2xl p-8 text-white">
              <h2 className="text-lg font-semibold mb-4 text-[#D4AF37]">Oracion del dia</h2>
              <p className="leading-relaxed text-slate-300">
                {orations[phrase.category] ?? "Senor, que tu Palabra ilumine nuestro camino hoy y siempre. Amen."}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
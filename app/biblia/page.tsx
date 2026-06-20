"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase"

interface Book {
  id: number
  name: string
  abbrev: string
  testament: string
  book_order: number
}

interface Chapter {
  id: number
  book_id: number
  number: number
}

interface Verse {
  id: number
  chapter_id: number
  number: number
  text: string
}

const FONT_SIZES = ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl"]
const THEMES = [
  { label: "Blanco", bg: "bg-white", text: "text-gray-800", container: "bg-gray-50" },
  { label: "Sepia", bg: "bg-amber-50", text: "text-amber-900", container: "bg-amber-100" },
  { label: "Negro", bg: "bg-gray-900", text: "text-gray-100", container: "bg-gray-800" },
]

export default function BibliaPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null)
  const [verses, setVerses] = useState<Verse[]>([])
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [loadingVerses, setLoadingVerses] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [fontIdx, setFontIdx] = useState(1)
  const [themeIdx, setThemeIdx] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const supabase = createClient()
  const theme = THEMES[themeIdx]

  useEffect(() => {
    const saved = localStorage.getItem("biblia365_favorites")
    if (saved) setFavorites(JSON.parse(saved))
  }, [])

  useEffect(() => {
    async function loadBooks() {
      const { data } = await supabase.from("books").select("*").order("book_order")
      if (data) setBooks(data)
      setLoadingBooks(false)
    }
    loadBooks()
  }, [])

  const loadVerses = useCallback(async (chapter: Chapter) => {
    setSelectedChapter(chapter)
    setSelectedVerse(null)
    setLoadingVerses(true)
    window.speechSynthesis?.cancel()
    setSpeaking(false)
    const { data } = await supabase.from("verses").select("*").eq("chapter_id", chapter.id).order("number")
    if (data) setVerses(data)
    setLoadingVerses(false)
  }, [supabase])

  const loadChapters = useCallback(async (book: Book) => {
    setSelectedBook(book)
    setSelectedChapter(null)
    setSelectedVerse(null)
    setVerses([])
    setChapters([])
    setSidebarOpen(false)
    const { data } = await supabase.from("chapters").select("*").eq("book_id", book.id).order("number")
    if (data && data.length > 0) {
      setChapters(data)
      await loadVerses(data[0])
    }
  }, [supabase, loadVerses])

  function toggleFavorite(verse: Verse) {
    const key = `${selectedBook?.name}-${selectedChapter?.number}-${verse.number}`
    const updated = favorites.includes(key)
      ? favorites.filter(f => f !== key)
      : [...favorites, key]
    setFavorites(updated)
    localStorage.setItem("biblia365_favorites", JSON.stringify(updated))
    localStorage.setItem(`biblia365_fav_${key}`, JSON.stringify({
      book: selectedBook?.name,
      chapter: selectedChapter?.number,
      verse: verse.number,
      text: verse.text
    }))
  }

  function speakVerses() {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    const text = verses.map(v => `Versiculo ${v.number}. ${v.text}`).join(" ")
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "es-ES"
    utterance.onend = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

  const otBooks = books.filter(b => b.testament === "OT")
  const ntBooks = books.filter(b => b.testament === "NT")
  const currentChapterIdx = chapters.findIndex(c => c.id === selectedChapter?.id)

  return (
    <div className={`min-h-screen ${theme.container}`}>

      {/* Barra movil */}
      <div className={`md:hidden flex items-center gap-3 border-b px-4 py-3 sticky top-0 z-30 ${theme.bg}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-[#061B44] font-semibold text-sm border border-gray-300 rounded-lg px-3 py-1.5">
          {selectedBook ? selectedBook.name : "Seleccionar libro"}
        </button>
        {selectedChapter && (
          <select value={selectedChapter?.id ?? ""} onChange={e => {
            const ch = chapters.find(c => c.id === Number(e.target.value))
            if (ch) loadVerses(ch)
          }} className="border rounded-lg px-2 py-1.5 text-sm text-gray-700 focus:outline-none">
            {chapters.map(ch => (
              <option key={ch.id} value={ch.id}>Cap. {ch.number}</option>
            ))}
          </select>
        )}
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 h-full w-72 z-50 shadow-xl transform transition-transform duration-300 md:static md:w-64 md:shadow-none md:z-auto md:translate-x-0 md:block ${theme.bg} ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-3 md:hidden">
              <h2 className={`font-bold text-lg ${theme.text}`}>Libros</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500 text-xl font-bold">x</button>
            </div>
            <h2 className={`hidden md:block font-bold text-lg mb-3 ${theme.text}`}>Libros</h2>
            {loadingBooks && <p className="text-sm text-gray-400">Cargando...</p>}
            {!loadingBooks && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Antiguo Testamento</p>
                {otBooks.map(book => (
                  <button key={book.id} onClick={() => loadChapters(book)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm mb-0.5 transition-colors ${
                      selectedBook?.id === book.id ? "bg-[#061B44] text-white font-semibold" : `hover:bg-gray-100 ${theme.text}`
                    }`}>
                    {book.name}
                  </button>
                ))}
                <p className="text-xs font-semibold text-gray-400 uppercase mt-4 mb-2">Nuevo Testamento</p>
                {ntBooks.map(book => (
                  <button key={book.id} onClick={() => loadChapters(book)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm mb-0.5 transition-colors ${
                      selectedBook?.id === book.id ? "bg-[#061B44] text-white font-semibold" : `hover:bg-gray-100 ${theme.text}`
                    }`}>
                    {book.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </aside>

        {/* Panel versiculos */}
        <main className="flex-1 min-w-0">
          {!selectedBook && (
            <div className={`rounded-xl shadow p-10 text-center ${theme.bg}`}>
              <p className={`text-xl font-semibold ${theme.text}`}>Selecciona un libro para comenzar</p>
            </div>
          )}

          {selectedBook && (
            <div className={`rounded-xl shadow p-6 ${theme.bg}`}>

              {/* Controles */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="hidden md:flex items-center gap-3">
                  <h1 className={`text-2xl font-bold text-[#061B44] ${themeIdx === 2 ? "text-white" : ""}`}>{selectedBook.name}</h1>
                  <select value={selectedChapter?.id ?? ""} onChange={e => {
                    const ch = chapters.find(c => c.id === Number(e.target.value))
                    if (ch) loadVerses(ch)
                  }} className="border rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none">
                    {chapters.map(ch => (
                      <option key={ch.id} value={ch.id}>Capitulo {ch.number}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Tamano fuente */}
                  <button onClick={() => setFontIdx(i => Math.max(0, i - 1))} className="px-2 py-1 border rounded text-sm">A-</button>
                  <button onClick={() => setFontIdx(i => Math.min(4, i + 1))} className="px-2 py-1 border rounded text-sm">A+</button>

                  {/* Tema */}
                  {THEMES.map((t, i) => (
                    <button key={i} onClick={() => setThemeIdx(i)}
                      className={`px-2 py-1 border rounded text-xs ${themeIdx === i ? "border-[#D4AF37] font-bold" : ""}`}>
                      {t.label}
                    </button>
                  ))}

                  {/* Audio */}
                  <button onClick={speakVerses}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${speaking ? "bg-red-500 text-white" : "bg-[#D4AF37] text-black"}`}>
                    {speaking ? "Detener" : "Escuchar"}
                  </button>
                </div>
              </div>

              <h2 className={`text-lg font-semibold mb-4 text-gray-500`}>
                {selectedBook.name} {selectedChapter?.number}
              </h2>

              {loadingVerses && <p className="text-gray-400">Cargando versiculos...</p>}

              {!loadingVerses && verses.map(v => {
                const key = `${selectedBook?.name}-${selectedChapter?.number}-${v.number}`
                const isFav = favorites.includes(key)
                return (
                  <div key={v.id}
                    onClick={() => setSelectedVerse(v.number === selectedVerse ? null : v.number)}
                    className={`mb-2 leading-relaxed rounded-lg px-3 py-2 cursor-pointer transition-colors group flex items-start gap-2 ${
                      selectedVerse === v.number ? "bg-amber-50 border-l-4 border-[#D4AF37] shadow-sm" : "hover:bg-gray-50"
                    }`}>
                    <span className={`font-bold text-[#D4AF37] mr-1 text-sm shrink-0 mt-1`}>{v.number}</span>
                    <span className={`${FONT_SIZES[fontIdx]} ${theme.text} flex-1`}>{v.text}</span>
                    <button
                      onClick={e => { e.stopPropagation(); toggleFavorite(v) }}
                      className="shrink-0 mt-1 "
                    >
                      {isFav ? "❤️" : "🤍"}
                    </button>
                  </div>
                )
              })}

              {!loadingVerses && verses.length > 0 && (
                <div className="flex justify-between mt-8 pt-4 border-t">
                  <button onClick={() => { if (currentChapterIdx > 0) loadVerses(chapters[currentChapterIdx - 1]) }}
                    disabled={currentChapterIdx === 0}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm disabled:opacity-40 hover:bg-gray-200 transition-colors">
                    Capitulo anterior
                  </button>
                  <button onClick={() => { if (currentChapterIdx < chapters.length - 1) loadVerses(chapters[currentChapterIdx + 1]) }}
                    disabled={currentChapterIdx === chapters.length - 1}
                    className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-sm disabled:opacity-40 hover:opacity-90 transition-colors">
                    Capitulo siguiente
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

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
  const supabase = createClient()

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

  const otBooks = books.filter(b => b.testament === "OT")
  const ntBooks = books.filter(b => b.testament === "NT")
  const currentChapterIdx = chapters.findIndex(c => c.id === selectedChapter?.id)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Barra movil */}
      <div className="md:hidden flex items-center gap-3 bg-white border-b px-4 py-3 sticky top-0 z-30">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-[#061B44] font-semibold text-sm border border-gray-300 rounded-lg px-3 py-1.5"
        >
          {selectedBook ? selectedBook.name : "Seleccionar libro"}
        </button>
        {selectedChapter && (
          <select
            value={selectedChapter?.id ?? ""}
            onChange={e => {
              const ch = chapters.find(c => c.id === Number(e.target.value))
              if (ch) loadVerses(ch)
            }}
            className="border rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none"
          >
            {chapters.map(ch => (
              <option key={ch.id} value={ch.id}>Cap. {ch.number}</option>
            ))}
          </select>
        )}
      </div>

      {/* Overlay movil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        {/* Sidebar */}
        <aside className={`
          fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300
          md:static md:w-64 md:shadow-none md:z-auto md:translate-x-0 md:block
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-3 md:hidden">
              <h2 className="font-bold text-lg text-gray-800">Libros</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500 text-xl font-bold">x</button>
            </div>
            <h2 className="hidden md:block font-bold text-lg mb-3 text-gray-800">Libros</h2>
            {loadingBooks && <p className="text-sm text-gray-400">Cargando...</p>}
            {!loadingBooks && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Antiguo Testamento</p>
                {otBooks.map(book => (
                  <button key={book.id} onClick={() => loadChapters(book)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm mb-0.5 transition-colors ${
                      selectedBook?.id === book.id ? "bg-[#061B44] text-white font-semibold" : "hover:bg-gray-100 text-gray-700"
                    }`}>
                    {book.name}
                  </button>
                ))}
                <p className="text-xs font-semibold text-gray-400 uppercase mt-4 mb-2">Nuevo Testamento</p>
                {ntBooks.map(book => (
                  <button key={book.id} onClick={() => loadChapters(book)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm mb-0.5 transition-colors ${
                      selectedBook?.id === book.id ? "bg-[#061B44] text-white font-semibold" : "hover:bg-gray-100 text-gray-700"
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
            <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
              <p className="text-xl font-semibold">Selecciona un libro para comenzar</p>
            </div>
          )}

          {selectedBook && (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="hidden md:flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-[#061B44]">{selectedBook.name}</h1>
                <select
                  value={selectedChapter?.id ?? ""}
                  onChange={e => {
                    const ch = chapters.find(c => c.id === Number(e.target.value))
                    if (ch) loadVerses(ch)
                  }}
                  className="border rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  {chapters.map(ch => (
                    <option key={ch.id} value={ch.id}>Capitulo {ch.number}</option>
                  ))}
                </select>
              </div>

              <h2 className="text-lg font-semibold text-gray-500 mb-4">
                {selectedBook.name} {selectedChapter?.number}
              </h2>

              {loadingVerses && <p className="text-gray-400">Cargando versiculos...</p>}

              {!loadingVerses && verses.map(v => (
                <p
                  key={v.id}
                  onClick={() => setSelectedVerse(v.number === selectedVerse ? null : v.number)}
                  className={`mb-2 leading-relaxed rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                    selectedVerse === v.number
                      ? "bg-amber-50 border-l-4 border-[#D4AF37] shadow-sm"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="font-bold text-[#D4AF37] mr-2 text-sm">{v.number}</span>
                  <span className="text-gray-800">{v.text}</span>
                </p>
              ))}

              {!loadingVerses && verses.length > 0 && (
                <div className="flex justify-between mt-8 pt-4 border-t">
                  <button
                    onClick={() => { if (currentChapterIdx > 0) loadVerses(chapters[currentChapterIdx - 1]) }}
                    disabled={currentChapterIdx === 0}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm disabled:opacity-40 hover:bg-gray-200 transition-colors"
                  >
                    Capitulo anterior
                  </button>
                  <button
                    onClick={() => { if (currentChapterIdx < chapters.length - 1) loadVerses(chapters[currentChapterIdx + 1]) }}
                    disabled={currentChapterIdx === chapters.length - 1}
                    className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-sm disabled:opacity-40 hover:opacity-90 transition-colors"
                  >
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
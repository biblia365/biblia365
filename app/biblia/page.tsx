"use client"

import { useEffect, useState } from "react"
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
  const [verses, setVerses] = useState<Verse[]>([])
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [loadingVerses, setLoadingVerses] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function loadBooks() {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("book_order")
      if (!error && data) setBooks(data)
      setLoadingBooks(false)
    }
    loadBooks()
  }, [])

  async function selectBook(book: Book) {
    setSelectedBook(book)
    setSelectedChapter(null)
    setVerses([])
    const { data } = await supabase
      .from("chapters")
      .select("*")
      .eq("book_id", book.id)
      .order("number")
    if (data && data.length > 0) {
      setChapters(data)
      selectChapter(data[0])
    }
  }

  async function selectChapter(chapter: Chapter) {
    setSelectedChapter(chapter)
    setLoadingVerses(true)
    const { data } = await supabase
      .from("verses")
      .select("*")
      .eq("chapter_id", chapter.id)
      .order("number")
    if (data) setVerses(data)
    setLoadingVerses(false)
  }

  const otBooks = books.filter(b => b.testament === "OT")
  const ntBooks = books.filter(b => b.testament === "NT")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        <aside className="w-64 shrink-0">
          <div className="bg-white rounded-xl shadow p-4 sticky top-6 max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-lg mb-3 text-gray-800">Libros</h2>
            {loadingBooks && <p className="text-sm text-gray-400">Cargando...</p>}
            {!loadingBooks && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Antiguo Testamento</p>
                {otBooks.map(book => (
                  <button
                    key={book.id}
                    onClick={() => selectBook(book)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm mb-0.5 transition-colors ${
                      selectedBook?.id === book.id
                        ? "bg-[#061B44] text-white font-semibold"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {book.name}
                  </button>
                ))}
                <p className="text-xs font-semibold text-gray-400 uppercase mt-4 mb-2">Nuevo Testamento</p>
                {ntBooks.map(book => (
                  <button
                    key={book.id}
                    onClick={() => selectBook(book)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm mb-0.5 transition-colors ${
                      selectedBook?.id === book.id
                        ? "bg-[#061B44] text-white font-semibold"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {book.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </aside>

        <main className="flex-1">
          {!selectedBook && (
            <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
              <p className="text-xl font-semibold">Selecciona un libro para comenzar</p>
            </div>
          )}

          {selectedBook && (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-[#061B44]">{selectedBook.name}</h1>
                <select
                  value={selectedChapter?.id ?? ""}
                  onChange={e => {
                    const ch = chapters.find(c => c.id === Number(e.target.value))
                    if (ch) selectChapter(ch)
                  }}
                  className="border rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  {chapters.map(ch => (
                    <option key={ch.id} value={ch.id}>Capitulo {ch.number}</option>
                  ))}
                </select>
              </div>

              {loadingVerses && <p className="text-gray-400">Cargando versiculos...</p>}

              {!loadingVerses && verses.map(v => (
                <p key={v.id} className="mb-3 text-gray-800 leading-relaxed">
                  <span className="font-bold text-[#D4AF37] mr-2">{v.number}</span>
                  {v.text}
                </p>
              ))}

              {!loadingVerses && verses.length > 0 && (
                <div className="flex justify-between mt-8 pt-4 border-t">
                  <button
                    onClick={() => {
                      const idx = chapters.findIndex(c => c.id === selectedChapter?.id)
                      if (idx > 0) selectChapter(chapters[idx - 1])
                    }}
                    disabled={chapters.findIndex(c => c.id === selectedChapter?.id) === 0}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm disabled:opacity-40 hover:bg-gray-200 transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => {
                      const idx = chapters.findIndex(c => c.id === selectedChapter?.id)
                      if (idx < chapters.length - 1) selectChapter(chapters[idx + 1])
                    }}
                    disabled={chapters.findIndex(c => c.id === selectedChapter?.id) === chapters.length - 1}
                    className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-sm disabled:opacity-40 hover:opacity-90 transition-colors"
                  >
                    Siguiente
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
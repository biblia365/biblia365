"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

interface Book {
  id: number
  name: string
  abbr: string
  testament: string
  chapters: number
}

interface Verse {
  id: number
  book_id: number
  chapter: number
  verse: number
  text: string
}

export default function BibliaPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number>(1)
  const [verses, setVerses] = useState<Verse[]>([])
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [loadingVerses, setLoadingVerses] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function loadBooks() {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("id")
      if (!error && data) setBooks(data)
      setLoadingBooks(false)
    }
    loadBooks()
  }, [])

  useEffect(() => {
    if (!selectedBook) return
    async function loadVerses() {
      setLoadingVerses(true)
      const { data, error } = await supabase
        .from("verses")
        .select("*")
        .eq("book_id", selectedBook!.id)
        .eq("chapter", selectedChapter)
        .order("verse")
      if (!error && data) setVerses(data)
      setLoadingVerses(false)
    }
    loadVerses()
  }, [selectedBook, selectedChapter])

  const otBooks = books.filter(b => b.testament === "OT")
  const ntBooks = books.filter(b => b.testament === "NT")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        {/* Panel izquierdo — libros */}
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
                    onClick={() => { setSelectedBook(book); setSelectedChapter(1) }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm mb-0.5 transition-colors ${
                      selectedBook?.id === book.id
                        ? "bg-blue-600 text-white font-semibold"
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
                    onClick={() => { setSelectedBook(book); setSelectedChapter(1) }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm mb-0.5 transition-colors ${
                      selectedBook?.id === book.id
                        ? "bg-blue-600 text-white font-semibold"
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

        {/* Panel derecho — versiculos */}
        <main className="flex-1">
          {!selectedBook && (
            <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
              <p className="text-xl font-semibold">Selecciona un libro para comenzar</p>
            </div>
          )}

          {selectedBook && (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{selectedBook.name}</h1>
                <select
                  value={selectedChapter}
                  onChange={e => setSelectedChapter(Number(e.target.value))}
                  className="border rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(ch => (
                    <option key={ch} value={ch}>Capitulo {ch}</option>
                  ))}
                </select>
              </div>

              <h2 className="text-lg font-semibold text-gray-500 mb-6">
                {selectedBook.name} {selectedChapter}
              </h2>

              {loadingVerses && <p className="text-gray-400">Cargando versiculos...</p>}

              {!loadingVerses && verses.length === 0 && (
                <p className="text-gray-400">No se encontraron versiculos.</p>
              )}

              {!loadingVerses && verses.map(v => (
                <p key={v.id} className="mb-3 text-gray-800 leading-relaxed">
                  <span className="font-bold text-blue-600 mr-2">{v.verse}</span>
                  {v.text}
                </p>
              ))}

              {/* Navegacion de capitulos */}
              {!loadingVerses && verses.length > 0 && (
                <div className="flex justify-between mt-8 pt-4 border-t">
                  <button
                    onClick={() => setSelectedChapter(c => Math.max(1, c - 1))}
                    disabled={selectedChapter === 1}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm disabled:opacity-40 hover:bg-gray-200 transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setSelectedChapter(c => Math.min(selectedBook.chapters, c + 1))}
                    disabled={selectedChapter === selectedBook.chapters}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-40 hover:bg-blue-700 transition-colors"
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

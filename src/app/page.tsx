import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#061B44] to-[#020817] text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-6xl font-bold tracking-wide">
            BIBLIA <span className="text-[#D4AF37]">365</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Lee la Palabra de Dios cada dia del ano. Accede a la Biblia completa,
            devocionales diarios, planes de lectura y versiculos favoritos desde
            cualquier lugar.
          </p>
          <div className="mt-10 flex gap-4">
            <Link href="/biblia" className="rounded-xl bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:opacity-90">
              Comenzar
            </Link>
            <Link href="/frase-del-dia" className="rounded-xl border border-[#D4AF37] px-8 py-4 font-semibold transition hover:bg-[#D4AF37] hover:text-black">
              Versiculo del Dia
            </Link>
          </div>
        </div>
        <section className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <h3 className="mb-3 text-2xl font-semibold">Biblia Completa</h3>
            <p className="text-slate-400">Accede a todos los libros, capitulos y versiculos del Antiguo y Nuevo Testamento.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <h3 className="mb-3 text-2xl font-semibold">Devocionales</h3>
            <p className="text-slate-400">Reflexiones diarias para fortalecer tu relacion con Dios.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <h3 className="mb-3 text-2xl font-semibold">Favoritos</h3>
            <p className="text-slate-400">Guarda tus versiculos y lecturas para consultarlos cuando quieras.</p>
          </div>
        </section>
      </div>
    </main>
  )
}

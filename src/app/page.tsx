export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#061B44] to-[#020817] text-white">
      <div className="container mx-auto px-6 py-16">

        <div className="flex flex-col items-center text-center">

          <img
            src="/logo.png"
            alt="Biblia 365"
            className="w-52 h-52 mb-8"
          />

          <h1 className="text-6xl font-bold tracking-wide">
            BIBLIA <span className="text-[#D4AF37]">365</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Lee la Palabra de Dios cada día del año. Accede a la Biblia completa,
            devocionales diarios, planes de lectura y versículos favoritos desde
            cualquier lugar.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="rounded-xl bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:opacity-90">
              Comenzar
            </button>

            <button className="rounded-xl border border-[#D4AF37] px-8 py-4 font-semibold transition hover:bg-[#D4AF37] hover:text-black">
              Versículo del Día
            </button>
          </div>
        </div>

        <section className="mt-24 grid gap-8 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <div className="mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5A2.5 2.5 0 016.5 3H20v18H6.5A2.5 2.5 0 014 18.5v-13z" />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-semibold">Biblia Completa</h3>
            <p className="text-slate-400">Accede a todos los libros, capítulos y versículos del Antiguo y Nuevo Testamento.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <div className="mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.4 4.8L20 9l-4 3.9.9 5.6L12 16l-4.9 2.5.9-5.6L4 9l5.6-1.2L12 3z" />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-semibold">Devocionales</h3>
            <p className="text-slate-400">Reflexiones diarias para fortalecer tu relación con Dios.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <div className="mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.4-7-10a4 4 0 018-1.5A4 4 0 0120 11c0 5.6-8 10-8 10z" />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-semibold">Favoritos</h3>
            <p className="text-slate-400">Guarda tus versículos y lecturas para consultarlos cuando quieras.</p>
          </div>

        </section>
      </div>
    </main>
  );
}
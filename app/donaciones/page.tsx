export default function DonacionesPage() {
  const paypalUrl = "https://www.paypal.com/donate?business=tramitesbun%40gmail.com&currency_code=USD&item_name=Donacion+Biblia+365"

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 pb-20">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#061B44] mb-3">Apoya este Ministerio</h1>
          <p className="text-gray-500 leading-relaxed">
            Tu donacion nos permite seguir compartiendo la Palabra de Dios y mantener esta aplicacion gratuita para todos.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 mb-6 border-l-4 border-[#D4AF37]">
          <p className="text-lg text-gray-700 italic leading-relaxed mb-4">
            "El que siembra escasamente, tambien segara escasamente; y el que siembra generosamente, generosamente tambien segara."
          </p>
          <p className="text-[#D4AF37] font-semibold text-right">2 Corintios 9:6</p>
        </div>

        <div className="space-y-4">
          <a href={paypalUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-[#D4AF37] text-black font-bold py-4 rounded-xl hover:opacity-90 transition text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Donar con PayPal
          </a>
          <p className="text-center text-sm text-gray-400">
            Seras redirigido a PayPal para completar tu donacion de forma segura.
          </p>
        </div>

      </div>
    </div>
  )
}
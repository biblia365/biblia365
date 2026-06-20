export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#061B44]">
            BIBLIA <span className="text-[#D4AF37]">365</span>
          </h1>
          <p className="text-gray-500 mt-2">Tu compañero diario de lectura biblica</p>
        </div>
        {children}
      </div>
    </div>
  )
}
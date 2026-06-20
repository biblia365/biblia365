export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/biblia365-mockup.png"
            alt="Biblia 365"
            className="w-32 h-32 mx-auto mb-4"
          />
          <p className="text-gray-500">Tu companero diario de lectura biblica</p>
        </div>
        {children}
      </div>
    </div>
  )
}
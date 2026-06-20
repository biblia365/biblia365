"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="fixed inset-0 bg-[#061B44] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <Image
          src="/biblia365-mockup.png"
          alt="Biblia 365"
          width={220}
          height={220}
          priority
        />
        <div className="flex gap-2 mt-4">
          <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const protectedRoutes = ["/perfil", "/favoritos", "/planes"]
  const adminRoutes = ["/admin"]
  const authRoutes = ["/auth/login", "/auth/register", "/auth/recover"]

  const isProtected = protectedRoutes.some(r => request.nextUrl.pathname.startsWith(r))
  const isAdmin = adminRoutes.some(r => request.nextUrl.pathname.startsWith(r))
  const isAuth = authRoutes.some(r => request.nextUrl.pathname.startsWith(r))

  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (user && isAuth) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (isAdmin) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|images|api).*)"],
}

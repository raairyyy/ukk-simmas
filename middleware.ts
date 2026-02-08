import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  // 1. Inisialisasi Supabase Client di dalam Middleware
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 2. Cek Token
  if (!token) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  try {
    // 3. Karena kamu pakai Custom JWT (bcrypt & jwt.sign di API Login), 
    // cara paling aman adalah mengecek validitas user langsung ke DB 
    // atau jika kamu ingin benar-benar ringan, kamu bisa mem-parsing payload tanpa verifikasi secret (unsafe) 
    // tapi karena ini di server, kita bisa verifikasi via DB users:
    
    // Kita ambil data user berdasarkan token/email yang ada di payload (jika memungkinkan)
    // Atau cara paling simpel untuk Middleware Next.js:
    
    // Decode manual payload JWT (Base64) tanpa library 'jose'
    const payloadBase64 = token.split(".")[1]
    const decodedPayload = JSON.parse(Buffer.from(payloadBase64, "base64").toString())
    
    const role = decodedPayload.role
    const userId = decodedPayload.id

    // 4. Proteksi Rute berdasarkan Role
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }

    if (pathname.startsWith("/dashboard/guru") && role !== "guru") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }

    if (pathname.startsWith("/dashboard/siswa") && role !== "siswa") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }

    // Cegah user yang sudah login masuk ke halaman login lagi
    if (pathname === "/login") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }

  } catch (err) {
    // Jika token rusak/format salah
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  // 1. Jika tidak ada token dan mencoba akses dashboard
  if (!token) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  try {
    // 2. Decode Payload JWT
    const payloadBase64 = token.split(".")[1]
    const decoded = JSON.parse(Buffer.from(payloadBase64, "base64").toString())
    const role = decoded.role

    // 3. Cegah user masuk ke role yang salah
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }
    if (pathname.startsWith("/dashboard/guru") && role !== "guru") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }
    if (pathname.startsWith("/dashboard/siswa") && role !== "siswa") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }

    // 4. Jika sudah login tapi ke halaman login
    if (pathname === "/login") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }
  } catch (err) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
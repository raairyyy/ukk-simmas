import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// Inisialisasi Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // 1. Cari user di database Supabase berdasarkan email
    const { data: user, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single() // Mengambil satu data saja

    if (dbError || !user) {
      return NextResponse.json(
        { error: "User tidak ditemukan", field: "email" },
        { status: 401 }
      )
    }

    // 2. Bandingkan password yang diinput dengan password ter-hash di DB
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: "Password salah", field: "password" },
        { status: 401 }
      )
    }

    // 3. Buat JWT Token dengan menyertakan role dari database
// Di dalam POST app/api/auth/login/route.ts
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role, // Pastikan ini dikirim (admin/guru/siswa)
          name: user.name  // Tambahkan name agar tidak perlu hit API berkali-kali
        }, 
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      )

      // Simpan Cookie
      cookies().set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/", // SANGAT PENTING: Path harus root agar terbaca di semua folder
        maxAge: 60 * 60 * 24 * 7,
      })

    // Kirim response sukses balik ke frontend
    return NextResponse.json({
      success: true,
      role: user.role, // Ini akan digunakan page.tsx untuk redirect
    })

  } catch (error) {
    console.error("Login Error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    )
  }
}
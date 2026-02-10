import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      )
    }

    const hashed = await bcrypt.hash(password, 10)

    // 1. Insert ke users (role siswa)
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password: hashed,
        role: "siswa",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // 2. Insert ke tabel siswa
    await supabase.from("siswa").insert({
      user_id: user.id,
      nama: name,
    })

    // 3. Buat token login
    const token = jwt.sign(
      {
        id: user.id,
        role: "siswa",
        name: user.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    cookies().set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}

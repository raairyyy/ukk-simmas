import { NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { credential } = await req.json()

    // 1️⃣ VERIFY TOKEN GOOGLE
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 401 })
    }

    const { email, name } = payload

    // 2️⃣ CEK USER
    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    // 3️⃣ JIKA BELUM ADA → REGISTER
    if (!user) {
      const insertUser = await supabase
        .from("users")
        .insert({
          email,
          name,
          role: "siswa",
        })
        .select()
        .single()

      user = insertUser.data

      // insert ke tabel siswa
      await supabase.from("siswa").insert({
        user_id: user.id,
        nama: user.name,
      })
    }

    // 4️⃣ BUAT JWT CUSTOM
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    // 5️⃣ SET COOKIE
    cookies().set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({
      success: true,
      role: user.role,
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Google auth error" }, { status: 500 })
  }
}

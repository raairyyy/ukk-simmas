import { supabase } from "@/lib/supabase"
import { signJWT } from "@/lib/auth"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single()

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 })
  }

  const token = signJWT({
    id: user.id,
    role: user.role,
    email: user.email,
  })

  const res = NextResponse.json({ success: true })

  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
  })

  return res
}

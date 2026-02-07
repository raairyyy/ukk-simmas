import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"


// simulasi user (ganti pakai DB kamu)
const users = [
  {
    id: 1,
    email: "adminsimmas@gmail.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
]

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const user = users.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    // 🔥 SIMPAN TOKEN KE COOKIE
    cookies().set("token", token, {
      httpOnly: true,
      secure: false, // true kalau HTTPS
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({
      success: true,
      role: user.role,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const token = cookies().get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)

    // 1️⃣ Ambil guru berdasarkan user_id
    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id")
      .eq("user_id", decoded.id)
      .single()

    if (guruError || !guru) {
      return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 })
    }

    // 2️⃣ Ambil logbook siswa bimbingan guru
    const { data: logbooks, error } = await supabase
      .from("logbook")
      .select(`
        id,
        tanggal,
        kegiatan,
        kendala,
        status_verifikasi,
        catatan_guru,
        magang (
          id,
          siswa (
            id,
            nama,
            nis,
            kelas
          )
        )
      `)
      .eq("magang.guru_id", guru.id)
      .order("tanggal", { ascending: false })

    if (error) throw error

    // 3️⃣ Hitung statistik
    const stats = {
      total: logbooks.length,
      pending: logbooks.filter(l => l.status_verifikasi === "pending").length,
      disetujui: logbooks.filter(l => l.status_verifikasi === "disetujui").length,
      ditolak: logbooks.filter(l => l.status_verifikasi === "ditolak").length,
    }

    return NextResponse.json({
      data: logbooks,
      stats
    })

  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

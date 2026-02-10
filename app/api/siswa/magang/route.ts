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

    // 1️⃣ Ambil SISWA berdasarkan USER LOGIN (INI KUNCI)
    const { data: siswa, error: siswaError } = await supabase
      .from("siswa")
      .select(`
        id,
        nama,
        nis,
        kelas,
        jurusan
      `)
      .eq("user_id", decoded.id)
      .single()

    if (siswaError || !siswa) {
      return NextResponse.json({ data: null })
    }

    // 2️⃣ Ambil MAGANG berdasarkan siswa_id
    const { data: magang } = await supabase
      .from("magang")
      .select(`
        id,
        status,
        nilai_akhir,
        tanggal_mulai,
        tanggal_selesai,
        dudi (
          nama_perusahaan,
          alamat
        )
      `)
      .eq("siswa_id", siswa.id)
      .maybeSingle()

    // 3️⃣ RETURN DATA (AMAN)
    return NextResponse.json({
      data: magang
        ? {
            siswa: {
              nama: siswa.nama, // mapping ke frontend
              nis: siswa.nis,
              kelas: siswa.kelas,
              jurusan: siswa.jurusan
            },
            ...magang
          }
        : null
    })

  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

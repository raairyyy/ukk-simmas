import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// --- GET: AMBIL DATA LOGBOOK ---
export async function GET() {
  try {
    const token = cookies().get("token")?.value
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)

    // 1. Ambil data guru
    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id")
      .eq("user_id", decoded.id)
      .single()

    if (guruError || !guru) return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 })

    // 2. Ambil logbook
    const { data: logbooks, error } = await supabase
      .from("logbook")
      .select(`
        id, tanggal, kegiatan, kendala, status_verifikasi, catatan_guru, file, created_at,
        magang!inner (
          id, guru_id,
          siswa ( id, nama, nis, kelas )
        )
      `)
      .eq("magang.guru_id", guru.id)
      .order("tanggal", { ascending: false })

    if (error) throw error

    // 3. Hitung statistik
    const stats = {
      total: logbooks.length,
      pending: logbooks.filter(l => l.status_verifikasi === "pending").length,
      disetujui: logbooks.filter(l => l.status_verifikasi === "disetujui").length,
      ditolak: logbooks.filter(l => l.status_verifikasi === "ditolak").length,
    }

    return NextResponse.json({ data: logbooks, stats })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// --- PUT: VERIFIKASI LOGBOOK (UPDATE STATUS & CATATAN) ---
export async function PUT(req: Request) {
  try {
    const { id, status, catatan_guru } = await req.json();

    // Validasi sederhana
    if (!id || !status) {
      return NextResponse.json({ error: "ID dan Status wajib diisi" }, { status: 400 });
    }

    // Update Logbook
    const { data, error } = await supabase
      .from("logbook")
      .update({
        status_verifikasi: status, // 'disetujui' atau 'ditolak'
        catatan_guru: catatan_guru,
        updated_at: new Date()
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Error update logbook:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
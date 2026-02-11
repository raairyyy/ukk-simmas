import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- HELPER: Ambil ID Siswa dari Token ---
async function getSiswaIdFromToken() {
  const token = cookies().get("token")?.value;
  if (!token) throw new Error("Unauthorized");

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  
  // Cari ID Siswa berdasarkan User ID login
  const { data: siswa } = await supabase
    .from("siswa")
    .select("id")
    .eq("user_id", decoded.id)
    .single();

  if (!siswa) throw new Error("Data siswa tidak ditemukan. Pastikan Anda login sebagai siswa.");
  
  return siswa.id;
}

// ==========================================
// GET: Ambil Riwayat Pendaftaran Siswa (Array)
// ==========================================
export async function GET() {
  try {
    const siswaId = await getSiswaIdFromToken();

    const { data, error } = await supabase
      .from("magang")
      .select(`
        id,
        status,
        nilai_akhir,
        tanggal_mulai,
        tanggal_selesai,
        siswa:siswa_id (
          nama,
          nis,
          kelas,
          jurusan
        ),
        dudi:dudi_id (
          nama_perusahaan,
          alamat
        )
      `)
      .eq("siswa_id", siswaId)
      .eq("status", "berlangsung")
      .maybeSingle(); // ⬅️ penting

    if (error) throw error;

    // Kalau tidak ada magang berlangsung → data = null
    return NextResponse.json({ data });

  } catch (err: any) {
    const status = err.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}


// ==========================================
// POST: Daftar Magang Baru (Limit 3 via Trigger DB)
// ==========================================
export async function POST(req: Request) {
  try {
    const siswaId = await getSiswaIdFromToken();
    const { dudi_id } = await req.json();

    if (!dudi_id) return NextResponse.json({ error: "ID DUDI wajib diisi" }, { status: 400 });

    // 1. Cek Duplikat (Apakah sudah daftar di perusahaan ini?)
    const { data: existing } = await supabase
      .from("magang")
      .select("id")
      .eq("siswa_id", siswaId)
      .eq("dudi_id", dudi_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Anda sudah mendaftar di perusahaan ini" }, { status: 400 });
    }

    // 2. Lakukan Pendaftaran
    // Trigger 'trigger_check_magang_limit' di database akan otomatis menolak jika sudah > 3
    const { error: insertError } = await supabase
      .from("magang")
      .insert([{
        siswa_id: siswaId,
        dudi_id: dudi_id,
        status: "pending", // Status awal
        created_at: new Date()
      }]);

    if (insertError) {
      // Tangkap pesan error dari trigger PostgreSQL
      if (insertError.message.includes("Batas maksimal")) {
        return NextResponse.json({ error: "Batas maksimal pendaftaran tercapai (Max 3 Perusahaan)" }, { status: 400 });
      }
      throw insertError;
    }

    return NextResponse.json({ success: true, message: "Pendaftaran berhasil diajukan" });

  } catch (err: any) {
    const status = err.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
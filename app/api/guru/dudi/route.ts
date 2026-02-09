import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // 1. Dapatkan ID Guru
    const { data: guru } = await supabase
      .from("guru")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!guru) return NextResponse.json({ error: "Guru not found" }, { status: 404 });

    const guruId = guru.id;

    // 2. Ambil semua data magang milik guru ini untuk mendapatkan list DUDI
    // Kita butuh join ke tabel DUDI untuk mengambil detail perusahaannya
    const { data: magangData, error } = await supabase
      .from("magang")
      .select(`
        id,
        status,
        dudi:dudi_id (
          id,
          nama_perusahaan,
          alamat,
          email,
          telepon,
          penanggung_jawab
        )
      `)
      .eq("guru_id", guruId)
      // Filter opsional: Jika hanya ingin menampilkan DUDI yang sedang aktif (berlangsung)
      // .eq("status", "berlangsung"); 

    if (error) throw error;

    // 3. Olah data untuk mendapatkan List DUDI Unik + Jumlah Siswa per DUDI
    const dudiMap = new Map();

    magangData.forEach((m: any) => {
      if (!m.dudi) return; // Skip jika data dudi null

      const dudiId = m.dudi.id;
      
      if (!dudiMap.has(dudiId)) {
        dudiMap.set(dudiId, {
          ...m.dudi,
          jumlah_siswa: 0
        });
      }

      // Increment jumlah siswa jika statusnya relevan (misal: berlangsung atau aktif)
      // Jika ingin menghitung semua riwayat, hapus kondisi if
      if (m.status === "berlangsung" || m.status === "aktif") {
        dudiMap.get(dudiId).jumlah_siswa += 1;
      }
    });

    const dudiList = Array.from(dudiMap.values());

    // 4. Hitung Statistik Ringkasan
    const totalDudi = dudiList.length;
    const totalSiswaMagang = dudiList.reduce((acc, curr) => acc + curr.jumlah_siswa, 0);
    const rataRataSiswa = totalDudi > 0 ? Math.round(totalSiswaMagang / totalDudi) : 0;

    return NextResponse.json({
      stats: {
        totalDudi,
        totalSiswaMagang,
        rataRataSiswa
      },
      data: dudiList
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Hitung Statistik Utama
    const { count: totalSiswa } = await supabase.from("siswa").select("*", { count: "exact", head: true });
    const { count: totalDudi } = await supabase.from("dudi").select("*", { count: "exact", head: true }).eq("is_deleted", false);
    const { count: siswaMagang } = await supabase.from("magang").select("*", { count: "exact", head: true }).eq("status", "berlangsung");
    const { count: logbookHariIni } = await supabase.from("logbook").select("*", { count: "exact", head: true }).eq("tanggal", today);

    // 2. Ambil Magang Terbaru (5 data terakhir) dengan JOIN
    const { data: magangTerbaru } = await supabase
      .from("magang")
      .select(`id, status, tanggal_mulai, tanggal_selesai, siswa:siswa_id(nama), dudi:dudi_id(nama_perusahaan)`)
      .order("created_at", { ascending: false })
      .limit(5);

    // 3. Ambil Logbook Terbaru (3 data terakhir) dengan JOIN
    const { data: logbookTerbaru } = await supabase
      .from("logbook")
      .select(`id, kegiatan, tanggal, status_verifikasi, kendala, magang(siswa(nama))`)
      .order("created_at", { ascending: false })
      .limit(3);

    // 4. Ambil DUDI Aktif & Jumlah Siswa Magang (Join relasi magang)
    const { data: dudiAktif } = await supabase
      .from("dudi")
      .select(`id, nama_perusahaan, alamat, telepon, magang(id)`)
      .eq("is_deleted", false)
      .limit(8);

    const formattedDudi = dudiAktif?.map(d => ({
      name: d.nama_perusahaan,
      address: d.alamat,
      phone: d.telepon,
      count: d.magang ? d.magang.length : 0
    })) || [];

    return NextResponse.json({
      stats: {
        totalSiswa: totalSiswa || 0,
        totalDudi: totalDudi || 0,
        siswaMagang: siswaMagang || 0,
        logbookHariIni: logbookHariIni || 0
      },
      magangTerbaru: magangTerbaru || [],
      logbookTerbaru: logbookTerbaru || [],
      dudiAktif: formattedDudi
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
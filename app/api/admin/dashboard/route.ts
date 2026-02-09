import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // --- 1. Statistik Utama ---
    // Hitung total siswa magang (Status 'berlangsung' atau 'aktif')
    const { count: siswaMagang, error: errSiswa } = await supabase
      .from("magang")
      .select("*", { count: "exact", head: true })
      .in("status", ["berlangsung", "aktif"]); // Pastikan cover variasi status

    // Statistik lain
    const { count: totalSiswa } = await supabase.from("siswa").select("*", { count: "exact", head: true });
    const { count: totalDudi } = await supabase.from("dudi").select("*", { count: "exact", head: true }).eq("is_deleted", false);
    const { count: logbookHariIni } = await supabase.from("logbook").select("*", { count: "exact", head: true }).eq("tanggal", today);

    // --- 2. Chart Guru Pembimbing ---
    // Ambil semua data magang yang sudah ada guru pembimbingnya
    const { data: magangGuru } = await supabase
      .from("magang")
      .select(`
        id,
        guru:guru_id (nama)
      `)
      .not("guru_id", "is", null);

    // Hitung manual jumlah siswa per guru
    const guruStats: Record<string, number> = {};
    let totalSiswaChart = 0;

    magangGuru?.forEach((item: any) => {
      if (item.guru?.nama) {
        const namaGuru = item.guru.nama;
        guruStats[namaGuru] = (guruStats[namaGuru] || 0) + 1;
        totalSiswaChart++;
      }
    });

    // Format ke array untuk Recharts
    const guruChartData = Object.entries(guruStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value) // Urutkan terbanyak
      .slice(0, 5); // Ambil Top 5

    // --- 3. Magang Terbaru ---
    const { data: magangTerbaru } = await supabase
      .from("magang")
      .select(`id, status, tanggal_mulai, tanggal_selesai, siswa:siswa_id(nama), dudi:dudi_id(nama_perusahaan)`)
      .order("created_at", { ascending: false })
      .limit(5);

    // --- 4. Logbook Terbaru ---
    const { data: logbookTerbaru } = await supabase
      .from("logbook")
      .select(`id, kegiatan, tanggal, status_verifikasi, kendala, magang(siswa(nama))`)
      .order("created_at", { ascending: false })
      .limit(3);

    // --- 5. DUDI Aktif ---
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
        logbookHariIni: logbookHariIni || 0,
        totalSiswaBimbingan: totalSiswaChart // Tambahan untuk angka tengah chart
      },
      magangTerbaru: magangTerbaru || [],
      logbookTerbaru: logbookTerbaru || [],
      dudiAktif: formattedDudi,
      guruChartData: guruChartData 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
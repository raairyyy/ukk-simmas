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
    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (guruError || !guru) {
      return NextResponse.json({ error: "Guru profile not found" }, { status: 404 });
    }

    const guruId = guru.id;

    // --- A. STATISTIK UTAMA ---

    // 1. Total Siswa Bimbingan
    const { count: totalSiswa } = await supabase
      .from("magang")
      .select("*", { count: "exact", head: true })
      .eq("guru_id", guruId);

    // 2. Total DUDI Partner (Unik)
    const { data: dudiRaw } = await supabase
      .from("magang")
      .select("dudi_id")
      .eq("guru_id", guruId);
    
    const uniqueDudiIds = Array.from(new Set(dudiRaw?.map((item) => item.dudi_id).filter(id => id !== null)));
    const totalDudi = uniqueDudiIds.length;

    // 3. Siswa Magang Aktif
    const { count: siswaAktif } = await supabase
      .from("magang")
      .select("*", { count: "exact", head: true })
      .eq("guru_id", guruId)
      .eq("status", "berlangsung"); // Pastikan string 'Aktif' sesuai dengan enum database Anda (case-sensitive)

    // 4. Logbook Hari Ini (FIXED)
    // Ambil tanggal hari ini format YYYY-MM-DD (sesuai tipe data 'date' di postgres)
    const todayDate = new Date().toISOString().split("T")[0]; 

    const { count: logbookHariIni } = await supabase
      .from("logbook") // Target tabel Logbook
      .select("id, magang!inner(guru_id)", { count: "exact", head: true }) // !inner untuk filter relasi
      .eq("magang.guru_id", guruId) // Filter hanya logbook dari siswa bimbingan guru ini
      .eq("tanggal", todayDate); // Filter persis tanggal hari ini

    
    // --- B. DATA LIST (Opsional: Jika dashboard butuh list juga) ---

    // 1. Magang Terbaru
    const { data: magangTerbaru } = await supabase
      .from("magang")
      .select(`
        id, status, tanggal_mulai, tanggal_selesai,
        siswa:siswa_id (nama),
        dudi:dudi_id (nama_perusahaan)
      `)
      .eq("guru_id", guruId)
      .order("created_at", { ascending: false })
      .limit(5);

    // 2. DUDI Aktif
    let dudiAktifList: any[] = [];
    if (uniqueDudiIds.length > 0) {
      const { data: dudiDetails } = await supabase
        .from("dudi")
        .select("id, nama_perusahaan, alamat, telepon")
        .in("id", uniqueDudiIds)
        .limit(5);

      if (dudiDetails) {
         dudiAktifList = await Promise.all(dudiDetails.map(async (d: any) => {
            const { count } = await supabase
               .from("magang")
               .select("*", { count: "exact", head: true })
               .eq("guru_id", guruId)
               .eq("dudi_id", d.id)
               .eq("status", "Aktif");
            return { ...d, jumlah_siswa: count || 0 };
         }));
      }
    }

    return NextResponse.json({
      stats: {
        totalSiswa: totalSiswa || 0,
        totalDudi: totalDudi || 0,
        siswaAktif: siswaAktif || 0,
        logbookHariIni: logbookHariIni || 0 // Sekarang akan 0 jika tabel logbook kosong
      },
      magangTerbaru: magangTerbaru || [],
      dudiAktif: dudiAktifList || []
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Init Supabase tanpa Auth (Service Role) agar bisa baca semua data user
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // 1. Ambil SEMUA Data Siswa
    const { data: allSiswa, error: siswaError } = await supabase
      .from("siswa")
      .select("id, nama, kelas, jurusan, nis")
      .order("nama", { ascending: true });

    if (siswaError) throw siswaError;

    // 2. Ambil ID siswa yang SEDANG SIBUK (Status Aktif)
    // Logika: Kita hanya perlu tahu siapa yang TIDAK BOLEH dipilih.
    // Yang tidak boleh dipilih adalah yang statusnya: 'pending', 'diterima', atau 'berlangsung'.
    const { data: busyStudents, error: magangError } = await supabase
      .from("magang")
      .select("siswa_id")
      .in("status", ["pending", "diterima", "berlangsung"]);

    if (magangError) throw magangError;

    // Masukkan ID siswa sibuk ke dalam Set (agar pencarian cepat)
    // Pastikan filter null value jika ada data sampah
    const busyIds = new Set(
      busyStudents?.map((m) => m.siswa_id).filter((id) => id !== null)
    );

    // 3. FILTERING
    // Konsep: Ambil siswa jika ID-nya TIDAK ADA di dalam daftar 'busyIds'
    const availableSiswa = allSiswa.filter((siswa) => !busyIds.has(siswa.id));

    // --- DEBUGGING (Cek Terminal VSCode Anda saat refresh halaman) ---
    console.log("=== DEBUG API AVAILABLE ===");
    console.log("Total Siswa Sekolah:", allSiswa.length);
    console.log("Siswa Sedang Magang (Busy):", busyIds.size);
    console.log("Siswa Available (Hasil):", availableSiswa.length);
    // ----------------------------------------------------------------

    return NextResponse.json({ data: availableSiswa });
  } catch (err: any) {
    console.error("Error API Available:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // 1. Ambil semua data siswa (Asumsi tabel 'siswa' ada kolom id, nama, kelas, jurusan)
    const { data: allSiswa, error: siswaError } = await supabase
      .from("siswa")
      .select("id, nama, kelas, jurusan, nis")
      .order("nama", { ascending: true });

    if (siswaError) throw siswaError;

    // 2. Ambil semua ID siswa yang SUDAH terdaftar di tabel magang
    const { data: activeMagang, error: magangError } = await supabase
      .from("magang")
      .select("siswa_id");

    if (magangError) throw magangError;

    // Buat array ID siswa yang sudah magang
    const registeredSiswaIds = activeMagang.map((m) => m.siswa_id);

    // 3. Filter: Hanya ambil siswa yang ID-nya TIDAK ADA di registeredSiswaIds
    const availableSiswa = allSiswa.filter(
      (siswa) => !registeredSiswaIds.includes(siswa.id)
    );

    return NextResponse.json({ data: availableSiswa });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
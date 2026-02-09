// app/api/guru/dashboard/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const guruId = searchParams.get("guru_id")

    if (!guruId) {
      return NextResponse.json({ error: "guru_id is required" }, { status: 400 })
    }

    // 1. Total siswa yang dibimbing guru ini
    const { count: totalSiswa } = await supabase
      .from("magang")
      .select("id", { count: "exact" })
      .eq("guru_id", Number(guruId))

    // 2. Total DUDI partner yang memiliki siswa magang guru ini
// 2. Total DUDI partner yang memiliki siswa magang guru ini
// Ambil semua dudi_id guru ini
const { data: dudiData, error: dudiError } = await supabase
  .from("magang")
  .select("dudi_id")
  .eq("guru_id", Number(guruId))
  .not("dudi_id", "is", null)

if (dudiError) throw dudiError

// Hitung jumlah DUDI unik di JS
const dudi = Array.from(new Set(dudiData?.map((row) => row.dudi_id))).length



    // 3. Total siswa magang aktif (status misal 'aktif')
    const { count: aktif } = await supabase
      .from("magang")
      .select("id", { count: "exact" })
      .eq("guru_id", Number(guruId))
      .eq("status", "aktif")  // pastikan status sesuai enum

    // 4. Logbook hari ini (misal logbook di tabel terpisah, atau hitung magang yang update hari ini)
    // contoh: hitung magang yang updated hari ini
    const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
    const { count: logbook } = await supabase
      .from("magang")
      .select("id", { count: "exact" })
      .eq("guru_id", Number(guruId))
      .gte("updated_at", today + "T00:00:00.000Z")
      .lte("updated_at", today + "T23:59:59.999Z")

    return NextResponse.json({
      totalSiswa: totalSiswa || 0,
      dudi: dudi || 0,
      aktif: aktif || 0,
      logbook: logbook || 0
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}

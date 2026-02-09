import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const guruId = searchParams.get("guru_id");

    if (!guruId) {
      return NextResponse.json({ error: "guru_id is required" }, { status: 400 });
    }

    const guruIdNum = Number(guruId);

    // 1. Total siswa
    const { count: totalSiswa } = await supabase
      .from("magang")
      .select("id", { count: "exact" })
      .eq("guru_id", guruIdNum);

    // 2. Total DUDI unik
    const { data: dudiData } = await supabase
      .from("magang")
      .select("dudi_id")
      .eq("guru_id", guruIdNum)
      .not("dudi_id", "is", null);

    const dudi = Array.from(new Set(dudiData?.map((row: any) => row.dudi_id))).length;

    // 3. Siswa magang aktif
    const { count: aktif } = await supabase
      .from("magang")
      .select("id", { count: "exact" })
      .eq("guru_id", guruIdNum)
      .eq("status", "berlangsung");

    // 4. Logbook hari ini
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const { count: logbook } = await supabase
      .from("magang")
      .select("id", { count: "exact" })
      .eq("guru_id", guruIdNum)
      .gte("updated_at", today + "T00:00:00.000Z")
      .lte("updated_at", today + "T23:59:59.999Z");

    return NextResponse.json({
      totalSiswa: totalSiswa || 0,
      dudi: dudi || 0,
      aktif: aktif || 0,      // rename jadi 'aktif'
      logbook: logbook || 0
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}

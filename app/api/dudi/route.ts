import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables not set");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  const { data, error } = await supabase
    .from("dudi")
    .select(`
      id,
      nama_perusahaan,
      alamat,
      email,
      telepon,
      penanggung_jawab,
      status,
      magang (
        id,
        status
      )
    `)
    .eq("is_deleted", false)
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Hitung jumlah siswa magang aktif
  const formatted = data.map(d => ({
    ...d,
    total_siswa_magang: d.magang
      ? d.magang.filter((m: any) => m.status === "berlangsung").length
      : 0
  }));

  return NextResponse.json({ data: formatted });
}

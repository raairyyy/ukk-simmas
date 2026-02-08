import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 1. Dapatkan magang_id siswa
    const { data: magang } = await supabase
      .from("magang")
      .select("id")
      .eq("siswa_id", decoded.id)
      .single();

    if (!magang) return NextResponse.json({ data: [] });

    // 2. Ambil logbook
    const { data, error } = await supabase
      .from("logbook")
      .select("*")
      .eq("magang_id", magang.id)
      .order("tanggal", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = jwt.verify(token!, process.env.JWT_SECRET!);

    // Cari magang_id
    const { data: magang } = await supabase
      .from("magang")
      .select("id")
      .eq("siswa_id", decoded.id)
      .single();

    const { error } = await supabase.from("logbook").insert({
      magang_id: magang?.id,
      tanggal: body.tanggal,
      kegiatan: body.kegiatan,
      kendala: body.kendala,
      file: body.file,
      status_verifikasi: 'menunggu' // Sesuai default Gambar 24
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
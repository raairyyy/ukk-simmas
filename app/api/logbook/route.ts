import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// =======================
// GET: ambil jurnal siswa
// =======================
export async function GET() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 1️⃣ Ambil siswa berdasarkan users.id
    const { data: siswa, error: siswaError } = await supabase
      .from("siswa")
      .select("id")
      .eq("user_id", decoded.id)
      .single();

    if (siswaError || !siswa) {
      return NextResponse.json({ data: [] });
    }

    // 2️⃣ Ambil magang berdasarkan siswa.id
    const { data: magang, error: magangError } = await supabase
      .from("magang")
      .select("id")
      .eq("siswa_id", siswa.id)
      .single();

    if (magangError || !magang) {
      return NextResponse.json({ data: [] });
    }

    // 3️⃣ Ambil logbook berdasarkan magang.id
    const { data: logbook, error } = await supabase
      .from("logbook")
      .select("*")
      .eq("magang_id", magang.id)
      .order("tanggal", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data: logbook });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// =======================
// POST: tambah jurnal
// =======================
// =======================
// POST: tambah jurnal
// =======================
export async function POST(req: Request) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const body = await req.json();

    if (!body.tanggal || !body.kegiatan) {
      return NextResponse.json(
        { error: "Tanggal dan kegiatan wajib diisi" },
        { status: 400 }
      );
    }

    // 1️⃣ Ambil siswa
    const { data: siswa } = await supabase
      .from("siswa")
      .select("id")
      .eq("user_id", decoded.id)
      .single();

    if (!siswa) {
      return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });
    }

    // 2️⃣ Ambil magang
    const { data: magang } = await supabase
      .from("magang")
      .select("id")
      .eq("siswa_id", siswa.id)
      .single();

    if (!magang) {
      return NextResponse.json({ error: "Magang tidak ditemukan" }, { status: 404 });
    }

    // 3️⃣ Insert logbook
    const { error } = await supabase.from("logbook").insert({
      magang_id: magang.id,
      tanggal: body.tanggal,
      kegiatan: body.kegiatan,
      kendala: body.kendala,
      file: body.file,
      status_verifikasi: "pending", // HARUS cocok enum
    });

    if (error) {
      console.error("INSERT LOGBOOK ERROR:", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API LOGBOOK ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


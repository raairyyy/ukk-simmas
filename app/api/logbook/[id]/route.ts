import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// =======================
// DELETE: hapus jurnal
// =======================
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const jurnalId = params.id;

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

    // 3️⃣ Hapus jurnal (VALIDASI PEMILIK DATA)
    const { error } = await supabase
      .from("logbook")
      .delete()
      .eq("id", jurnalId)
      .eq("magang_id", magang.id);

    if (error) {
      console.error("DELETE LOGBOOK ERROR:", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE LOGBOOK API ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// =======================
// PUT: update jurnal
// =======================
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const jurnalId = params.id;
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
      return NextResponse.json(
        { error: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }

    // 2️⃣ Ambil magang
    const { data: magang } = await supabase
      .from("magang")
      .select("id")
      .eq("siswa_id", siswa.id)
      .single();

    if (!magang) {
      return NextResponse.json(
        { error: "Magang tidak ditemukan" },
        { status: 404 }
      );
    }

    // 3️⃣ Update jurnal (VALIDASI PEMILIK DATA)
    const { error } = await supabase
      .from("logbook")
      .update({
        tanggal: body.tanggal,
        kegiatan: body.kegiatan,
        kendala: body.kendala || null,
        file: body.file || null,
      })
      .eq("id", jurnalId)
      .eq("magang_id", magang.id)
      .eq("status_verifikasi", "pending"); // ❗ hanya boleh edit pending

    if (error) {
      console.error("UPDATE LOGBOOK ERROR:", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("UPDATE LOGBOOK API ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}


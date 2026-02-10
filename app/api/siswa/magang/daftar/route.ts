import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    // 1. Cek Token Login
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { dudi_id } = await req.json();

    if (!dudi_id) {
      return NextResponse.json({ error: "ID DUDI wajib diisi" }, { status: 400 });
    }

    // 2. Ambil ID Siswa dari tabel siswa berdasarkan user_id token
    const { data: siswa } = await supabase
      .from("siswa")
      .select("id")
      .eq("user_id", decoded.id)
      .single();

    if (!siswa) {
      return NextResponse.json({ error: "Data siswa tidak ditemukan" }, { status: 404 });
    }

    // 3. Cek Duplikat (Apakah sudah daftar di perusahaan ini?)
    const { data: existing } = await supabase
      .from("magang")
      .select("id")
      .eq("siswa_id", siswa.id)
      .eq("dudi_id", dudi_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Anda sudah mendaftar di perusahaan ini" }, { status: 400 });
    }

    // 4. Lakukan Insert (Trigger DB akan otomatis cek limit 3)
    const { error } = await supabase
      .from("magang")
      .insert([{
        siswa_id: siswa.id,
        dudi_id: dudi_id,
        status: "pending", // Status awal wajib 'pending'
        created_at: new Date()
      }]);

    if (error) {
      // Tangkap pesan error dari trigger PostgreSQL
      if (error.message.includes("Batas maksimal")) {
        return NextResponse.json({ error: "Kuota pendaftaran habis (Max 3 DUDI)" }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, message: "Pendaftaran berhasil diajukan" });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
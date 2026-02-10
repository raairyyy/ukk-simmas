import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PUT(req: Request) {
  try {
    const { id, status, catatan_guru } = await req.json();

    // 1. Validasi Input
    if (!id || !status) {
      return NextResponse.json({ error: "ID dan Status wajib diisi" }, { status: 400 });
    }

    // 2. Update Database
    const { data, error } = await supabase
      .from("logbook")
      .update({
        status_verifikasi: status, // Pastikan nilai enum sesuai ('disetujui', 'ditolak', 'pending')
        catatan_guru: catatan_guru,
        updated_at: new Date()
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase Update Error:", error); // Log detail error ke terminal server
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
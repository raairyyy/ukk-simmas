import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Mengambil data pertama yang ditemukan
    const { data, error } = await supabase
      .from("school_settings")
      .select("*")
      .limit(1)
      .maybeSingle(); // Menggunakan maybeSingle agar tidak error jika tabel kosong

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    // Pisahkan ID agar tidak ikut diupdate di kolom update_at atau lainnya
    const { id, created_at, updated_at, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID Pengaturan tidak ditemukan" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("school_settings")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id) 
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
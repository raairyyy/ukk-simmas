import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- READ (Ambil Data) ---
export async function GET(req: Request) {
  try {
    // Ambil guruId dari query params misalnya ?guru_id=1
    const url = new URL(req.url);
    const guruId = url.searchParams.get("guru_id");

    let query = supabase
      .from("magang")
      .select(`
        *,
        siswa:siswa_id (*),
        guru:guru_id (*),
        dudi:dudi_id (*)
      `)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (guruId) {
      query = query.eq("guru_id", guruId);
    }

    const { data, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// --- CREATE (Tambah Data) ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Status default menjadi 'Aktif' sesuai ketentuan
    const { data, error } = await supabase
      .from("magang")
      .insert([{ ...body, status: "Aktif" }])
      .select();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- UPDATE (Ubah Data & Input Nilai) ---
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    const { data, error } = await supabase
      .from("magang")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- DELETE (Hapus Data) ---
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Menggunakan Soft Delete sesuai pola project Anda
    const { error } = await supabase
      .from("magang")
      .update({ is_deleted: true })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- GET: Ambil Data Magang KHUSUS Guru yang Login ---
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // 1. Cari ID Guru berdasarkan user_id login
    const { data: guru, error: guruError } = await supabase
      .from("guru")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (guruError || !guru) {
      return NextResponse.json({ error: "Guru profile not found" }, { status: 404 });
    }

    // 2. Ambil data magang yang guru_id-nya sesuai
    const { data, error } = await supabase
      .from("magang")
      .select(`
        *,
        siswa:siswa_id (id, nama, nis, kelas, jurusan),
        dudi:dudi_id (id, nama_perusahaan, alamat),
        guru:guru_id (id, nama, nip)
      `)
      .eq("guru_id", guru.id) // Filter Wajib
      //.eq("is_deleted", false) // Jika ada soft delete
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data, guruId: guru.id }); // Kembalikan guruId untuk dipakai di form tambah
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- POST: Tambah Siswa Magang Baru ---
// --- POST: Tambah Siswa Magang Baru ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validasi Field Wajib
    if (!body.siswa_id || !body.dudi_id || !body.guru_id) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("magang")
      .insert([{
        ...body,
        status: "berlangsung", // DEFAULT STATUS SESUAI ENUM DB
        created_at: new Date(),
        updated_at: new Date()
      }])
      .select();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- PUT: Edit Status & Nilai ---
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("magang")
      .update({
        ...updateData, // Bisa update status, nilai_akhir, tanggal
        updated_at: new Date()
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- DELETE: Hapus Data Magang ---
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    // Hard Delete (atau ganti jadi update is_deleted=true jika pakai soft delete)
    const { error } = await supabase
      .from("magang")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
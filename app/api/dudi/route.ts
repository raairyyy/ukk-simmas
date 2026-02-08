import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


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
      *,
      magang ( id, status )
    `)
    // Hapus filter is_deleted agar data yang di-soft delete tetap masuk ke list
    .order("id", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const formatted = data.map(d => ({
    ...d,
    total_siswa_magang: d.magang
      ? d.magang.filter((m: any) => m.status === "berlangsung" || m.status === "aktif").length
      : 0
  }));

  return NextResponse.json({ data: formatted });
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // ===== VALIDASI REQUIRED =====
    if (
      !body.nama_perusahaan ||
      !body.alamat ||
      !body.telepon ||
      !body.email ||
      !body.penanggung_jawab ||
      !body.status
    ) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      )
    }

    // ===== VALIDASI EMAIL =====
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      )
    }

    // ===== VALIDASI TELEPON =====
    const phoneRegex = /^[0-9+\- ]+$/
    if (!phoneRegex.test(body.telepon)) {
      return NextResponse.json(
        { error: "Format nomor telepon tidak valid" },
        { status: 400 }
      )
    }

    // ===== CEK NAMA PERUSAHAAN DUPLIKAT =====
    const { data: existing } = await supabase
      .from("dudi")
      .select("id")
      .eq("nama_perusahaan", body.nama_perusahaan)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: "Nama perusahaan sudah terdaftar" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("dudi")
      .insert([body])
      .select()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}


export async function PUT(req: Request) {
  try {
    const body = await req.json()

    const { data, error } = await supabase
      .from("dudi")
      .update({
        nama_perusahaan: body.nama_perusahaan,
        alamat: body.alamat,
        telepon: body.telepon,
        email: body.email,
        penanggung_jawab: body.penanggung_jawab,
        status: body.status,
        updated_at: new Date()
      })
      .eq("id", body.id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, restore } = await req.json()

    const { error } = await supabase
      .from("dudi")
      .update({ is_deleted: !restore ? true : false })
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}


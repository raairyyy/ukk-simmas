import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("school_settings")
    .select("*")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    const { error } = await supabase
      .from("school_settings")
      .update({
        logo_url: body.logo_url,
        nama_sekolah: body.nama_sekolah,
        alamat: body.alamat,
        telepon: body.telepon,
        email: body.email,
        website: body.website,
        kepala_sekolah: body.kepala_sekolah,
        npsn: body.npsn,
        updated_at: new Date()
      })
      .eq("id", 1) // pakai 1 row global

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

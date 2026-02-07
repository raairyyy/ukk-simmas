import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs"; // Import library-nya

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { name, email, role, password, verified } = await req.json();

    // 1. Proses Hashing Password di sini
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Simpan ke database (Gunakan password yang sudah di-hash)
    const { data, error } = await supabase.from("users").insert([
      {
        name,
        email,
        role,
        password: hashedPassword, // Simpan yang sudah di-hash
        email_verified_at: verified ? new Date().toISOString() : null,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ message: "User berhasil dibuat" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
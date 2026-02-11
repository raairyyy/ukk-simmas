import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const token = cookies().get("token")?.value
if (!token) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}



const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)

const { data: loginUser } = await supabase
  .from("users")
  .select("role")
  .eq("id", decoded.id)
  .single()

if (!loginUser) {
  return NextResponse.json({ error: "User login tidak ditemukan" }, { status: 404 })
}


    const body = await req.json();
    const { 
      name, email, role, password, verified, 
      // Field khusus siswa (opsional)
      nis, kelas, jurusan, guru_id, alamat, telepon
    } = body;

    // 1. Validasi Input Dasar
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Data dasar wajib diisi" }, { status: 400 });
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert ke tabel USERS
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          role,
          password: hashedPassword,
          email_verified_at: verified ? new Date().toISOString() : null,
        },
      ])
      .select()
      .single();

    if (userError) throw userError;
    if (loginUser.role === "admin" && role === "admin") {
  return NextResponse.json(
    { error: "Admin tidak diizinkan membuat user dengan role admin" },
    { status: 403 }
  )
}


    // 4. Jika Role SISWA, Insert ke tabel SISWA & MAGANG (Untuk Guru Pembimbing)
// setelah users berhasil dibuat
if (role === "siswa") {
  await supabase
    .from("siswa")
    .update({
      nis,
      kelas,
      jurusan,
      guru_id: guru_id ? Number(guru_id) : null,
      alamat: alamat || null,
      telepon: telepon || null
    })
    .eq("user_id", user.id);
}




    return NextResponse.json({ message: "User berhasil dibuat" }, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
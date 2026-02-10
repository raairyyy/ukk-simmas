import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, email, role, password, verified, 
      // Field khusus siswa (opsional)
      nis, kelas, jurusan, guru_id 
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

    // 4. Jika Role SISWA, Insert ke tabel SISWA & MAGANG (Untuk Guru Pembimbing)
    if (role === 'siswa') {
      // Validasi input siswa
      if (!nis || !kelas || !jurusan) {
        // Rollback manual (hapus user yg baru dibuat jika data siswa kurang)
        await supabase.from("users").delete().eq("id", user.id);
        return NextResponse.json({ error: "Data siswa (NIS, Kelas, Jurusan) wajib diisi" }, { status: 400 });
      }

      // Insert ke tabel SISWA
      const { data: siswaData, error: siswaError } = await supabase
        .from("siswa")
        .insert([{
          user_id: user.id,
          nama: name,
          nis,
          kelas,
          jurusan
        }])
        .select()
        .single();

      if (siswaError) {
        await supabase.from("users").delete().eq("id", user.id); // Rollback
        throw siswaError;
      }

      // Jika ada Guru Pembimbing, buat relasi di tabel MAGANG
      // (Asumsi: hubungan siswa-guru ada di tabel magang)
      if (guru_id) {
        const { error: magangError } = await supabase
          .from("magang")
          .insert([{
            siswa_id: siswaData.id,
            guru_id: parseInt(guru_id), // Pastikan format integer
            status: 'pending' // Default status
          }]);
          
        if (magangError) console.error("Gagal set guru pembimbing:", magangError);
      }
    }

    return NextResponse.json({ message: "User berhasil dibuat" }, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Ambil data user + relasi guru
    const { data: user, error } = await supabase
      .from("users")
      .select(`
        id,
        name,
        email,
        role,
        guru(id)
      `)
      .eq("id", decoded.id)
      .single(); // single user

    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Akses id guru dari array relasi
    const id_guru = Array.isArray(user.guru) ? user.guru[0]?.id || null : null;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        id_guru,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

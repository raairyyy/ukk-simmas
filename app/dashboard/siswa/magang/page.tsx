"use client"

import { useEffect, useState } from "react"
import { 
  User, Building2, Calendar, MapPin, 
  CheckCircle2, Star, Bell, LogOut, Search,
  GraduationCap, Hash, LayoutGrid
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SharedHeader } from "@/components/shared-header"

export default function StatusMagangSiswa() {
  const [magangData, setMagangData] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfileAndMagang()
  }, [])

  const fetchProfileAndMagang = async () => {
    setLoading(true)
    try {
      const profileRes = await fetch("/api/auth/me")
      const profileJson = await profileRes.json()
      setUserData(profileJson.user)

      const magangRes = await fetch("/api/magang")
      const magangJson = await magangRes.json()
      
      const myMagang = magangJson.data.find((m: any) => m.siswa_id === profileJson.user.id)
      setMagangData(myMagang)
    } catch (err) {
      console.error("Gagal mengambil data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HEADER (Gambar 12 & 28) */}
      <SharedHeader />

      {/* CONTENT BODY (Gambar 28) */}
      <main className="p-10 max-w-[1400px] mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Status Magang Saya</h1>

        {loading ? (
          <p className="text-slate-400 font-medium animate-pulse">Memuat data magang...</p>
        ) : magangData ? (
          <Card className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden">
            <CardContent className="p-12 space-y-14">
              
              {/* Seksi 1: Data Magang (Siswa) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
                <div className="space-y-10">
                  <div className="flex items-center gap-3 text-[#00A9D8] mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg"><User size={20} strokeWidth={2.5} /></div>
                    <h3 className="font-bold text-xl text-slate-800 tracking-tight">Data Magang</h3>
                  </div>
                  
                  <div className="space-y-8 ml-2">
                    <div>
                      <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Nama Siswa</p>
                      <p className="text-xl font-bold text-slate-700">{magangData.siswa?.name || "Ahmad Rizki"}</p>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Kelas</p>
                      <p className="text-xl font-bold text-slate-700">{magangData.siswa?.kelas || "XII RPL 1"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-10 pt-12 md:pt-16">
                  <div className="space-y-8 ml-2">
                    <div>
                      <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">NIS</p>
                      <p className="text-xl font-bold text-slate-700">{magangData.siswa?.nis || "2024001"}</p>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Jurusan</p>
                      <p className="text-xl font-bold text-slate-700">{magangData.siswa?.jurusan || "Rekayasa Perangkat Lunak"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seksi 2: Informasi Perusahaan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10 border-t border-slate-100 pt-12">
                <div className="space-y-10 ml-2">
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Building2 size={16} />
                        <p className="text-[13px] font-bold uppercase tracking-[0.15em]">Nama Perusahaan</p>
                      </div>
                      <p className="text-xl font-bold text-slate-700">{magangData.dudi?.nama_perusahaan || "PT Kreatif Teknologi"}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Calendar size={16} />
                        <p className="text-[13px] font-bold uppercase tracking-[0.15em]">Periode Magang</p>
                      </div>
                      <p className="text-xl font-bold text-slate-700 uppercase tracking-tight">
                        1 Feb 2024 s.d 1 Mei 2024
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-10 ml-2">
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <MapPin size={16} />
                        <p className="text-[13px] font-bold uppercase tracking-[0.15em]">Alamat Perusahaan</p>
                      </div>
                      <p className="text-xl font-bold text-slate-700">{magangData.dudi?.alamat || "Jakarta"}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <CheckCircle2 size={16} />
                        <p className="text-[13px] font-bold uppercase tracking-[0.15em]">Status</p>
                      </div>
                      <Badge className="bg-[#DCFCE7] text-[#166534] border-none px-4 py-1.5 rounded-lg font-bold text-sm">
                        {magangData.status || "Aktif"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seksi 3: Nilai Akhir */}
              <div className="border-t border-slate-100 pt-12 ml-2">
                <div className="flex items-center gap-2 text-slate-400 mb-3">
                  <Star size={18} fill="currentColor" className="text-slate-300" />
                  <p className="text-[13px] font-bold uppercase tracking-[0.15em]">Nilai Akhir</p>
                </div>
                <h2 className="text-[96px] font-black text-slate-800 leading-none tracking-tighter">
                  {magangData.nilai_akhir || "88"}
                </h2>
              </div>

            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-sm rounded-[32px] bg-white p-20 text-center">
             <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                  <Building2 size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Data Magang Belum Tersedia</h3>
                <p className="text-slate-500 font-medium">Informasi magang Anda akan muncul di sini setelah Anda terdaftar dan diverifikasi oleh pihak sekolah.</p>
             </div>
          </Card>
        )}
      </main>
    </div>
  )
}
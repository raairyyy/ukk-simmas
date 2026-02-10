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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/siswa/magang")
      .then(res => res.json())
      .then(data => {
        setMagangData(data.data) // data bisa object atau null
        setLoading(false)
      })
  }, [])

  // --- KOMPONEN LABEL & VALUE (Reusable) ---
  function InfoField({ label, value, isLarge = false }: { label: string, value?: string | null, isLarge?: boolean }) {
    return (
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-400">{label}</p>
        <p className={`font-bold text-slate-800 ${isLarge ? "text-lg" : "text-base"}`}>
          {value || "-"}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SharedHeader />

      <main className="p-10 max-w-[1600px] mx-auto space-y-8">
        
        {/* JUDUL HALAMAN */}
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Status Magang Saya</h1>

        {loading ? (
          <div className="space-y-4 animate-pulse">
             <div className="h-64 bg-slate-200 rounded-[24px]"></div>
          </div>
        ) : magangData ? (
          <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden p-2">
            <CardContent className="p-8 space-y-8">
              
              {/* HEADER DATA MAGANG */}
              <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                 <div className="p-2 bg-blue-50 text-[#00A9D8] rounded-xl">
                    <User size={20} />
                 </div>
                 <h3 className="text-lg font-bold text-slate-800">Data Magang</h3>
              </div>

              {/* GRID DATA UTAMA (LAYOUT SEPERTI GAMBAR) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                 
                 {/* KOLOM KIRI */}
                 <div className="space-y-8">
                    <InfoField label="Nama Siswa" value={magangData?.siswa?.nama} isLarge />
                    <InfoField label="Kelas" value={magangData?.siswa?.kelas} />
                    <div className="pt-4">
                       <InfoField label="Nama Perusahaan" value={magangData?.dudi?.nama_perusahaan} />
                    </div>
                    <InfoField 
                       label="Periode Magang" 
                       value={magangData?.tanggal_mulai && magangData?.tanggal_selesai 
                          ? `${new Date(magangData.tanggal_mulai).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })} s.d ${new Date(magangData.tanggal_selesai).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}`
                          : "-"
                       } 
                    />
                 </div>

                 {/* KOLOM KANAN */}
                 <div className="space-y-8">
                    <InfoField label="NIS" value={magangData?.siswa?.nis} />
                    <InfoField label="Jurusan" value={magangData?.siswa?.jurusan} />
                    <div className="pt-4">
                       <InfoField label="Alamat Perusahaan" value={magangData?.dudi?.alamat} />
                    </div>
                    
                    {/* STATUS BADGE */}
                    <div className="space-y-1">
                       <p className="text-xs font-bold text-slate-400">Status</p>
                       <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">
                          {magangData?.status || "Aktif"}
                       </Badge>
                    </div>
                 </div>

              </div>

              {/* NILAI AKHIR (BAGIAN BAWAH) */}
              <div className="border-t border-slate-50 pt-6 mt-2">
                 <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-slate-300"/> Nilai Akhir
                    </p>
                    <p className="text-4xl font-extrabold text-slate-800">
                       {magangData?.nilai_akhir ?? "-"}
                    </p>
                 </div>
              </div>

            </CardContent>
          </Card>
        ) : (
          /* EMPTY STATE */
          <Card className="border-none shadow-sm rounded-[24px] bg-white p-20 text-center">
              <div className="max-w-md mx-auto space-y-4">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                    <Building2 size={40} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800">Data Magang Belum Tersedia</h3>
                 <p className="text-slate-500 font-medium text-sm">
                    Informasi magang Anda akan muncul di sini setelah Anda terdaftar dan diverifikasi oleh pihak sekolah.
                 </p>
              </div>
          </Card>
        )}

      </main>
    </div>
  )
}
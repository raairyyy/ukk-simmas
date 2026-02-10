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
  fetch("/api/siswa/magang")
    .then(res => res.json())
    .then(data => {
      setMagangData(data.data) // data bisa object atau null
      setLoading(false)
    })
}, [])


  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) window.location.href = "/login"
  }
  
function InfoField({
  label,
  value,
  uppercase = false,
}: {
  label: string
  value?: string | null
  uppercase?: boolean
}) {
  return (
    <div className="space-y-2">
      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.15em]">
        {label}
      </p>
      <p
        className={`text-xl font-bold min-h-[28px] ${
          uppercase ? "uppercase" : ""
        } ${
          value && value !== "-" ? "text-slate-700" : "text-slate-300"
        }`}
      >
        {value || "-"}
      </p>
    </div>
  )
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
                <div className="space-y-10">
                  <div className="flex items-center gap-3 text-[#00A9D8]">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <User size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-xl text-slate-800 tracking-tight">
                      Data Magang
                    </h3>
                  </div>

                  <div className="space-y-8 ml-2">
                    <InfoField label="Nama Siswa" value={magangData?.siswa?.nama} />
                    <InfoField label="Kelas" value={magangData?.siswa?.kelas} />
                  </div>
                </div>

                <div className="space-y-8 ml-2 pt-10 md:pt-14">
                  <InfoField label="NIS" value={magangData?.siswa?.nis} />
                  <InfoField label="Jurusan" value={magangData?.siswa?.jurusan} />
                </div>
              </div>


              {/* Seksi 2: Informasi Perusahaan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12 border-t border-slate-100 pt-12">
                <div className="space-y-8 ml-2">
                  <InfoField
                    label="Nama Perusahaan"
                    value={magangData?.dudi?.nama_perusahaan}
                  />

                  <InfoField
                    label="Periode Magang"
                    uppercase
                    value={
                      magangData?.tanggal_mulai && magangData?.tanggal_selesai
                        ? `${new Date(magangData.tanggal_mulai).toLocaleDateString(
                            "id-ID"
                          )} s.d ${new Date(
                            magangData.tanggal_selesai
                          ).toLocaleDateString("id-ID")}`
                        : "-"
                    }
                  />
                </div>

                <div className="space-y-8 ml-2">
                  <InfoField
                    label="Alamat Perusahaan"
                    value={magangData?.dudi?.alamat}
                  />

                  <div className="space-y-2">
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                      Status
                    </p>
                    <Badge className="inline-flex bg-[#DCFCE7] text-[#166534] border-none px-4 py-1.5 rounded-lg font-bold min-h-[28px]">
                      {magangData?.status || "-"}
                    </Badge>
                  </div>
                </div>
              </div>


              {/* Seksi 3: Nilai Akhir */}
              <div className="border-t border-slate-100 pt-12 ml-2">
                <div className="flex items-center gap-2 text-slate-400 mb-3">
                  <Star size={18} fill="currentColor" className="text-slate-300" />
                  <p className="text-[13px] font-bold uppercase tracking-[0.15em]">
                    Nilai Akhir
                  </p>
                </div>

                <h2 className="text-[88px] md:text-[96px] font-black text-slate-800 leading-none">
                  {magangData?.nilai_akhir ?? "-"}
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
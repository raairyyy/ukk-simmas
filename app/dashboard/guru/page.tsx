"use client"

import { useEffect, useState } from "react"
import { 
  Users, Building2, GraduationCap, BookOpen, 
  MapPin, Phone, CalendarDays, CheckCircle2, Clock, XCircle 
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SharedHeader } from "@/components/shared-header"

export default function GuruDashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>({
    stats: { totalSiswa: 0, totalDudi: 0, siswaAktif: 0, logbookHariIni: 0 },
    magangTerbaru: [],
    logbookTerbaru: [], // Tambahkan state untuk logbook
    dudiAktif: []
  })

  // 1. Ambil User Login
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        setUserData(data.user)
      })
      .catch(err => console.error(err))
  }, [])

  // 2. Ambil Data Dashboard
  useEffect(() => {
    if (!userData?.id) return

    fetch(`/api/guru/dashboard?user_id=${userData.id}`)
      .then(res => res.json())
      .then(res => {
        if (!res.error) setDashboardData(res)
      })
      .catch(err => console.error(err))
  }, [userData])

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SharedHeader />

      <div className="p-10 max-w-[1680px] mx-auto space-y-10">
        <div>
          <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          {userData && <p className="text-slate-500 mt-2 text-sm font-medium">Selamat datang, Guru Pembimbing {userData.name}!</p>}
        </div>
        
        {/* STATISTIK CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          <StatCard title="Total Siswa" value={dashboardData.stats.totalSiswa} desc="Siswa bimbingan" icon={<Users className="text-[#0EA5E9]" />} />
          <StatCard title="DUDI Partner" value={dashboardData.stats.totalDudi} desc="Perusahaan mitra" icon={<Building2 className="text-[#0EA5E9]" />} />
          <StatCard title="Siswa Magang" value={dashboardData.stats.siswaAktif} desc="Sedang aktif magang" icon={<GraduationCap className="text-[#0EA5E9]" />} />
          <StatCard title="Logbook Hari Ini" value={dashboardData.stats.logbookHariIni} desc="Laporan masuk hari ini" icon={<BookOpen className="text-[#0EA5E9]" />} />
        </div>

        {/* LAYOUT UTAMA: KIRI (Magang + Logbook) & KANAN (DUDI) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          <div className="xl:col-span-2 space-y-8">
            {/* 1. MAGANG TERBARU */}
            <Card className="border-none shadow-sm rounded-[20px] overflow-hidden bg-white">
              <CardHeader className="pb-4 pt-8 px-8 border-b border-slate-50 mb-4">
                <CardTitle className="flex items-center gap-3 text-[19px] font-bold text-slate-800">
                  <GraduationCap className="text-[#0EA5E9] w-6 h-6" strokeWidth={2.5} />
                  Magang Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 px-8 pb-8">
                {dashboardData.magangTerbaru.length > 0 ? (
                  dashboardData.magangTerbaru.map((m: any) => (
                    <MagangItem 
                      key={m.id} 
                      name={m.siswa?.nama} 
                      dudi={m.dudi?.nama_perusahaan} 
                      date={`${formatDate(m.tanggal_mulai)} - ${formatDate(m.tanggal_selesai)}`} 
                      status={m.status} 
                    />
                  ))
                ) : (
                  <p className="text-sm text-slate-400 font-medium italic py-4 text-center">Belum ada data magang.</p>
                )}
              </CardContent>
            </Card>

            {/* 2. LOGBOOK TERBARU (YANG HILANG SEBELUMNYA) */}
            <Card className="border-none shadow-sm rounded-[20px] overflow-hidden bg-white">
              <CardHeader className="pb-4 pt-8 px-8 border-b border-slate-50 mb-4">
                <CardTitle className="flex items-center gap-3 text-[19px] font-bold text-slate-800">
                  <BookOpen className="text-[#65a30d] w-6 h-6" strokeWidth={2.5} />
                  Logbook Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 px-8 pb-8">
                {dashboardData.logbookTerbaru?.length > 0 ? (
                  dashboardData.logbookTerbaru.map((l: any) => (
                    <LogbookItem 
                      key={l.id} 
                      title={l.kegiatan} 
                      date={formatDate(l.tanggal)} 
                      status={l.status_verifikasi} 
                      kendala={l.kendala}
                    />
                  ))
                ) : (
                  <p className="text-sm text-slate-400 font-medium italic py-4 text-center">Belum ada logbook terbaru.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* KOLOM KANAN: DUDI AKTIF */}
          <div className="xl:col-span-1 h-full">
            <Card className="border-none shadow-sm rounded-[20px] bg-white h-full">
              <CardHeader className="pb-6 pt-8 px-8 border-b border-slate-50 mb-4">
                <CardTitle className="flex items-center gap-3 text-[19px] font-bold text-slate-800">
                  <Building2 className="text-orange-500 w-6 h-6" strokeWidth={2.5} />
                  DUDI Aktif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 px-8 pb-8">
                {dashboardData.dudiAktif.length > 0 ? (
                  dashboardData.dudiAktif.map((d: any) => (
                    <DudiItem 
                      key={d.id} 
                      name={d.nama_perusahaan} 
                      address={d.alamat} 
                      phone={d.telepon} 
                      count={d.jumlah_siswa} 
                    />
                  ))
                ) : (
                  <p className="text-sm text-slate-400 font-medium italic py-4 text-center">Belum ada DUDI aktif.</p>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}

// --- SUB-KOMPONEN UI ---

function StatCard({ title, value, desc, icon }: any) {
  return (
    <Card className="border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-[20px] bg-white hover:-translate-y-1 transition-transform duration-300 h-[180px] flex flex-col justify-center">
      <CardContent className="p-7 relative h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
            <div className="opacity-90 bg-slate-50 p-2 rounded-xl">{icon}</div>
        </div>
        <div>
          <h3 className="text-[40px] font-extrabold text-slate-800 leading-none">{value}</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">{desc}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function MagangItem({ name, dudi, date, status }: any) {
  const badgeColor = status === 'Aktif' 
    ? "bg-[#DCFCE7] text-[#16A34A]" 
    : "bg-slate-100 text-slate-500";

  return (
    <div className="flex items-center justify-between p-5 bg-[#F8FAFC] rounded-2xl border border-slate-100 hover:border-blue-100 transition-all group">
      <div className="flex items-center gap-5">
        <div className="w-[52px] h-[52px] bg-[#0EA5E9] rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-100 group-hover:scale-105 transition-transform">
          <GraduationCap size={26} strokeWidth={2} />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-[15px]">{name}</h4>
          <p className="text-xs text-slate-500 font-medium mb-1.5">{dudi}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <CalendarDays size={13} /> <span>{date}</span>
          </div>
        </div>
      </div>
      <Badge className={`${badgeColor} border-none px-3.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wide shadow-sm`}>
        {status}
      </Badge>
    </div>
  )
}

function LogbookItem({ title, date, status, kendala }: any) {
  // Warna Status Logbook
  const statusStyles: any = {
    disetujui: "bg-[#DCFCE7] text-[#16A34A]",
    menunggu: "bg-[#FEF9C3] text-[#CA8A04]",
    ditolak: "bg-[#FEE2E2] text-[#DC2626]"
  };

  const statusLabel: any = {
    disetujui: "Disetujui",
    menunggu: "Pending",
    ditolak: "Ditolak"
  };

  return (
    <div className="p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-all group">
      <div className="flex justify-between items-start gap-4">
         <div className="flex gap-5">
            <div className="w-[52px] h-[52px] bg-[#84cc16] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md shadow-lime-200 group-hover:scale-105 transition-transform">
                <BookOpen size={24} strokeWidth={2} />
            </div>
            <div>
                <h4 className="font-bold text-slate-800 text-[14px] leading-snug line-clamp-1">{title}</h4>
                <div className="flex items-center gap-2 mt-1.5">
                     <CalendarDays size={13} className="text-slate-300"/>
                     <span className="text-[11px] text-slate-400 font-medium">{date}</span>
                </div>
                {/* Tampilkan kendala jika ada (warna oranye) */}
                {kendala && (
                  <p className="text-[11px] font-medium text-orange-400 mt-2 italic flex items-center gap-1">
                    <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                    Kendala: {kendala}
                  </p>
                )}
            </div>
         </div>
         <Badge className={`${statusStyles[status] || "bg-slate-100 text-slate-500"} border-none px-3 py-1 text-[10px] font-bold rounded-lg capitalize`}>
            {statusLabel[status] || status}
         </Badge>
      </div>
    </div>
  )
}

function DudiItem({ name, address, phone, count }: any) {
  return (
    <div className="relative group">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-slate-800 text-[14px] max-w-[75%] leading-tight group-hover:text-[#0EA5E9] transition-colors">{name}</h4>
        <Badge className="bg-lime-600 hover:bg-lime-700 text-white border-none px-2.5 py-1 text-[10px] font-bold shadow-sm rounded-md transition-colors">
          {count} siswa
        </Badge>
      </div>
      <div className="space-y-2 pl-3.5 border-l-2 border-slate-100 ml-1 py-1 group-hover:border-blue-100 transition-colors">
        <div className="flex items-start gap-2.5">
            <MapPin size={13} className="text-slate-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-slate-500 leading-tight font-medium line-clamp-2">{address}</p>
        </div>
        <div className="flex items-center gap-2.5">
            <Phone size={13} className="text-slate-400 shrink-0" />
            <p className="text-[11px] text-slate-500 font-medium">{phone}</p>
        </div>
      </div>
    </div>
  )
}

function formatDate(dateString: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'numeric', year: 'numeric'
  });
}
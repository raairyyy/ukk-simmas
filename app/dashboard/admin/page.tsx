"use client"

import { useEffect, useState } from "react"
import {
  Building2, Users, GraduationCap, BookOpen, 
  CalendarDays, User, MapPin, Phone, Bell, LogOut
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AdminDashboard() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>({
    stats: { totalSiswa: 0, totalDudi: 0, siswaMagang: 0, logbookHariIni: 0 },
    magangTerbaru: [],
    logbookTerbaru: [],
    dudiAktif: []
  })

  useEffect(() => {
    // Ambil profil user login
    fetch("/api/auth/me").then(res => res.json()).then(res => setUserData(res.user))
    
    // Ambil statistik dashboard
    fetch("/api/admin/dashboard")
      .then(res => res.json())
      .then(res => {
        if (!res.error) setDashboardData(res)
      })
  }, [])

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) window.location.href = "/login"
  }

  // Tanggal Hari Ini
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <>
      <header className="bg-white border-b border-slate-100 h-[88px] px-10 flex items-center justify-between sticky top-0 z-50">

        <div>
          <h2 className="font-bold text-lg text-slate-800">SMK Brantas Karangkates</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Sistem Manajemen Magang </p>
        </div>

        <div className="flex items-center gap-8">
          <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
            <Bell size={24} strokeWidth={1.5} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="relative">
            <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-4 cursor-pointer group">
              <div className="w-12 h-12 bg-[#00A9D8] rounded-[14px] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <User size={26} strokeWidth={2.5} />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[16px] font-bold text-[#1E293B] leading-none">{userData?.name || "Admin Sistem"}</p>
                <p className="text-xs text-slate-400 font-semibold mt-1.5 tracking-wide uppercase">{userData?.role || "Admin"}</p>
              </div>
            </div>

            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-sm font-bold text-slate-800">{userData?.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium uppercase">{userData?.role}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors text-sm font-bold group">
                    <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors"><LogOut size={18} strokeWidth={2.5} /></div>
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="p-10 max-w-[1680px] mx-auto space-y-10">
        <div>
          <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Selamat datang, {userData?.name}!</p>
        </div>

        {/* 4 Card Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          <StatCard title="Total Siswa" value={dashboardData.stats.totalSiswa} desc="Seluruh siswa terdaftar" icon={<Users className="text-[#0EA5E9]" />} />
          <StatCard title="DUDI Partner" value={dashboardData.stats.totalDudi} desc="Perusahaan mitra" icon={<Building2 className="text-[#0EA5E9]" />} />
          <StatCard title="Siswa Magang" value={dashboardData.stats.siswaMagang} desc="Sedang aktif magang" icon={<GraduationCap className="text-[#0EA5E9]" />} />
          <StatCard title="Logbook Hari Ini" value={dashboardData.stats.logbookHariIni} desc="Laporan masuk hari ini" icon={<BookOpen className="text-[#0EA5E9]" />} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2 space-y-8">
            {/* Panel Magang Terbaru */}
            <Card className="border-none shadow-sm rounded-[20px] overflow-hidden bg-white">
              <CardHeader className="pb-4 pt-8 px-8">
                <CardTitle className="flex items-center gap-3 text-[19px] font-bold text-slate-800">
                  <GraduationCap className="text-[#0EA5E9] w-6 h-6" strokeWidth={2.5} />
                  Magang Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 px-8 pb-8">
                {dashboardData.magangTerbaru.length > 0 ? dashboardData.magangTerbaru.map((m: any) => (
                  <MagangItem key={m.id} name={m.siswa?.nama} dudi={m.dudi?.nama_perusahaan} date={`${m.tanggal_mulai} - ${m.tanggal_selesai}`} status={m.status} />
                )) : <p className="text-sm text-slate-400">Belum ada magang terbaru.</p>}
              </CardContent>
            </Card>

            {/* Panel Logbook Terbaru */}
            <Card className="border-none shadow-sm rounded-[20px] overflow-hidden bg-white">
              <CardHeader className="pb-4 pt-8 px-8">
                <CardTitle className="flex items-center gap-3 text-[19px] font-bold text-slate-800">
                  <BookOpen className="text-lime-600 w-6 h-6" strokeWidth={2.5} />
                  Logbook Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 px-8 pb-8">
                {dashboardData.logbookTerbaru.length > 0 ? dashboardData.logbookTerbaru.map((l: any) => (
                  <LogbookItem key={l.id} name={l.magang?.siswa?.nama} title={l.kegiatan} date={l.tanggal} status={l.status_verifikasi} kendala={l.kendala} />
                )) : <p className="text-sm text-slate-400">Belum ada logbook terbaru.</p>}
              </CardContent>
            </Card>
          </div>

          {/* Panel DUDI Aktif */}
          <div className="xl:col-span-1 h-full">
            <Card className="border-none shadow-sm rounded-[20px] bg-white h-full">
              <CardHeader className="pb-6 pt-8 px-8">
                <CardTitle className="flex items-center gap-3 text-[19px] font-bold text-slate-800">
                  <Building2 className="text-orange-500 w-6 h-6" strokeWidth={2.5} />
                  DUDI Aktif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 px-8 pb-8">
                {dashboardData.dudiAktif.map((d: any, idx: number) => (
                  <DudiItem key={idx} {...d} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

// --- Komponen Item ---

function StatCard({ title, value, desc, icon }: any) {
  return (
    <Card className="border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-[20px] bg-white hover:-translate-y-1 transition-transform duration-300 h-[180px] flex flex-col justify-center">
      <CardContent className="p-7 relative h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <p className="text-[13px] font-semibold text-slate-500 uppercase">{title}</p>
            <div className="opacity-90">{icon}</div>
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
  return (
    <div className="flex items-center justify-between p-5 bg-[#F8FAFC] rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors group">
      <div className="flex items-center gap-5">
        <div className="w-[52px] h-[52px] bg-[#0EA5E9] rounded-2xl flex items-center justify-center text-white shadow-md">
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
      <Badge className="bg-[#DCFCE7] text-[#16A34A] border-none px-3.5 py-1 text-xs font-bold rounded-lg uppercase">{status}</Badge>
    </div>
  )
}

function LogbookItem({ name, title, date, status, kendala }: any) {
  const statusStyles: any = { Disetujui: "bg-[#DCFCE7] text-[#16A34A]", Pending: "bg-[#FEF9C3] text-[#CA8A04]", Ditolak: "bg-[#FEE2E2] text-[#DC2626]" };
  return (
    <div className="p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-all">
      <div className="flex justify-between items-start gap-5 mb-4">
         <div className="flex gap-5">
            <div className="w-11 h-11 bg-lime-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md shadow-lime-200/50">
                <BookOpen size={22} strokeWidth={2} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">{name}</p>
                <h4 className="font-bold text-slate-800 text-[14px] leading-snug">{title}</h4>
                <div className="flex items-center gap-1.5 mt-2">
                     <CalendarDays size={13} className="text-slate-300"/>
                     <span className="text-[11px] text-slate-400 font-medium">{date}</span>
                </div>
            </div>
         </div>
         <Badge className={`${statusStyles[status]} border-none px-3 py-1 text-[10px] font-bold rounded-lg`}>{status}</Badge>
      </div>
      <div className="ml-[64px]"><p className="text-[11px] font-medium text-orange-400 italic">Kendala: <span className="text-orange-400/80 font-normal not-italic">{kendala}</span></p></div>
    </div>
  )
}

function DudiItem({ name, address, phone, count }: any) {
  return (
    <div className="relative">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-slate-800 text-[14px] max-w-[70%] leading-tight">{name}</h4>
        <Badge className="bg-lime-600 hover:bg-lime-700 text-white border-none px-2.5 py-1 text-[10px] font-bold shadow-sm rounded-md">{count} siswa</Badge>
      </div>
      <div className="space-y-2 pl-3.5 border-l-2 border-slate-100 ml-1 py-1">
        <div className="flex items-start gap-2.5">
            <MapPin size={13} className="text-slate-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-slate-500 leading-tight font-medium">{address}</p>
        </div>
        <div className="flex items-center gap-2.5">
            <Phone size={13} className="text-slate-400 shrink-0" />
            <p className="text-[11px] text-slate-500 font-medium">{phone}</p>
        </div>
      </div>
    </div>
  )
}
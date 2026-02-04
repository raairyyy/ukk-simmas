"use client"

import {
  Users,
  Building2,
  GraduationCap,
  BookOpen,
  CalendarDays,
  MapPin,
  Phone,
  User,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function GuruDashboard() {
  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-100 h-[90px] px-10 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="font-bold text-xl text-slate-800">SMK Negeri 1 Surabaya</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Sistem Manajemen Magang Siswa</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-base font-bold text-slate-800">Guru Pembimbing</p>
            <p className="text-sm text-slate-500 font-medium">Guru</p>
          </div>
          <Avatar className="h-12 w-12 bg-[#0EA5E9] text-white ring-4 ring-slate-50 cursor-pointer">
            <AvatarFallback className="bg-[#0EA5E9] text-white font-bold"><User size={24} /></AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Dashboard Body */}
      <div className="p-10 max-w-[1680px] mx-auto space-y-10">
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          <StatCard
            title="Total Siswa"
            value="150"
            desc="Seluruh siswa terdaftar"
            icon={<Users className="text-[#0EA5E9]" size={24} />}
          />
          <StatCard
            title="DUDI Partner"
            value="45"
            desc="Perusahaan mitra"
            icon={<Building2 className="text-[#0EA5E9]" size={24} />}
          />
          <StatCard
            title="Siswa Magang"
            value="120"
            desc="Sedang aktif magang"
            icon={<GraduationCap className="text-[#0EA5E9]" size={24} />}
          />
          <StatCard
            title="Logbook Hari Ini"
            value="85"
            desc="Laporan masuk hari ini"
            icon={<BookOpen className="text-[#0EA5E9]" size={24} />}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* === KOLOM KIRI (2/3) === */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Card Magang Terbaru */}
            <Card className="border-none shadow-sm rounded-[24px] overflow-hidden bg-white">
              <CardHeader className="pb-4 pt-8 px-8">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <GraduationCap className="text-[#06b6d4] w-6 h-6" strokeWidth={2.5} />
                  Magang Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 px-8 pb-8">
                <MagangItem
                  name="Ahmad Rizki"
                  dudi="PT. Teknologi Nusantara"
                  date="15/1/2024 - 15/4/2024"
                />
                <MagangItem
                  name="Siti Nurhaliza"
                  dudi="CV. Digital Kreativa"
                  date="20/1/2024 - 20/4/2024"
                />
              </CardContent>
            </Card>

            {/* Card Logbook Terbaru */}
            <Card className="border-none shadow-sm rounded-[24px] overflow-hidden bg-white">
              <CardHeader className="pb-4 pt-8 px-8">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <BookOpen className="text-[#84cc16] w-6 h-6" strokeWidth={2.5} />
                  Logbook Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 px-8 pb-8">
                <LogbookItem
                  title="Mempelajari sistem database dan melakukan backup data harian"
                  date="21/7/2024"
                  status="Disetujui"
                  kendala="Tidak ada kendala berarti"
                />
                <LogbookItem
                  title="Membuat design mockup untuk website perusahaan"
                  date="21/7/2024"
                  status="Pending"
                  kendala="Software design masih belum familiar"
                />
                <LogbookItem
                  title="Mengikuti training keamanan sistem informasi"
                  date="20/7/2024"
                  status="Ditolak"
                  kendala="Materi cukup kompleks untuk dipahami"
                />
              </CardContent>
            </Card>
          </div>

          {/* === KOLOM KANAN (1/3) === */}
          <div className="xl:col-span-1 h-full">
            <Card className="border-none shadow-sm rounded-[24px] bg-white h-full">
              <CardHeader className="pb-6 pt-8 px-8">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <Building2 className="text-[#ca8a04] w-6 h-6" strokeWidth={2.5} />
                  DUDI Aktif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 px-8 pb-8">
                <DudiItem 
                  name="PT. Teknologi Nusantara" 
                  address="Jl. HR Muhammad No. 123, Surabaya"
                  phone="031-5551234"
                  count="8" 
                />
                <DudiItem 
                  name="CV. Digital Kreativa" 
                  address="Jl. Pemuda No. 45, Surabaya"
                  phone="031-5557890"
                  count="5" 
                />
                <DudiItem 
                  name="PT. Inovasi Mandiri" 
                  address="Jl. Diponegoro No. 78, Surabaya"
                  phone="031-5553456"
                  count="12" 
                />
                <DudiItem 
                  name="PT. Solusi Informatika" 
                  address="Jl. Mayjen Sungkono No. 10, Surabaya"
                  phone="031-5554567"
                  count="7" 
                />
                <DudiItem 
                  name="CV. Kreatif Media" 
                  address="Jl. Basuki Rahmat No. 88, Surabaya"
                  phone="031-5556789"
                  count="6" 
                />
                <DudiItem 
                  name="PT. Sukses Bersama" 
                  address="Jl. Ahmad Yani No. 55, Surabaya"
                  phone="031-5559876"
                  count="10" 
                />
                <DudiItem 
                  name="PT. Digital Solution" 
                  address="Jl. Raya Darmo No. 100, Surabaya"
                  phone="031-5554321"
                  count="9" 
                />
                <DudiItem 
                  name="CV. Mitra Teknologi" 
                  address="Jl. Kenjeran No. 200, Surabaya"
                  phone="031-5552468"
                  count="4" 
                />
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </>
  )
}

// === KOMPONEN UTILS (DI-TWEAK UNTUK TAMPILAN GURU) ===

function StatCard({ title, value, desc, icon }: any) {
  return (
    <Card className="border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-[24px] bg-white hover:-translate-y-1 transition-transform duration-300 h-[180px] flex flex-col justify-center">
      <CardContent className="p-8 relative h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <p className="text-[13px] font-semibold text-slate-500">{title}</p>
            <div className="opacity-90">{icon}</div>
        </div>
        <div>
          <h3 className="text-[40px] font-extrabold text-slate-800 leading-tight tracking-tight">{value}</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">{desc}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function MagangItem({ name, dudi, date }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-[#F8FAFC] rounded-2xl border border-slate-100 hover:border-cyan-100 transition-colors group">
      <div className="flex items-center gap-5">
        {/* Icon Warna Cyan (Sesuai Gambar Guru) */}
        <div className="w-[52px] h-[52px] bg-[#06b6d4] rounded-2xl flex items-center justify-center text-white shadow-md shadow-cyan-200/50 group-hover:scale-105 transition-transform shrink-0">
          <GraduationCap size={26} strokeWidth={2} />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-[15px]">{name}</h4>
          <p className="text-xs text-slate-500 font-medium mb-1.5">{dudi}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <CalendarDays size={13} />
            <span>{date}</span>
          </div>
        </div>
      </div>
      <Badge className="bg-[#DCFCE7] text-[#16A34A] hover:bg-[#DCFCE7] border-none px-3.5 py-1 text-xs font-bold shadow-none rounded-lg">
        Aktif
      </Badge>
    </div>
  )
}

function LogbookItem({ title, date, status, kendala }: any) {
  const statusStyles: any = {
    Disetujui: "bg-[#DCFCE7] text-[#16A34A]",
    Pending: "bg-[#FEF9C3] text-[#CA8A04]",
    Ditolak: "bg-[#FEE2E2] text-[#DC2626]"
  };

  const style = statusStyles[status] || "bg-gray-100";

  return (
    <div className="p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-all">
      <div className="flex justify-between items-start gap-5 mb-4">
         <div className="flex gap-5">
            {/* Icon Warna Lime/Hijau (Sesuai Gambar Guru) */}
            <div className="w-11 h-11 bg-[#84cc16] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md shadow-lime-200/50">
                <BookOpen size={22} strokeWidth={2} />
            </div>
            <div>
                <h4 className="font-bold text-slate-800 text-[14px] leading-snug">{title}</h4>
                <div className="flex items-center gap-1.5 mt-2">
                     <CalendarDays size={13} className="text-slate-300"/>
                     <span className="text-[11px] text-slate-400 font-medium">{date}</span>
                </div>
            </div>
         </div>
         <Badge className={`${style} hover:${style} border-none px-3 py-1 text-[10px] font-bold shadow-none uppercase tracking-wide shrink-0 rounded-lg`}>
            {status}
         </Badge>
      </div>
      
      <div className="ml-[64px]">
         <p className="text-[11px] font-medium text-orange-400 italic">
           Kendala: <span className="text-orange-400/80 font-normal not-italic">{kendala}</span>
         </p>
      </div>
    </div>
  )
}

function DudiItem({ name, address, phone, count }: any) {
  return (
    <div className="relative">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-slate-800 text-[14px] max-w-[70%] leading-tight">{name}</h4>
        {/* Badge Warna Olive/Emas (Sesuai Gambar Guru) */}
        <Badge className="bg-[#a38b26] hover:bg-[#85711f] text-white border-none px-2.5 py-1 text-[10px] font-bold shadow-sm rounded-md">
          {count} siswa
        </Badge>
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
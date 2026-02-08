"use client"
import { useEffect, useState } from "react"
import { Users, Building2, GraduationCap, BookOpen, User, LogOut } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function GuruDashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  // FIX: Tambahkan state stats agar tidak error "Cannot find name 'stats'"
  const [stats, setStats] = useState({
    totalSiswa: 0,
    dudi: 0,
    aktif: 0,
    logbook: 0
  })

  useEffect(() => {
    // Ambil data profil
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUserData(data.user))

    // Ambil data statistik (Pastikan API ini sudah dibuat)
    fetch("/api/guru/dashboard-stats")
      .then(res => res.json())
      .then(data => {
        if (data) setStats(data)
      })
      .catch(err => console.error("Error fetching stats:", err))
  }, [])

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b h-[90px] px-10 flex items-center justify-between sticky top-0 z-50">
        <div>
          <h2 className="font-bold text-xl text-slate-800">SMK Brantas</h2>
          <p className="text-sm text-slate-500">Panel Guru Pembimbing</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-base font-bold text-slate-800">{userData?.name || "Guru"}</p>
            <p className="text-sm text-slate-500">Guru Pembimbing</p>
          </div>
          <div className="relative">
            <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="cursor-pointer">
              <Avatar className="h-12 w-12 bg-[#06b6d4] text-white ring-4 ring-slate-50">
                <AvatarFallback className="font-bold"><User size={24} /></AvatarFallback>
              </Avatar>
            </div>
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border p-2 animate-in fade-in zoom-in">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg font-bold text-sm">
                  <LogOut size={18} /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="p-10 max-w-[1680px] mx-auto space-y-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Guru</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          <StatCard 
            title="Siswa Anda" 
            value={stats.totalSiswa} 
            desc="Siswa yang Anda bimbing" 
            icon={<Users className="text-[#06b6d4]" />} 
          />
          <StatCard 
            title="DUDI Aktif" 
            value={stats.dudi} 
            desc="Mitra industri" 
            icon={<Building2 className="text-[#06b6d4]" />} 
          />
          <StatCard 
            title="Sedang Magang" 
            value={stats.aktif} 
            desc="Siswa aktif di lapangan" 
            icon={<GraduationCap className="text-[#06b6d4]" />} 
          />
          <StatCard 
            title="Logbook Baru" 
            value={stats.logbook} 
            desc="Laporan perlu diperiksa" 
            icon={<BookOpen className="text-[#06b6d4]" />} 
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, desc, icon }: any) {
  return (
    <Card className="border-none shadow-sm rounded-[24px] bg-white">
      <CardContent className="p-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-4xl font-extrabold text-slate-800 mt-2">{value}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
        </div>
        <p className="text-xs text-slate-400 mt-4 font-medium">{desc}</p>
      </CardContent>
    </Card>
  )
}
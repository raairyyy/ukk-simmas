"use client"
import { useEffect, useState } from "react";
import { Users, Building2, GraduationCap, BookOpen, User, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function GuruDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [stats, setStats] = useState({
    totalSiswa: 0,
    dudi: 0,
    aktif: 0,
    logbook: 0
  });

  // Ambil user data
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        setUserData(data.user);
      })
      .catch(err => console.error(err));
  }, []);

  // Ambil dashboard stats setelah userData siap
  useEffect(() => {
    if (!userData?.id_guru) return;

    fetch(`/api/guru/dashboard?guru_id=${userData.id_guru}`)
      .then(res => res.json())
      .then(statData => {
        console.log("Dashboard stats:", statData);
        if (statData && !statData.error) setStats(statData);
      })
      .catch(err => console.error("Fetch error:", err));
  }, [userData]);

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) window.location.href = "/login";
  };

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
          <StatCard title="Total Siswa" value={stats.totalSiswa} desc="Seluruh siswa terdaftar" icon={<Users className="text-[#06b6d4]" />} />
          <StatCard title="DUDI Partner" value={stats.dudi} desc="Perusahaan mitra" icon={<Building2 className="text-[#06b6d4]" />} />
          <StatCard title="Siswa Magang" value={stats.aktif} desc="Sedang aktif magang" icon={<GraduationCap className="text-[#06b6d4]" />} />
          <StatCard title="Logbook Hari Ini" value={stats.logbook} desc="Laporan masuk hari ini" icon={<BookOpen className="text-[#06b6d4]" />} />
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

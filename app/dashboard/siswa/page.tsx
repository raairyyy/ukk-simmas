"use client"

import { useEffect, useState } from "react"
import { User, LogOut, Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function SiswaDashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUserData(data.user))
  }, [])

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Sesuai dengan desain SIMMAS */}
      <header className="bg-white border-b border-slate-100 h-[90px] px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div>
          <h2 className="font-bold text-xl text-slate-800">SMK Brantas Karangkates</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Sistem Manajemen Magang Siswa</p>
        </div>

        <div className="flex items-center gap-8">
          {/* Ikon Notifikasi (Bell) */}
          <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
            <Bell size={24} strokeWidth={1.5} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Area Profil dengan Dropdown Keluar */}
          <div className="relative">
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="flex items-center gap-4 cursor-pointer group"
            >
              {/* Avatar Kotak Tumpul sesuai Gambar 12 */}
              <div className="w-12 h-12 bg-[#00A9D8] rounded-[14px] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <User size={26} strokeWidth={2.5} />
              </div>

              {/* Info Nama & Role */}
              <div className="text-left hidden sm:block">
                <p className="text-[17px] font-bold text-[#1E293B] leading-none">
                  {userData?.name || "Loading..."}
                </p>
                <p className="text-sm text-slate-400 font-semibold mt-1.5 uppercase">Siswa</p>
              </div>
            </div>

            {/* Menu Dropdown Logout */}
            {isProfileOpen && (
              <>
                {/* Overlay transparan untuk menutup dropdown jika klik di luar */}
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-sm font-bold text-slate-800">{userData?.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium">Siswa Magang</p>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors text-sm font-bold group"
                  >
                    <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                      <LogOut size={18} strokeWidth={2.5} />
                    </div>
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="p-10 max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Selamat datang, {userData?.name || "..."}!
        </h1>
      </main>
    </div>
  )
}
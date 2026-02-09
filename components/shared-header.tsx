"use client"

import { useEffect, useState } from "react"
import { User, Bell, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function SharedHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [schoolName, setSchoolName] = useState("SMK Brantas Karangkates")

  useEffect(() => {
    // 1. Ambil profil user login
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUserData(data.user))

    // 2. Ambil Nama Sekolah dari API dengan opsi NO-STORE agar realtime
    fetch("/api/school-settings", { cache: "no-store" })
      .then(res => res.json())
      .then(json => {
        if (json.data?.nama_sekolah) setSchoolName(json.data.nama_sekolah)
      })
  }, [])

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) window.location.href = "/login"
  }

  return (
    <header className="bg-white border-b border-slate-100 h-[90px] px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* KIRI: Identitas Sekolah dengan Font Lebih Besar */}
      <div>
        {/* PERBAIKAN DI SINI: Ukuran font diperbesar menjadi text-2xl (sekitar 24px) */}
        <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight leading-none">
          {schoolName}
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 font-medium tracking-wide">
          Sistem Manajemen Magang Siswa
        </p>
      </div>

      {/* KANAN: Notifikasi & Profil */}
      <div className="flex items-center gap-8">
        {/* Notifikasi */}
        <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
          <Bell size={26} strokeWidth={1.5} />
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profil & Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)} 
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-[#00A9D8] rounded-[14px] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <User size={26} strokeWidth={2.5} />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[17px] font-bold text-[#1E293B] leading-none">
                {userData?.name || "Loading..."}
              </p>
              <p className="text-sm text-slate-400 font-semibold mt-1.5 tracking-wide uppercase">
                {userData?.role || "User"}
              </p>
            </div>
          </div>

          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)}></div>
              <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                <div className="px-5 py-4 border-b border-slate-50 mb-1">
                  <p className="text-sm font-bold text-slate-900 truncate">{userData?.name}</p>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{userData?.role}</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50 transition-colors text-sm font-bold group"
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
  )
}
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  GraduationCap,
  BookOpen,
  FileText
} from "lucide-react"

// Definisi Menu
const MENUS = {
  admin: [
    { label: "Dashboard", subLabel: "Ringkasan sistem", href: "/dashboard/admin", icon: LayoutDashboard, exact: true },
    { label: "DUDI", subLabel: "Manajemen DUDI", href: "/dashboard/admin/dudi", icon: Building2 },
    { label: "Pengguna", subLabel: "Manajemen user", href: "/dashboard/admin/pengguna", icon: Users },
    { label: "Pengaturan", subLabel: "Konfigurasi sistem", href: "/dashboard/admin/pengaturan", icon: Settings },
  ],
  guru: [
    { label: "Dashboard", subLabel: "Ringkasan sistem", href: "/dashboard/guru", icon: LayoutDashboard, exact: true },
    { label: "DUDI", subLabel: "Manajemen DUDI", href: "/dashboard/guru/dudi", icon: Building2 },
    { label: "Magang", subLabel: "Daftar siswa magang", href: "/dashboard/guru/magang", icon: Users },
    { label: "Jurnal Harian", subLabel: "Catatan aktivitas", href: "/dashboard/guru/jurnal", icon: FileText },
  ],
  siswa: [
    { label: "Dashboard", subLabel: "Ringkasan sistem", href: "/dashboard/siswa", icon: LayoutDashboard, exact: true },
    { label: "DUDI", subLabel: "Cari tempat magang", href: "/dashboard/siswa/dudi", icon: Building2 },
    { label: "Jurnal Harian", subLabel: "Catatan harian", href: "/dashboard/siswa/jurnal", icon: BookOpen },
    { label: "Magang", subLabel: "Data magang saya", href: "/dashboard/siswa/magang", icon: GraduationCap },
  ]
}

export default function Sidebar() {
  const pathname = usePathname()
  const [schoolName, setSchoolName] = useState("SMK Negeri 1 Surabaya")
  
  const segments = pathname.split('/')
  const currentRole = (segments[2] as 'admin' | 'guru' | 'siswa') || 'admin'
  const menuItems = MENUS[currentRole] || MENUS.admin 
  
  const panelTitle = 
    currentRole === 'guru' ? 'Panel Guru' : 
    currentRole === 'siswa' ? 'Panel Siswa' : 
    'Panel Admin'

  // Ambil data sekolah agar footer sidebar dinamis
  useEffect(() => {
    fetch("/api/school-settings", { cache: "no-store" })
      .then(res => res.json())
      .then(json => {
        if (json.data?.nama_sekolah) setSchoolName(json.data.nama_sekolah)
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <aside className="w-[320px] bg-white border-r border-slate-100 hidden md:flex flex-col fixed h-full z-20">
      
      {/* === LOGO SECTION === */}
      {/* PENTING: h-[90px] disamakan dengan Header agar sejajar */}
      <div className="h-[90px] flex items-center px-8 border-b border-transparent"> 
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-gradient-to-br from-[#00A9D8] to-[#007EB5] rounded-[14px] flex items-center justify-center text-white shadow-lg shadow-cyan-100/50">
            <GraduationCap size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-extrabold text-[22px] leading-none text-[#1E293B] tracking-tight">SIMMAS</h1>
            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{panelTitle}</p>
          </div>
        </div>
      </div>

      {/* === SCROLLABLE CONTENT === */}
      <div className="flex-1 flex flex-col justify-between px-6 py-8 overflow-y-auto">
        
        {/* Navigation Menu */}
        <nav className="space-y-3">
          {menuItems.map((item, index) => {
            const isActive = item.exact 
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <SidebarItem 
                key={index}
                icon={<item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />} 
                label={item.label} 
                subLabel={item.subLabel} 
                href={item.href}
                active={isActive}
              />
            )
          })}
        </nav>

        {/* === FOOTER SECTION === */}
        <div className="mt-10">
          <div className="bg-[#F8FAFC] p-5 rounded-[20px] border border-slate-100 flex items-start gap-3.5">
            <div className="relative flex items-center justify-center mt-1">
              <div className="w-3.5 h-3.5 rounded-full bg-[#84cc16]/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#84cc16] shadow-[0_0_8px_rgba(132,204,22,0.6)] animate-pulse"></div>
              </div>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#334155] leading-snug">{schoolName}</p>
              <p className="text-[10px] font-semibold text-slate-400 mt-1">Sistem Pelaporan v1.0</p>
            </div>
          </div>
        </div>

      </div>
    </aside>
  )
}

// Komponen Item Menu
function SidebarItem({ icon, label, subLabel, active, href }: any) {
  return (
    <Link href={href}>
      <div
        className={`group flex items-center gap-4 p-3.5 rounded-[18px] cursor-pointer transition-all duration-300 border ${
          active
            ? "bg-[#00A9D8] border-[#00A9D8] text-white shadow-lg shadow-cyan-100"
            : "bg-transparent border-transparent text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B]"
        }`}
      >
        {/* Icon Container */}
        <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
            active ? "bg-white/20 text-white" : "bg-white text-slate-400 group-hover:text-[#00A9D8] border border-slate-100 group-hover:border-blue-100"
        }`}>
          {icon}
        </div>

        {/* Text Content */}
        <div>
          <p className={`text-[16px] font-bold leading-none ${active ? "text-white" : "text-[#334155]"}`}>
            {label}
          </p>
          <p className={`text-[14px] mt-1 font-medium transition-colors ${
            active ? "text-cyan-50" : "text-slate-400"
          }`}>
            {subLabel}
          </p>
        </div>
      </div>
    </Link>
  )
}
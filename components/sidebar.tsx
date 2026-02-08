"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  GraduationCap,
  BookOpen,
  Briefcase,
  FileText
} from "lucide-react"

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
    { label: "Lowongan", subLabel: "Cari tempat magang", href: "/dashboard/siswa/lowongan", icon: Briefcase },
    { label: "Logbook", subLabel: "Input aktivitas", href: "/dashboard/siswa/logbook", icon: BookOpen },
  ]
}

export default function Sidebar() {
  const pathname = usePathname()
  
  const segments = pathname.split('/')
  const currentRole = (segments[2] as 'admin' | 'guru' | 'siswa') || 'admin'
  const menuItems = MENUS[currentRole] || MENUS.admin 
  
  const panelTitle = 
    currentRole === 'guru' ? 'Panel Guru' : 
    currentRole === 'siswa' ? 'Panel Siswa' : 
    'Panel Admin'

  return (
    <aside className="w-[320px] bg-white border-r border-slate-50 hidden md:flex flex-col fixed h-full z-20 px-6 py-10">
      {/* LOGO SECTION (Gambar 6) */}
      <div className="flex items-center gap-4 px-2 mb-12">
        <div className="w-[52px] h-[52px] bg-gradient-to-br from-[#00A9D8] to-[#007EB5] rounded-[18px] flex items-center justify-center text-white shadow-lg shadow-cyan-100">
          <GraduationCap size={28} strokeWidth={2.2} />
        </div>
        <div>
          <h1 className="font-bold text-[22px] leading-none text-[#1E293B] tracking-tight">SIMMAS</h1>
          <p className="text-sm font-semibold text-slate-400 mt-1.5">{panelTitle}</p>
        </div>
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 space-y-5">
        {menuItems.map((item, index) => {
          const isActive = item.exact 
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <SidebarItem 
              key={index}
              icon={<item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />} 
              label={item.label} 
              subLabel={item.subLabel} 
              href={item.href}
              active={isActive}
            />
          )
        })}
      </nav>

      {/* FOOTER SECTION (Gambar 6 Bawah) */}
      <div className="mt-auto">
        <div className="bg-[#F8FAFC] p-5 rounded-[22px] border border-slate-50 flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#84cc16]/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#84cc16] shadow-[0_0_8px_rgba(132,204,22,0.8)]"></div>
            </div>
          </div>
          <div>
            <p className="text-[15px] font-bold text-[#334155] leading-none">SMK Negeri 1 Surabaya</p>
            <p className="text-xs font-semibold text-slate-400 mt-2">Sistem Pelaporan v1.0</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function SidebarItem({ icon, label, subLabel, active, href }: any) {
  return (
    <Link href={href}>
      <div
        className={`group flex items-center gap-4 p-4 rounded-[20px] cursor-pointer transition-all duration-300 ${
          active
            ? "bg-gradient-to-r from-[#00A9D8] to-[#008BB8] text-white shadow-md shadow-cyan-100"
            : "text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B]"
        }`}
      >
        {/* Container Icon */}
        <div className={`w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
            active ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400 group-hover:text-[#00A9D8] group-hover:bg-cyan-50"
        }`}>
          {icon}
        </div>

        <div>
          <p className={`text-[16px] font-bold leading-none ${active ? "text-white" : "text-[#475569]"}`}>
            {label}
          </p>
          <p className={`text-[13px] mt-1.5 font-medium transition-colors ${
            active ? "text-cyan-50/80" : "text-slate-400"
          }`}>
            {subLabel}
          </p>
        </div>
      </div>
    </Link>
  )
}
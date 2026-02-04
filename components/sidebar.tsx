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
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard, exact: true }, // Tambah exact: true
    { label: "DUDI", href: "/dashboard/admin/dudi", icon: Building2 },
    { label: "Pengguna", href: "/dashboard/admin/pengguna", icon: Users },
    { label: "Pengaturan", href: "/dashboard/admin/pengaturan", icon: Settings }, // Pastikan path ini sesuai nama folder (settings/pengaturan)
  ],
  guru: [
    { label: "Dashboard", href: "/dashboard/guru", icon: LayoutDashboard, exact: true },
    { label: "DUDI", href: "/dashboard/guru/dudi", icon: Building2 },
    { label: "Magang", href: "/dashboard/guru/magang", icon: Users },
    { label: "Jurnal Harian", href: "/dashboard/guru/jurnal", icon: FileText },
  ],
  siswa: [
    { label: "Dashboard", href: "/dashboard/siswa", icon: LayoutDashboard, exact: true },
    { label: "Lowongan", href: "/dashboard/siswa/lowongan", icon: Briefcase },
    { label: "Logbook", href: "/dashboard/siswa/logbook", icon: BookOpen },
  ]
}

export default function Sidebar() {
  const pathname = usePathname()
  
  // Ambil role dari URL (admin/guru/siswa)
  const segments = pathname.split('/')
  const currentRole = (segments[2] as 'admin' | 'guru' | 'siswa') || 'admin'
  const menuItems = MENUS[currentRole] || MENUS.admin 
  
  const panelTitle = 
    currentRole === 'guru' ? 'Panel Guru' : 
    currentRole === 'siswa' ? 'Panel Siswa' : 
    'Panel Admin'

  return (
    <aside className="w-[280px] bg-white border-r border-slate-100 hidden md:flex flex-col fixed h-full z-20 px-6 py-8">
      <div className="flex items-center gap-4 px-2 mb-10">
        <div className="w-12 h-12 bg-[#0EA5E9] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <GraduationCap size={26} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-extrabold text-xl leading-none text-slate-800 tracking-tight">SIMMAS</h1>
          <p className="text-sm font-medium text-slate-500 mt-1.5 capitalize">{panelTitle}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-4">
        {menuItems.map((item, index) => {
          // LOGIKA BARU: Cek apakah harus exact (sama persis) atau startsWith
          const isActive = item.exact 
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <SidebarItem 
              key={index}
              icon={<item.icon size={24} />} 
              label={item.label} 
              subLabel={`Menu ${item.label}`} 
              href={item.href}
              active={isActive}
            />
          )
        })}
      </nav>

      <div className="mt-auto">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.6)] shrink-0"></div>
          <div>
            <p className="text-sm font-bold text-slate-700">SMK Negeri 1 Surabaya</p>
            <p className="text-xs text-slate-500 mt-1">Sistem Pelaporan v1.0</p>
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
        className={`group flex items-center gap-4 p-4 mx-0 rounded-2xl cursor-pointer transition-all duration-200 ${
          active
            ? "bg-[#0EA5E9] text-white shadow-lg shadow-blue-200/50"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <div className={`${active ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`}>
          {icon}
        </div>
        <div>
          <p className={`text-base font-bold`}>{label}</p>
          <p className={`text-sm mt-0.5 ${active ? "text-blue-100 font-medium" : "text-slate-400"}`}>{subLabel}</p>
        </div>
      </div>
    </Link>
  )
}
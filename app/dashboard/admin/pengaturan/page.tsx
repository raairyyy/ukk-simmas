"use client"

import {
  Building2,
  Settings,
  Pencil,
  Eye,
  Printer,
  FileText,
  Monitor,
  User,
  Image as ImageIcon,
  MapPin,
  Phone,
  Mail,
  Globe,
  Hash,
  Bell,
  LogOut
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"

export default function SettingsPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  // Ambil data profil saat halaman dimuat
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUserData(data.user))
      .catch(err => console.error("Gagal mengambil data profil:", err))
    
    // fetchSettings() dihapus karena belum diimplementasikan di API
  }, [])

  // Fungsi Logout
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.ok) window.location.href = "/login"
    } catch (err) {
      console.error("Gagal logout:", err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 h-[90px] px-10 flex items-center justify-between sticky top-0 z-50">
        <div>
          <h2 className="font-bold text-xl text-slate-800">SMK Brantas Karangkates</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Sistem Manajemen Magang Siswa</p>
        </div>

        <div className="flex items-center gap-8">
          <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
            <Bell size={24} strokeWidth={1.5} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* === DROPDOWN PROFILE SECTION === */}
          <div className="relative">
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-[#00A9D8] rounded-[14px] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <User size={26} strokeWidth={2.5} />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[17px] font-bold text-[#1E293B] leading-none">{userData?.name || "Admin"}</p>
                <p className="text-sm text-slate-400 font-semibold mt-1.5 uppercase tracking-wider">Admin Sistem</p>
              </div>
            </div>

            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-sm font-bold text-slate-800">{userData?.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Admin</p>
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

      {/* Content Body */}
      <div className="p-10 max-w-[1680px] mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pengaturan Sekolah</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* KOLOM KIRI: FORM */}
          <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 text-[#0EA5E9]">
                    <Settings size={26} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Informasi Sekolah</h3>
                </div>
                <Button className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold h-10 px-6 rounded-lg text-sm transition-all hover:scale-105 shadow-md">
                  <Pencil size={14} className="mr-2" strokeWidth={3} /> Edit
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-500 ml-1">Logo Sekolah</Label>
                  <div className="w-24 h-24 bg-[#F8FAFC] border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-1 cursor-pointer hover:bg-slate-100 transition-colors">
                    <ImageIcon size={24} />
                    <span className="text-[10px] font-bold text-slate-400">Logo</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-500 ml-1 flex items-center gap-2">
                    <Building2 size={16} /> Nama Sekolah/Instansi
                  </Label>
                  <Input defaultValue="SMK Brantas Karangkates" className="h-[46px] rounded-xl border-slate-100 bg-[#F8FAFC]" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-500 ml-1 flex items-center gap-2">
                    <MapPin size={16} /> Alamat Lengkap
                  </Label>
                  <Textarea defaultValue="Jl. SMEA No.4, Surabaya, Jawa Timur" className="min-h-[100px] rounded-xl border-slate-100 bg-[#F8FAFC]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-500 ml-1 flex items-center gap-2">
                      <Phone size={16} /> Telepon
                    </Label>
                    <Input defaultValue="031-8292038" className="h-[46px] rounded-xl border-slate-100 bg-[#F8FAFC]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-500 ml-1 flex items-center gap-2">
                      <Mail size={16} /> Email
                    </Label>
                    <Input defaultValue="info@smkn1surabaya.sch.id" className="h-[46px] rounded-xl border-slate-100 bg-[#F8FAFC]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-500 ml-1 flex items-center gap-2">
                    <Globe size={16} /> Website
                  </Label>
                  <Input defaultValue="www.smkn1surabaya.sch.id" className="h-[46px] rounded-xl border-slate-100 bg-[#F8FAFC]" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-500 ml-1 flex items-center gap-2">
                    <User size={16} /> Kepala Sekolah
                  </Label>
                  <Input defaultValue="Drs. H. Sutrisno, M.Pd." className="h-[46px] rounded-xl border-slate-100 bg-[#F8FAFC]" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-500 ml-1 flex items-center gap-2">
                    <Hash size={16} /> NPSN
                  </Label>
                  <Input defaultValue="20567890" className="h-[46px] rounded-xl border-slate-100 bg-[#F8FAFC]" />
                </div>
              </div>
            </Card>
          </div>

          {/* KOLOM KANAN: PREVIEW */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-[24px] bg-white p-6">
              <div className="flex items-center gap-2 mb-2 text-[#0EA5E9]">
                <Eye size={18} />
                <h4 className="font-bold text-base text-slate-800">Preview Tampilan</h4>
              </div>
              <p className="text-sm text-slate-500">Pratinjau bagaimana informasi sekolah akan ditampilkan di sistem.</p>
            </Card>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600 ml-1 flex items-center gap-2">
                <Monitor size={14} /> Dashboard Header
              </Label>
              <Card className="border-none shadow-sm rounded-[24px] bg-white p-5">
                <div className="bg-[#F0F9FF] border border-blue-100 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-slate-200 text-[10px] text-slate-400">Logo</div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">SMK Brantas Karangkates</h5>
                    <p className="text-[10px] text-slate-500">Sistem Informasi Magang</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Preview-preview lainnya tetap sama secara visual */}
            <div className="bg-[#F0F9FF] border border-blue-100 rounded-2xl p-5">
              <h5 className="font-bold text-[#0EA5E9] text-xs mb-3 uppercase">Informasi Penggunaan:</h5>
              <ul className="space-y-3">
                <li className="flex gap-3 text-xs text-slate-600 leading-relaxed">
                  <Monitor size={14} className="shrink-0 text-blue-500" />
                  <span><b>Dashboard:</b> Digunakan pada identitas header aplikasi.</span>
                </li>
                <li className="flex gap-3 text-xs text-slate-600 leading-relaxed">
                  <FileText size={14} className="shrink-0 text-blue-500" />
                  <span><b>Dokumen:</b> Digunakan sebagai kop resmi surat dan sertifikat.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
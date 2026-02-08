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
  LogOut,
  CheckCircle2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Sticky */}
      <header className="bg-white border-b border-slate-100 h-[90px] px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
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
                <p className="text-[17px] font-bold text-[#1E293B] leading-none">{userData?.name || "Admin Sistem"}</p>
                <p className="text-sm text-slate-400 font-semibold mt-1.5 uppercase tracking-wider">Admin</p>
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
      <div className="p-8 xl:p-10 max-w-[1680px] mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Pengaturan Sekolah</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* KOLOM KIRI: FORM EDIT */}
          <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden p-8">
              {/* Header Card */}
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 text-[#0EA5E9] bg-blue-50 rounded-lg">
                    <Settings size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Informasi Sekolah</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Kelola data identitas sekolah</p>
                  </div>
                </div>
                <Button className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold h-10 px-6 rounded-xl text-sm transition-all hover:scale-105 shadow-md shadow-blue-100">
                  <Pencil size={16} className="mr-2" strokeWidth={2.5} /> Edit Data
                </Button>
              </div>
              
              <div className="space-y-7">
                {/* Upload Logo */}
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    Upload Logo Sekolah
                  </Label>
                  <div className="flex items-center gap-6">
                    <div className="w-28 h-28 bg-[#F8FAFC] border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:bg-slate-50 hover:border-blue-300 transition-all group">
                      <ImageIcon size={28} className="group-hover:text-blue-400 transition-colors" />
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-500">Pilih Logo</span>
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed max-w-[250px]">
                      <p>Format: .png, .jpg, .jpeg</p>
                      <p>Ukuran Maks: 2MB</p>
                      <p>Disarankan rasio 1:1 (Persegi)</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  {/* Nama Sekolah */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Building2 size={16} className="text-slate-400" /> Nama Sekolah/Instansi
                    </Label>
                    <Input defaultValue="SMK Brantas Karangkates" className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-slate-700 focus:bg-white transition-all" />
                  </div>

                  {/* Alamat Lengkap */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" /> Alamat Lengkap
                    </Label>
                    <Textarea 
                      defaultValue="Jl. SMEA No.4, Wonokromo, Surabaya, Jawa Timur 60243" 
                      className="min-h-[100px] rounded-xl border-slate-200 bg-slate-50/50 font-medium text-slate-700 focus:bg-white transition-all py-3 leading-relaxed resize-none" 
                    />
                  </div>

                  {/* Kontak Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Phone size={16} className="text-slate-400" /> Telepon
                      </Label>
                      <Input defaultValue="031-8292038" className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-slate-700 focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Mail size={16} className="text-slate-400" /> Email
                      </Label>
                      <Input defaultValue="info@smkn1surabaya.sch.id" className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-slate-700 focus:bg-white transition-all" />
                    </div>
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Globe size={16} className="text-slate-400" /> Website
                    </Label>
                    <Input defaultValue="www.smkn1surabaya.sch.id" className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-slate-700 focus:bg-white transition-all" />
                  </div>

                  {/* Kepala Sekolah */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <User size={16} className="text-slate-400" /> Kepala Sekolah
                    </Label>
                    <Input defaultValue="Drs. H. Sutrisno, M.Pd." className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-slate-700 focus:bg-white transition-all" />
                  </div>

                  {/* NPSN */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Hash size={16} className="text-slate-400" /> NPSN
                    </Label>
                    <Input defaultValue="20567890" className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-slate-700 focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="pt-6 mt-2 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1.5 rounded-lg w-fit">
                      <CheckCircle2 size={14} className="text-green-500" />
                      Terakhir diperbarui: 1 Januari 2024 pukul 07.00
                   </div>
                </div>
              </div>
            </Card>
          </div>

          {/* KOLOM KANAN: PREVIEW & INFO */}
          <div className="space-y-6">
            
            {/* Kartu Informasi Preview */}
            <Card className="border-none shadow-sm rounded-[24px] bg-white p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <Eye size={100} className="text-blue-200" />
              </div>
              <div className="flex items-center gap-3 mb-2 text-[#0EA5E9]">
                <div className="p-2 bg-blue-50 rounded-lg">
                   <Eye size={20} />
                </div>
                <h4 className="font-bold text-lg text-slate-800">Preview Tampilan</h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium pl-1">
                Berikut adalah simulasi bagaimana data sekolah akan ditampilkan di berbagai bagian sistem.
              </p>
            </Card>

            {/* Preview 1: Dashboard Header */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-2 uppercase tracking-wide">
                <Monitor size={14} /> Dashboard Header
              </Label>
              <Card className="border-none shadow-sm rounded-[24px] bg-white p-6">
                <div className="bg-[#F0F9FF] border border-blue-100 rounded-2xl p-5 flex items-center gap-5 shadow-sm">
                  <div className="w-14 h-14 bg-white rounded-xl border border-blue-100 flex items-center justify-center text-[10px] text-slate-400 font-bold shadow-sm">
                    Logo
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-base">SMK Brantas Karangkates</h5>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Sistem Informasi Magang</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Preview 2: Kop Surat / Sertifikat */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-2 uppercase tracking-wide">
                <FileText size={14} /> Header Rapor / Sertifikat
              </Label>
              <Card className="border-none shadow-sm rounded-[24px] bg-white p-8">
                <div className="border border-slate-200 rounded-2xl p-6 text-center relative bg-white">
                  <div className="flex items-center justify-center gap-5 mb-5">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-slate-400">Logo</span>
                    </div>
                    <div className="text-left">
                      <h5 className="font-black text-slate-800 text-lg uppercase tracking-tight leading-tight">SMK Brantas Karangkates</h5>
                      <p className="text-[11px] text-slate-500 leading-snug mt-1 max-w-[280px]">
                        Jl. SMEA No.4, Sawahan, Kec. Sawahan, Kota Surabaya, Jawa Timur 60252
                      </p>
                      <div className="flex gap-3 mt-1.5 text-[10px] text-slate-500 font-medium">
                         <span>📞 031-5678910</span>
                         <span>📧 info@smkn1surabaya.sch.id</span>
                      </div>
                      <p className="text-[10px] text-[#0EA5E9] font-bold mt-0.5 underline cursor-pointer">
                        www.smkn1surabaya.sch.id
                      </p>
                    </div>
                  </div>
                  <div className="border-t-2 border-slate-800 w-full mb-1"></div>
                  <div className="border-t border-slate-300 w-full mb-4"></div>
                  
                  <p className="text-sm font-bold text-slate-800 uppercase tracking-[0.2em]">SERTIFIKAT MAGANG</p>
                </div>
              </Card>
            </div>

            {/* Preview 3: Footer Dokumen */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-2 uppercase tracking-wide">
                <Printer size={14} /> Footer Dokumen Cetak
              </Label>
              <Card className="border-none shadow-sm rounded-[24px] bg-white p-6">
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                      <ImageIcon size={16} className="text-slate-300" />
                    </div>
                    <div className="space-y-1 w-full">
                      <div className="flex justify-between items-center">
                         <p className="font-bold text-xs text-slate-800">SMK Brantas Karangkates</p>
                         <Badge variant="outline" className="text-[9px] bg-white text-slate-500 h-5">NPSN: 20567890</Badge>
                      </div>
                      <div className="text-[10px] text-slate-500 leading-snug pt-1 border-t border-slate-200 mt-2">
                        <p>📍 Jl. SMEA No.4, Sawahan, Surabaya</p>
                        <p className="mt-0.5">👤 Kepala Sekolah: <span className="font-semibold text-slate-700">Drs. H. Sutrisno, M.Pd.</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Info Footer Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
              <h5 className="font-bold text-[#0EA5E9] text-xs mb-4 uppercase tracking-wider flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]"></div> Informasi Penggunaan
              </h5>
              <ul className="space-y-3">
                <li className="flex gap-3 text-xs text-slate-600 leading-relaxed">
                  <div className="bg-white p-1 rounded-md shadow-sm border border-blue-50 text-blue-500 shrink-0 h-fit">
                     <Monitor size={12} />
                  </div>
                  <span><b>Dashboard:</b> Logo dan nama sekolah akan ditampilkan di pojok kiri atas pada setiap halaman sistem.</span>
                </li>
                <li className="flex gap-3 text-xs text-slate-600 leading-relaxed">
                  <div className="bg-white p-1 rounded-md shadow-sm border border-blue-50 text-blue-500 shrink-0 h-fit">
                     <FileText size={12} />
                  </div>
                  <span><b>Dokumen Resmi:</b> Informasi ini digunakan sebagai <b>Kop Surat</b> otomatis pada sertifikat dan laporan nilai siswa.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
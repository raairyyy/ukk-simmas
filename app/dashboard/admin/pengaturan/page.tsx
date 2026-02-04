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
  Hash
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function SettingsPage() {
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
              <p className="text-base font-bold text-slate-800">Admin Sistem</p>
              <p className="text-sm text-slate-500 font-medium">Admin</p>
            </div>
            <Avatar className="h-12 w-12 bg-[#0EA5E9] text-white ring-4 ring-slate-50 cursor-pointer">
              <AvatarFallback className="bg-[#0EA5E9] text-white font-bold"><User size={24} /></AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-10 max-w-[1680px] mx-auto space-y-8">
          
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pengaturan Sekolah</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* === KOLOM KIRI: FORM EDIT (Lebar 50%) === */}
            <div className="space-y-8">
              <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden p-8">
                
                {/* Judul Card & Tombol Edit */}
                <div className="flex justify-between items-center mb-8">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-transparent text-[#0EA5E9]">
                         <Settings size={26} strokeWidth={2.5} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Informasi Sekolah</h3>
                   </div>
                   <Button className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold h-10 px-6 rounded-lg text-sm transition-all hover:scale-105 shadow-md shadow-blue-200/50">
                      <Pencil size={14} className="mr-2" strokeWidth={3} /> Edit
                   </Button>
                </div>
                
                <div className="space-y-6">
                   {/* Logo Upload */}
                   <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-500 ml-1">Logo Sekolah</Label>
                      <div className="w-24 h-24 bg-[#F8FAFC] border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-1 cursor-pointer hover:bg-slate-100 transition-colors">
                         <ImageIcon size={24} />
                         <span className="text-[10px] font-bold text-slate-400">Logo</span>
                      </div>
                   </div>

                   {/* Nama Sekolah */}
                   <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-500 ml-1 flex items-center gap-2">
                        <Building2 size={16} /> Nama Sekolah/Instansi
                      </Label>
                      <Input defaultValue="SMK Negeri 1 Surabaya" className="h-[46px] text-[15px] rounded-xl border-slate-100 bg-[#F8FAFC] font-medium text-slate-700 focus:bg-white focus:border-blue-200 transition-all" />
                   </div>

                   {/* Alamat Lengkap */}
                   <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-500 ml-1 flex items-center gap-2">
                        <MapPin size={16} /> Alamat Lengkap
                      </Label>
                      <Textarea 
                        defaultValue="Jl. SMEA No.4, Wonokromo, Surabaya, Jawa Timur 60243" 
                        className="min-h-[100px] text-[15px] rounded-xl border-slate-100 bg-[#F8FAFC] font-medium text-slate-700 focus:bg-white focus:border-blue-200 transition-all py-3 leading-relaxed resize-none" 
                      />
                   </div>

                   {/* Kontak Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <Label className="text-sm font-semibold text-slate-500 ml-1 flex items-center gap-2">
                            <Phone size={16} /> Telepon
                         </Label>
                         <Input defaultValue="031-8292038" className="h-[46px] text-[15px] rounded-xl border-slate-100 bg-[#F8FAFC] font-medium text-slate-700 focus:bg-white focus:border-blue-200 transition-all" />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-sm font-semibold text-slate-500 ml-1 flex items-center gap-2">
                            <Mail size={16} /> Email
                         </Label>
                         <Input defaultValue="info@smkn1surabaya.sch.id" className="h-[46px] text-[15px] rounded-xl border-slate-100 bg-[#F8FAFC] font-medium text-slate-700 focus:bg-white focus:border-blue-200 transition-all" />
                      </div>
                   </div>

                   {/* Website */}
                   <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-500 ml-1 flex items-center gap-2">
                        <Globe size={16} /> Website
                      </Label>
                      <Input defaultValue="www.smkn1surabaya.sch.id" className="h-[46px] text-[15px] rounded-xl border-slate-100 bg-[#F8FAFC] font-medium text-slate-700 focus:bg-white focus:border-blue-200 transition-all" />
                   </div>

                   {/* Kepala Sekolah */}
                   <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-500 ml-1 flex items-center gap-2">
                        <User size={16} /> Kepala Sekolah
                      </Label>
                      <Input defaultValue="Drs. H. Sutrisno, M.Pd." className="h-[46px] text-[15px] rounded-xl border-slate-100 bg-[#F8FAFC] font-medium text-slate-700 focus:bg-white focus:border-blue-200 transition-all" />
                   </div>

                   {/* NPSN */}
                   <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-500 ml-1 flex items-center gap-2">
                        <Hash size={16} /> # NPSN (Nomor Pokok Sekolah Nasional)
                      </Label>
                      <Input defaultValue="20567890" className="h-[46px] text-[15px] rounded-xl border-slate-100 bg-[#F8FAFC] font-medium text-slate-700 focus:bg-white focus:border-blue-200 transition-all" />
                   </div>

                   <div className="pt-6 mt-4">
                      <p className="text-xs text-slate-400 italic font-medium">Terakhir diperbarui: 1 Januari 2024 pukul 07.00</p>
                   </div>
                </div>
              </Card>
            </div>

            {/* === KOLOM KANAN: PREVIEW (Lebar 50%) === */}
            <div className="space-y-6">
               
               {/* Preview Info */}
               <Card className="border-none shadow-sm rounded-[24px] bg-white p-6">
                  <div className="flex items-center gap-2 mb-2 text-[#0EA5E9]">
                     <Eye size={18} />
                     <h4 className="font-bold text-base text-slate-800">Preview Tampilan</h4>
                  </div>
                  <p className="text-sm text-slate-500 leading-snug">Pratinjau bagaimana informasi sekolah akan ditampilkan.</p>
               </Card>

               {/* 1. Dashboard Header */}
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-500 ml-1">
                     <Monitor size={16} />
                     <span className="text-xs font-bold text-slate-600">Dashboard Header</span>
                  </div>
                  <Card className="border-none shadow-sm rounded-[24px] bg-white p-5 overflow-hidden">
                     <div className="bg-[#F0F9FF] border border-blue-100 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                           <span className="text-[10px] font-bold text-slate-400">Logo</span>
                        </div>
                        <div>
                           <h5 className="font-bold text-slate-800 text-sm">SMK Negeri 1 Surabaya</h5>
                           <p className="text-xs text-slate-500">Sistem Informasi Magang</p>
                        </div>
                     </div>
                  </Card>
               </div>

               {/* 2. Header Rapor/Sertifikat */}
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-500 ml-1">
                     <FileText size={16} />
                     <span className="text-xs font-bold text-slate-600">Header Rapor/Sertifikat</span>
                  </div>
                  <Card className="border-none shadow-sm rounded-[24px] bg-white p-6 overflow-hidden">
                     <div className="border border-slate-200 rounded-xl p-5 text-center relative">
                        <div className="flex items-center justify-center gap-4 mb-4">
                           <div className="w-14 h-14 bg-[#F8FAFC] rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-slate-400">Logo</span>
                           </div>
                           <div className="text-left">
                              <h5 className="font-black text-slate-900 text-sm uppercase tracking-wide leading-tight">SMK Negeri 1 Surabaya</h5>
                              <p className="text-[10px] text-slate-500 leading-tight mt-1 max-w-[200px]">
                                 Jl. SMEA No.4, Surabaya, Jawa Timur
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                 Telp: 031-5678910 • info@smkn1surabaya.sch.id
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                 Web: www.smkn1surabaya.sch.id
                              </p>
                           </div>
                        </div>
                        <div className="border-t border-slate-200 w-full pt-3">
                           <p className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">SERTIFIKAT MAGANG</p>
                        </div>
                     </div>
                  </Card>
               </div>

               {/* 3. Dokumen Cetak */}
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-500 ml-1">
                     <Printer size={16} />
                     <span className="text-xs font-bold text-slate-600">Dokumen Cetak</span>
                  </div>
                  <Card className="border-none shadow-sm rounded-[24px] bg-white p-6 overflow-hidden">
                     <div className="bg-[#F8FAFC] border border-dashed border-slate-300 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="w-8 h-8 bg-white rounded border border-slate-200 flex items-center justify-center">
                              <ImageIcon size={14} className="text-slate-300" />
                           </div>
                           <div>
                              <p className="font-bold text-xs text-slate-800">SMK Negeri 1 Surabaya</p>
                              <p className="text-[10px] text-slate-400 font-mono">NPSN: 20567890</p>
                           </div>
                        </div>
                        <div className="pt-2 border-t border-slate-200 space-y-1 text-[10px] text-slate-500 font-medium">
                           <p>📍 Jl. SMEA No.4, Sawahan, Surabaya</p>
                           <p>📧 info@smkn1surabaya.sch.id</p>
                           <p className="pt-1 text-slate-400">👤 Kepala Sekolah: Drs. H. Sutrisno, M.Pd.</p>
                        </div>
                     </div>
                  </Card>
               </div>

               {/* Info Footer */}
               <div className="bg-[#F0F9FF] border border-blue-100 rounded-2xl p-5 mt-4">
                  <h5 className="font-bold text-[#0EA5E9] text-xs mb-3">Informasi Penggunaan:</h5>
                  <ul className="space-y-2">
                     <li className="flex gap-3 text-xs text-slate-600 leading-snug">
                        <Monitor size={14} className="shrink-0 text-blue-500 mt-0.5" />
                        <span><b>Dashboard:</b> Logo dan nama sekolah ditampilkan di header navigasi</span>
                     </li>
                     <li className="flex gap-3 text-xs text-slate-600 leading-snug">
                        <FileText size={14} className="shrink-0 text-blue-500 mt-0.5" />
                        <span><b>Rapor/Sertifikat:</b> Informasi lengkap sebagai kop dokumen resmi</span>
                     </li>
                     <li className="flex gap-3 text-xs text-slate-600 leading-snug">
                        <Printer size={14} className="shrink-0 text-blue-500 mt-0.5" />
                        <span><b>Dokumen Cetak:</b> Footer atau header pada laporan yang dicetak</span>
                     </li>
                  </ul>
               </div>

            </div>

          </div>
        </div>
    </>
  )
}
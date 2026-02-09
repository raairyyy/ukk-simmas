"use client"

import { useEffect, useState, useRef } from "react"
import {
  Building2, Settings, Pencil, Eye, FileText, Monitor, User,
  Image as ImageIcon, MapPin, Phone, Mail, Globe, Hash, Bell, LogOut, Save, X, Loader2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClient } from "@supabase/supabase-js"

// Inisialisasi Client Supabase untuk Upload Storage
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SettingsPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [schoolData, setSchoolData] = useState({
    id: null,
    nama_sekolah: "",
    alamat: "",
    telepon: "",
    email: "",
    website: "",
    kepala_sekolah: "",
    npsn: "",
    logo_url: "" // URL Logo disimpan di sini
  })

  useEffect(() => {
    fetchUserData()
    fetchSettings()
  }, [])

  const fetchUserData = () => {
    fetch("/api/auth/me").then(res => res.json()).then(data => setUserData(data.user))
  }

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/school-settings", { cache: "no-store" })
      const json = await res.json()
      if (json.data) {
        setSchoolData(json.data)
      }
    } catch (err) {
      console.error("Gagal mengambil data:", err)
    }
  }

  // --- FUNGSI UPLOAD LOGO ---
// --- FUNGSI UPLOAD LOGO YANG DIPERBAIKI ---
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploadingLogo(true)
    const file = e.target.files[0]
    
    // Pastikan nama file unik & bersih
    const fileExt = file.name.split('.').pop()
    const fileName = `logo-${Date.now()}.${fileExt}`
    const filePath = `${fileName}` // Simpan di root bucket school-assets

    try {
      // 1. Upload ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('school-assets') // Pastikan nama bucket ini benar di dashboard Supabase
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Timpa jika file dengan nama sama ada (walau kecil kemungkinan krn timestamp)
        })

      if (uploadError) throw uploadError

      // 2. Ambil Public URL yang Valid
      const { data } = supabase.storage
        .from('school-assets')
        .getPublicUrl(filePath)
      
      const publicUrl = data.publicUrl;

      // 3. Update State Lokal (Agar preview langsung berubah)
      setSchoolData(prev => ({ ...prev, logo_url: publicUrl }))

    } catch (error: any) {
      console.error("Upload error:", error)
      alert("Gagal upload logo: " + error.message)
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/school-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schoolData)
      })
      
      if (res.ok) {
        setIsEditing(false)
        fetchSettings()
      } else {
        const errData = await res.json()
        alert("Gagal menyimpan: " + errData.error)
      }
    } catch (err) {
      console.error("Error saving settings:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HEADER UTAMA */}
      <header className="bg-white border-b border-slate-100 h-[90px] px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Logo di Header Utama */}
          {schoolData.logo_url ? (
            <img src={schoolData.logo_url} alt="Logo" className="h-10 w-10 object-contain" />
          ) : (
            <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-slate-400"/>
            </div>
          )}
          <div>
            <h2 className="font-bold text-xl text-slate-800">{schoolData.nama_sekolah || "SMK Brantas"}</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">Sistem Manajemen Magang Siswa</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button className="text-slate-400 hover:text-slate-600 relative">
            <Bell size={24} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="relative">
            <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-4 cursor-pointer">
              <div className="w-12 h-12 bg-[#00A9D8] rounded-[14px] flex items-center justify-center text-white"><User size={26} /></div>
              <div className="text-left hidden sm:block">
                <p className="text-[17px] font-bold text-[#1E293B] leading-none">{userData?.name || "Admin"}</p>
                <p className="text-sm text-slate-400 font-semibold mt-1.5 uppercase tracking-wider">Admin</p>
              </div>
            </div>
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 font-bold text-sm">
                  <LogOut size={18} /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="p-8 xl:p-10 max-w-[1680px] mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Pengaturan Sekolah</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* KOLOM KIRI: FORM */}
          <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-[24px] bg-white p-8">
              <div className="flex justify-between items-center mb-8 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 text-[#0EA5E9] bg-blue-50 rounded-lg"><Settings size={24} /></div>
                  <h3 className="text-xl font-bold text-slate-800">Informasi Sekolah</h3>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="bg-[#0EA5E9] hover:bg-[#0284C7] rounded-xl font-bold h-10 px-6 transition-transform hover:scale-105">
                    <Pencil size={16} className="mr-2" /> Edit Data
                  </Button>
                ) : (
                  <div className="flex gap-2 animate-in fade-in">
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl font-bold h-10 px-4">
                      <X size={16} className="mr-2" /> Batal
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold h-10 px-4">
                      <Save size={16} className="mr-2" /> {loading ? "..." : "Simpan"}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                {/* INPUT LOGO */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Logo Sekolah</Label>
                  <div 
                    onClick={() => isEditing && fileInputRef.current?.click()}
                    className={`w-32 h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center relative overflow-hidden transition-all 
                      ${isEditing ? "bg-[#F8FAFC] border-blue-300 cursor-pointer hover:bg-blue-50" : "bg-slate-50 border-slate-200 cursor-default"}`}
                  >
                    {uploadingLogo ? (
                      <div className="flex flex-col items-center text-blue-500">
                        <Loader2 className="animate-spin mb-1" size={24} />
                        <span className="text-[10px]">Uploading...</span>
                      </div>
                    ) : schoolData.logo_url ? (
                      <img src={schoolData.logo_url} alt="Logo Sekolah" className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 gap-2">
                        <ImageIcon size={28} />
                        <span className="text-[10px] font-bold uppercase">Upload</span>
                      </div>
                    )}
                    
                    {/* Hidden Input File */}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={!isEditing}
                    />
                  </div>
                  {isEditing && <p className="text-[10px] text-slate-400">*Klik kotak di atas untuk mengganti logo</p>}
                </div>

                <div className="grid gap-6">
                  {/* Form Fields (Sama seperti sebelumnya) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Building2 size={16}/> Nama Sekolah</Label>
                    <Input disabled={!isEditing} value={schoolData.nama_sekolah} onChange={e => setSchoolData({...schoolData, nama_sekolah: e.target.value})} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2"><MapPin size={16}/> Alamat Lengkap</Label>
                    <Textarea disabled={!isEditing} value={schoolData.alamat} onChange={e => setSchoolData({...schoolData, alamat: e.target.value})} className="min-h-[100px] rounded-xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Phone size={16}/> Telepon</Label>
                      <Input disabled={!isEditing} value={schoolData.telepon} onChange={e => setSchoolData({...schoolData, telepon: e.target.value})} className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Mail size={16}/> Email</Label>
                      <Input disabled={!isEditing} value={schoolData.email} onChange={e => setSchoolData({...schoolData, email: e.target.value})} className="h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Globe size={16}/> Website</Label>
                    <Input disabled={!isEditing} value={schoolData.website} onChange={e => setSchoolData({...schoolData, website: e.target.value})} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2"><User size={16}/> Kepala Sekolah</Label>
                    <Input disabled={!isEditing} value={schoolData.kepala_sekolah} onChange={e => setSchoolData({...schoolData, kepala_sekolah: e.target.value})} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Hash size={16}/> NPSN</Label>
                    <Input disabled={!isEditing} value={schoolData.npsn} onChange={e => setSchoolData({...schoolData, npsn: e.target.value})} className="h-12 rounded-xl" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* KOLOM KANAN: PREVIEW */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-[24px] bg-white p-6">
              <div className="flex items-center gap-3 text-[#0EA5E9] mb-2 font-bold"><Eye size={20} /> Preview Tampilan</div>
              <p className="text-sm text-slate-500">Live preview logo dan data sekolah.</p>
            </Card>

            {/* PREVIEW DASHBOARD HEADER */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400 uppercase ml-1">Dashboard Header</Label>
              <Card className="border-none shadow-sm rounded-[24px] bg-white p-6">
                <div className="bg-[#F0F9FF] border border-blue-100 rounded-2xl p-5 flex items-center gap-5">
                  <div className="w-16 h-16 bg-white rounded-xl border border-blue-100 flex items-center justify-center p-2">
                    {schoolData.logo_url ? (
                      <img src={schoolData.logo_url} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-300 font-bold">LOGO</span>
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-lg">{schoolData.nama_sekolah || "Nama Sekolah"}</h5>
                    <p className="text-xs text-slate-500">Sistem Informasi Magang</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* PREVIEW HEADER RAPOR */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400 uppercase ml-1">Header Rapor</Label>
              <Card className="border-none shadow-sm rounded-[24px] bg-white p-8">
                <div className="border border-slate-200 rounded-2xl p-6 text-center">
                  <div className="flex items-center justify-center gap-5 mb-5 text-left">
                    <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-2">
                      {schoolData.logo_url ? (
                        <img src={schoolData.logo_url} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-slate-300 font-bold">LOGO</span>
                      )}
                    </div>
                    <div>
                      <h5 className="font-black text-slate-800 text-lg uppercase leading-tight">{schoolData.nama_sekolah || "NAMA SEKOLAH"}</h5>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-[300px] leading-snug">{schoolData.alamat || "Alamat Lengkap"}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Telp: {schoolData.telepon} | Email: {schoolData.email}</p>
                    </div>
                  </div>
                  <div className="border-t-2 border-slate-800 w-full mb-1"></div>
                  <div className="border-t border-slate-300 w-full mb-4"></div>
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-widest">SERTIFIKAT MAGANG</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
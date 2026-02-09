"use client"

import { useEffect, useState } from "react"
import {
  Building2, Settings, Pencil, Eye, FileText, Monitor, User,
  Image as ImageIcon, MapPin, Phone, Mail, Globe, Hash, Bell, LogOut, Save, X
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { SharedHeader } from "@/components/shared-header"


export default function SettingsPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  
  // State data sekolah (Harus sesuai nama kolom di database)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [schoolData, setSchoolData] = useState({
    id: null,
    nama_sekolah: "",
    alamat: "",
    telepon: "",
    email: "",
    website: "",
    kepala_sekolah: "",
    npsn: "",
    logo_url: ""
  })

  useEffect(() => {
    fetchUserData()
    fetchSettings()
  }, [])

  const fetchUserData = () => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUserData(data.user))
      .catch(err => console.error("Gagal ambil profil:", err))
  }

  const fetchSettings = async () => {
    try {
      // ✅ FIX: URL harus sama dengan folder API (school-settings)
      const res = await fetch("/api/school-settings")
      const json = await res.json()
      if (json.data) {
        setSchoolData(json.data)
      }
    } catch (err) {
      console.error("Gagal mengambil data dari Supabase:", err)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // ✅ FIX: URL harus sama dengan folder API (school-settings)
      const res = await fetch("/api/school-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schoolData)
      })
      
      if (res.ok) {
        setIsEditing(false)
        fetchSettings() // Refresh agar preview sinkron
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
      <SharedHeader />

      <div className="p-8 xl:p-10 max-w-[1680px] mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Pengaturan Sekolah</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-[24px] bg-white p-8">
              <div className="flex justify-between items-center mb-8 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 text-[#0EA5E9] bg-blue-50 rounded-lg"><Settings size={24} /></div>
                  <h3 className="text-xl font-bold text-slate-800">Informasi Sekolah</h3>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="bg-[#0EA5E9] hover:bg-[#0284C7] rounded-xl font-bold h-10 px-6 shadow-md transition-transform hover:scale-105">
                    <Pencil size={16} className="mr-2" /> Edit Data
                  </Button>
                ) : (
                  <div className="flex gap-2">
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
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Logo Sekolah</Label>
                  <div className={`w-24 h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2 ${isEditing ? "bg-slate-50 cursor-pointer" : "bg-slate-100/50"}`}>
                    <ImageIcon size={24} />
                    <span className="text-[10px] font-bold">LOGO</span>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Building2 size={16}/> Nama Sekolah</Label>
                    <Input 
                      disabled={!isEditing} 
                      value={schoolData.nama_sekolah} 
                      onChange={e => setSchoolData({...schoolData, nama_sekolah: e.target.value})}
                      className="h-12 rounded-xl" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2"><MapPin size={16}/> Alamat Lengkap</Label>
                    <Textarea 
                      disabled={!isEditing} 
                      value={schoolData.alamat} 
                      onChange={e => setSchoolData({...schoolData, alamat: e.target.value})}
                      className="min-h-[100px] rounded-xl" 
                    />
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

          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-[24px] bg-white p-6">
              <div className="flex items-center gap-3 text-[#0EA5E9] mb-2 font-bold"><Eye size={20} /> Preview Tampilan</div>
              <p className="text-sm text-slate-500">Live preview berdasarkan data yang sedang Anda edit.</p>
            </Card>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400 uppercase ml-1">Dashboard Header</Label>
              <Card className="border-none shadow-sm rounded-[24px] bg-white p-6">
                <div className="bg-[#F0F9FF] border border-blue-100 rounded-2xl p-5 flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-xl border flex items-center justify-center text-[10px] text-slate-300 font-bold">LOGO</div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-base">{schoolData.nama_sekolah || "Nama Sekolah"}</h5>
                    <p className="text-xs text-slate-500">Sistem Informasi Magang</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400 uppercase ml-1">Header Rapor</Label>
              <Card className="border-none shadow-sm rounded-[24px] bg-white p-8">
                <div className="border border-slate-200 rounded-2xl p-6 text-center">
                   <h5 className="font-black text-slate-800 text-lg uppercase">{schoolData.nama_sekolah || "NAMA SEKOLAH"}</h5>
                   <p className="text-[10px] text-slate-500 mt-1">{schoolData.alamat || "Alamat"}</p>
                   <p className="text-[10px] text-slate-500">Telp: {schoolData.telepon} | Email: {schoolData.email}</p>
                   <div className="border-t-2 border-slate-800 w-full my-4"></div>
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
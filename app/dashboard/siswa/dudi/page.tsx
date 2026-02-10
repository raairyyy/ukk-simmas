"use client"

import { useEffect, useState } from "react"
import { 
  Building2, Search, MapPin, User, Info, 
  Send, CheckCircle2, XCircle, Bell, LogOut, X
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { SharedHeader } from "@/components/shared-header"

// Tipe Data
type Dudi = {
  id: number
  nama_perusahaan: string
  alamat: string
  telepon: string
  email: string
  penanggung_jawab: string
  status_magang?: "tersedia" | "menunggu" | "sudah_mendaftar"
  kuota_total: number
  kuota_terisi: number
  bidang_usaha: string
  deskripsi: string
}

export default function SiswaDudiList() {
  const [dudiList, setDudiList] = useState<Dudi[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedDudi, setSelectedDudi] = useState<Dudi | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  
  
  // Toast State
const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("") // <--- INI YANG HILANG
  const [toastType, setToastType] = useState<"success" | "error">("success")  
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    fetchUserData()
    fetchDudi()
  }, [])

  const fetchUserData = async () => {
    const res = await fetch("/api/auth/me")
    const data = await res.json()
    setUserData(data.user)
  }

const fetchDudi = async () => {
    setLoading(true)
    try {
      // Panggil API DUDI dan API SISWA MAGANG (Riwayat)
      // Gunakan { cache: 'no-store' } agar data selalu fresh setelah daftar
      const [resDudi, resMe] = await Promise.all([
        fetch("/api/dudi", { cache: "no-store" }),
        fetch("/api/siswa/magang", { cache: "no-store" }) // ✅ URL BENAR
      ])

      const jsonDudi = await resDudi.json()
      
      // Handle jika API siswa error atau belum ada data
      let myApplications: any[] = []
      if (resMe.ok) {
        const jsonMe = await resMe.json()
        myApplications = jsonMe.data || []
      }

      if (resDudi.ok) {
        const enhancedData = jsonDudi.data.map((d: any) => {
          // Cek status pendaftaran siswa di perusahaan ini
          // myApplications berisi array [{dudi_id: 1, status: 'pending'}, ...]
          const myApp = myApplications.find((m: any) => m.dudi_id === d.id)
          
          let status = "tersedia"

          if (myApp) {
             if (myApp.status === "pending") status = "menunggu"
             else if (myApp.status === "berlangsung" || myApp.status === "diterima") status = "berlangsung"
             else if (myApp.status === "ditolak") status = "tersedia" // Boleh daftar lagi jika ditolak
          }

          return {
            ...d,
            kuota_total: d.kuota_total || 12,
            kuota_terisi: d.total_siswa_magang || 0,
            status_magang: status 
          }
        })
        setDudiList(enhancedData)
      }
    } catch (err) {
      console.error("Gagal memuat data:", err)
    } finally {
      setLoading(false)
    }
  }
// ... kode lainnya ...

const handleDaftar = async (id: number) => {
    try {
      const res = await fetch("/api/siswa/magang", { // ✅ URL BENAR (POST)
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dudi_id: id })
      })

      const json = await res.json()

      if (res.ok) {
        setToastType("success")
        setToastMessage("Pendaftaran berhasil! Menunggu verifikasi guru.")
        setShowToast(true)
        setIsDetailOpen(false)
        await fetchDudi() // Refresh data
      } else {
        // 🛑 TANGKAP ERROR DARI BACKEND DISINI
        setToastType("error")
        // Backend mengirim: { error: "Batas maksimal pendaftaran tercapai..." }
        setToastMessage(json.error || "Gagal mendaftar magang") 
        setShowToast(true)
      }
    } catch (error) {
      setToastType("error")
      setToastMessage("Terjadi kesalahan sistem")
      setShowToast(true)
    } finally {
      setTimeout(() => setShowToast(false), 4000)
    }
  }

  // ... kode lainnya ...

  const filteredDudi = dudiList.filter(d =>
    d.nama_perusahaan.toLowerCase().includes(search.toLowerCase()) ||
    d.bidang_usaha.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* TOAST SUCCESS (GAMBAR 15) */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[200] animate-in slide-in-from-right duration-300">
          <div className="bg-[#84cc16] text-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20 min-w-[400px]">
            <div className="bg-white/20 p-1.5 rounded-full">
              <CheckCircle2 size={20} strokeWidth={3} />
            </div>
            <p className="font-bold text-sm flex-1 leading-relaxed">
              Pendaftaran magang berhasil diajukan, menunggu verifikasi dari pihak guru.
            </p>
            <button onClick={() => setShowToast(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <SharedHeader />

      <main className="p-10 max-w-[1600px] mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Cari Tempat Magang</h1>
          
          <div className="relative w-full md:w-[500px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input 
              placeholder="Cari perusahaan, bidang..." 
              className="pl-12 h-14 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-100 text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* GRID LIST DUDI (GAMBAR 13) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p>Memuat daftar DUDI...</p>
          ) : filteredDudi.map((d) => (
            <Card key={d.id} className="border-none shadow-sm rounded-[28px] overflow-hidden hover:shadow-md transition-all group">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-[#F0F9FF] text-[#00A9D8] rounded-2xl group-hover:bg-[#00A9D8] group-hover:text-white transition-colors">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">{d.nama_perusahaan}</h3>
                      <p className="text-sm text-[#00A9D8] font-bold mt-1">{d.bidang_usaha}</p>
                      {d.status_magang === "menunggu" && (
                        <Badge className="bg-amber-100 text-amber-700 border-none mt-2 font-bold px-3 py-1 rounded-lg">Menunggu</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-slate-500 text-sm">
                  <p className="flex items-center gap-2.5 font-medium"><MapPin size={16} className="text-slate-300" /> {d.alamat}</p>
                  <p className="flex items-center gap-2.5 font-medium"><User size={16} className="text-slate-300" /> PIC: {d.penanggung_jawab}</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-400">Kuota Magang</span>
                    <span className="text-slate-700">{d.kuota_terisi}/{d.kuota_total}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00A9D8] rounded-full transition-all duration-500" 
                      style={{ width: `${(d.kuota_terisi / d.kuota_total) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{d.kuota_total - d.kuota_terisi} slot tersisa</p>
                </div>

                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed italic border-l-4 border-slate-100 pl-4">
                  {d.deskripsi}
                </p>

                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => { setSelectedDudi(d); setIsDetailOpen(true); }}
                    className="flex-1 h-12 rounded-xl font-bold text-slate-600 border-slate-200"
                  >
                    <Info size={18} className="mr-2" /> Detail
                  </Button>
                  
                  {d.status_magang === "tersedia" ? (
                    <Button 
                      onClick={() => handleDaftar(d.id)}
                      className="flex-1 h-12 rounded-xl font-bold bg-[#00A9D8] hover:bg-[#0092ba] text-white shadow-lg shadow-blue-100"
                    >
                      <Send size={18} className="mr-2" /> Daftar
                    </Button>
                  ) : (
                    <Button disabled className="flex-1 h-12 rounded-xl font-bold bg-slate-200 text-slate-400">
                      Sudah Mendaftar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* MODAL DETAIL (GAMBAR 16 & 17) */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-[32px] p-0 overflow-hidden border-none">
          {selectedDudi && (
            <div className="relative">
              <div className="p-8 space-y-8">
                {/* Header Detail */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-[#00A9D8] text-white rounded-2xl"><Building2 size={24} /></div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{selectedDudi.nama_perusahaan}</h2>
                      <p className="text-sm text-[#00A9D8] font-bold">{selectedDudi.bidang_usaha}</p>
                    </div>
                  </div>
                  {selectedDudi.status_magang === "menunggu" && (
                    <Badge className="bg-amber-100 text-amber-700 border-none font-bold px-4 py-1.5 rounded-lg">Menunggu Verifikasi</Badge>
                  )}
                </div>

                <div className="space-y-6">
                  <section className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#00A9D8] rounded-full"></div> Tentang Perusahaan
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {selectedDudi.deskripsi}
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#00A9D8] rounded-full"></div> Informasi Kontak
                    </h4>
                    <div className="grid gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase">Alamat</Label>
                        <p className="text-sm font-bold text-slate-700">{selectedDudi.alamat}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                          <Label className="text-[10px] font-bold text-slate-400 uppercase">Telepon</Label>
                          <p className="text-sm font-bold text-slate-700">{selectedDudi.telepon}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                          <Label className="text-[10px] font-bold text-slate-400 uppercase">Email</Label>
                          <p className="text-sm font-bold text-slate-700 truncate">{selectedDudi.email}</p>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase">Penanggung Jawab</Label>
                        <p className="text-sm font-bold text-slate-700">{selectedDudi.penanggung_jawab}</p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#00A9D8] rounded-full"></div> Informasi Magang
                    </h4>
                    <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100 flex justify-between items-center">
                       <div className="space-y-1">
                         <p className="text-[10px] font-bold text-blue-400 uppercase">Kuota Magang</p>
                         <p className="text-lg font-black text-slate-800">{selectedDudi.kuota_terisi} / {selectedDudi.kuota_total}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-bold text-blue-400 uppercase">Status Slot</p>
                         <p className="text-sm font-bold text-[#00A9D8]">{selectedDudi.kuota_total - selectedDudi.kuota_terisi} slot tersedia</p>
                       </div>
                    </div>
                  </section>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <Button variant="ghost" onClick={() => setIsDetailOpen(false)} className="flex-1 h-12 font-bold text-slate-400">Tutup</Button>
                  {selectedDudi.status_magang === "tersedia" ? (
                    <Button 
                      onClick={() => handleDaftar(selectedDudi.id)}
                      className="flex-2 h-12 px-10 rounded-xl font-bold bg-[#00A9D8] hover:bg-[#0092ba] text-white shadow-lg"
                    >
                      Daftar Magang
                    </Button>
                  ) : (
                    <Button disabled className="flex-2 h-12 px-10 rounded-xl font-bold bg-slate-100 text-slate-400">
                      Sudah Mendaftar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function setToastType(arg0: string) {
  throw new Error("Function not implemented.")
}

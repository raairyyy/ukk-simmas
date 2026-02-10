"use client"

import { useEffect, useState } from "react"
import {
  BookOpen, Clock, ThumbsUp, ThumbsDown, Search, Filter, Eye,
  ChevronLeft, ChevronRight, Download, Edit, X, CheckCircle, FileText
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { SharedHeader } from "@/components/shared-header"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { createClient } from "@supabase/supabase-js"

// --- KONFIGURASI SUPABASE CLIENT ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ⚠️ GANTI SESUAI NAMA BUCKET ANDA DI SUPABASE STORAGE
const BUCKET_NAME = "logbook" 

export default function GuruJurnalPage() {
  const [data, setData] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, disetujui: 0, ditolak: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  // Modal States
  const [selectedLogbook, setSelectedLogbook] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [guruNote, setGuruNote] = useState("")
  const [isNoteEditing, setIsNoteEditing] = useState(false)

  // Fetch Data
  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/guru/logbook")
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setStats(json.stats)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filter Logic
  const filteredData = data.filter(item => 
    item.magang?.siswa?.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.kegiatan?.toLowerCase().includes(search.toLowerCase())
  )

  // Handle Open Detail
  const openDetail = (item: any) => {
    setSelectedLogbook(item)
    setGuruNote(item.catatan_guru || "") 
    setIsNoteEditing(!item.catatan_guru)
    setIsDetailOpen(true)
  }

  // --- LOGIC TOMBOL SETUJUI / TOLAK ---
  const handleVerification = async (status: string) => {
    if (!selectedLogbook) return

    try {
      const res = await fetch("/api/guru/logbook", { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedLogbook.id,
          status: status,
          catatan_guru: guruNote
        })
      })

      const json = await res.json()

      if (res.ok) {
        setIsDetailOpen(false)
        fetchData()
      } else {
        alert("Gagal: " + json.error)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Terjadi kesalahan sistem.")
    }
  }

  // --- LOGIC LIHAT LAMPIRAN ---
  const handleViewFile = (filePath: string) => {
    if (!filePath) return
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
    if (data.publicUrl) {
      window.open(data.publicUrl, "_blank")
    } else {
      alert("Gagal mendapatkan URL file.")
    }
  }

  // --- LOGIC UNDUH FILE ---
  const handleDownloadFile = async (filePath: string) => {
    if (!filePath) return
    
    try {
      // 1. Dapatkan Public URL
      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
      
      if (!data.publicUrl) throw new Error("URL tidak ditemukan")

      // 2. Fetch file sebagai Blob (agar browser mendownload, bukan membuka)
      const response = await fetch(data.publicUrl)
      const blob = await response.blob()
      
      // 3. Buat link download sementara
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      // Ambil nama file dari path
      const fileName = filePath.split("/").pop() || "dokumen-logbook.pdf"
      link.download = fileName
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

    } catch (error) {
      console.error("Download error:", error)
      alert("Gagal mengunduh file. Pastikan bucket 'public' atau file ada.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <SharedHeader />

      <div className="p-10 max-w-[1680px] mx-auto space-y-8">
        
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen Jurnal Harian Magang</h1>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard title="Total Logbook" value={stats.total} icon={<BookOpen className="text-[#0EA5E9]" />} desc="Laporan harian terdaftar" />
          <StatCard title="Belum Diverifikasi" value={stats.pending} icon={<Clock className="text-orange-500" />} desc="Menunggu verifikasi" />
          <StatCard title="Disetujui" value={stats.disetujui} icon={<ThumbsUp className="text-green-600" />} desc="Sudah diverifikasi" />
          <StatCard title="Ditolak" value={stats.ditolak} icon={<ThumbsDown className="text-red-500" />} desc="Perlu perbaikan" />
        </div>

        {/* MAIN CARD */}
        <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden min-h-[600px]">
          <div className="p-8 space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-slate-50 rounded-xl text-slate-500"><BookOpen size={24} strokeWidth={2.5} /></div>
               <h3 className="text-2xl font-bold text-slate-800">Daftar Logbook Siswa</h3>
            </div>

            {/* FILTER TOOLBAR */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
               <div className="relative w-full sm:w-[450px]">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input 
                     placeholder="Cari siswa, kegiatan, atau kendala..." 
                     className="pl-14 h-14 rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white"
                     value={search} onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               <div className="flex items-center gap-4">
                  <Button variant="outline" className="h-12 px-5 rounded-xl border-slate-200 text-slate-600 font-semibold">
                     <Filter size={18} className="mr-2" /> Filter
                  </Button>
               </div>
            </div>

            {/* TABLE */}
            <div className="overflow-hidden rounded-xl border border-slate-100">
               <Table>
                  <TableHeader className="bg-[#F8FAFC]">
                     <TableRow>
                        <TableHead className="w-[50px] py-6 pl-6"><Checkbox className="rounded-md border-slate-300" /></TableHead>
                        <TableHead className="py-6 font-bold text-slate-700 text-sm">Siswa & Tanggal</TableHead>
                        <TableHead className="py-6 font-bold text-slate-700 text-sm w-[40%]">Kegiatan & Kendala</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-700 text-sm">Status</TableHead>
                        <TableHead className="py-6 font-bold text-slate-700 text-sm">Catatan Guru</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-700 text-sm pr-8">Aksi</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item, index) => (
                       <JurnalRow key={index} data={item} onOpen={() => openDetail(item)} />
                    ))}
                  </TableBody>
               </Table>
            </div>
          </div>
        </Card>
      </div>

      {/* === MODAL DETAIL JURNAL === */}
      {selectedLogbook && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl rounded-[24px] p-0 overflow-hidden border-none shadow-2xl">
            {/* Header Modal */}
            <div className="px-8 py-6 border-b border-slate-100 bg-white">
               <div className="flex justify-between items-start">
                 <div>
                    <DialogTitle className="text-2xl font-bold text-slate-800">Detail Jurnal Harian</DialogTitle>
                    <p className="text-sm text-slate-500 mt-1 font-medium">{formatDate(selectedLogbook.tanggal)} • {selectedLogbook.magang?.siswa?.nama}</p>
                 </div>
                 <div>{getStatusBadge(selectedLogbook.status_verifikasi)}</div>
               </div>
            </div>

            {/* Content Scrollable */}
            <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh] bg-white">
               
               {/* Kegiatan */}
               <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><FileText size={14}/> Kegiatan</Label>
                  <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed border border-slate-100">
                     {selectedLogbook.kegiatan}
                  </div>
               </div>

               {/* Kendala */}
               {selectedLogbook.kendala && (
                 <div className="space-y-2">
                    <Label className="text-xs font-bold text-orange-500 uppercase flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-orange-500"></span> Kendala yang dihadapi
                    </Label>
                    <div className="bg-orange-50 p-4 rounded-xl text-orange-800 text-sm border border-orange-100 font-medium">
                       {selectedLogbook.kendala}
                    </div>
                 </div>
               )}

               {/* Dokumentasi (PERBAIKAN DI SINI) */}
               <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Dokumentasi</Label>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg text-green-600"><BookOpen size={20}/></div>
                        {/* Logic Tampilan Link */}
                        {selectedLogbook.file ? (
                          <button 
                            onClick={() => handleViewFile(selectedLogbook.file)}
                            className="text-sm font-medium text-green-800 underline decoration-green-300 underline-offset-4 hover:text-green-900 text-left"
                          >
                            {selectedLogbook.file.split('/').pop()} (Klik untuk lihat)
                          </button>
                        ) : (
                          <span className="text-sm font-medium text-slate-400 italic">Tidak ada lampiran</span>
                        )}
                     </div>
                     
                     {/* Logic Tombol Unduh */}
                     {selectedLogbook.file && (
                       <Button 
                          size="sm" 
                          onClick={() => handleDownloadFile(selectedLogbook.file)}
                          className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 h-9"
                       >
                          <Download size={16} className="mr-2"/> Unduh
                       </Button>
                     )}
                  </div>
               </div>

               {/* Catatan Guru */}
               <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                     <Label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <span className="text-purple-600">💬</span> Catatan Guru
                     </Label>
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsNoteEditing(!isNoteEditing)} 
                        className="text-blue-600 hover:bg-blue-50 h-8 px-3 rounded-lg text-xs font-bold"
                     >
                        <Edit size={14} className="mr-1.5"/> {isNoteEditing ? "Batal Edit" : "Edit Catatan"}
                     </Button>
                  </div>
                  
                  {isNoteEditing ? (
                    <Textarea 
                       value={guruNote} 
                       onChange={(e) => setGuruNote(e.target.value)} 
                       placeholder="Tuliskan catatan atau masukan untuk siswa..."
                       className="min-h-[100px] rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all p-4 text-sm"
                    />
                  ) : (
                    <div className={`p-4 rounded-xl text-sm border ${guruNote ? "bg-white border-slate-200 text-slate-700" : "bg-slate-50 border-dashed border-slate-300 text-slate-400 italic text-center py-6"}`}>
                       {guruNote || "Belum ada catatan dari guru"}
                    </div>
                  )}
               </div>

            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
               <div className="text-xs text-slate-400 font-medium">
                  Dibuat: {formatDate(selectedLogbook.created_at || selectedLogbook.tanggal)}
               </div>
               <div className="flex gap-3">
                  <Button 
                     onClick={() => handleVerification('ditolak')} 
                     className="bg-white hover:bg-red-50 text-red-600 border border-red-200 h-11 px-6 rounded-xl font-bold shadow-sm"
                  >
                     <X size={18} className="mr-2" strokeWidth={3}/> Tolak
                  </Button>
                  <Button 
                     onClick={() => handleVerification('disetujui')} 
                     className="bg-green-600 hover:bg-green-700 text-white h-11 px-8 rounded-xl font-bold shadow-lg shadow-green-200"
                  >
                     <CheckCircle size={18} className="mr-2" strokeWidth={3}/> Setujui
                  </Button>
               </div>
            </div>

          </DialogContent>
        </Dialog>
      )}

    </div>
  )
}

// --- HELPERS & COMPONENTS ---

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'disetujui': return <Badge className="bg-green-100 text-green-700 border-none px-3 py-1 rounded-lg">Disetujui</Badge>
    case 'ditolak': return <Badge className="bg-red-100 text-red-700 border-none px-3 py-1 rounded-lg">Ditolak</Badge>
    default: return <Badge className="bg-amber-100 text-amber-700 border-none px-3 py-1 rounded-lg">Pending</Badge>
  }
}

function JurnalRow({ data, onOpen }: any) {
  const siswa = data.magang?.siswa || {}
  return (
    <TableRow className="group hover:bg-slate-50/50 transition-colors border-slate-50">
      <TableCell className="pl-6"><Checkbox className="rounded-md border-slate-300" /></TableCell>
      <TableCell className="align-top py-5">
        <div className="font-bold text-slate-800 text-sm">{siswa.nama}</div>
        <div className="text-[11px] text-slate-500 font-medium mt-0.5">NIS: {siswa.nis}</div>
        <div className="text-[11px] text-slate-400 mt-2 font-medium">{formatDate(data.tanggal)}</div>
      </TableCell>
      <TableCell className="align-top py-5">
        <div className="space-y-3">
           <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Kegiatan:</p>
              <p className="text-sm text-slate-700 leading-snug line-clamp-2">{data.kegiatan}</p>
           </div>
           {data.kendala && (
             <div>
                <p className="text-[10px] text-orange-400 font-bold uppercase mb-1">Kendala:</p>
                <p className="text-xs text-orange-600 leading-snug italic line-clamp-1">{data.kendala}</p>
             </div>
           )}
        </div>
      </TableCell>
      <TableCell className="align-top py-5 text-center">{getStatusBadge(data.status_verifikasi)}</TableCell>
      <TableCell className="align-top py-5">
         <p className={`text-xs leading-relaxed ${data.catatan_guru ? "text-slate-600" : "text-slate-300 italic"}`}>
            {data.catatan_guru || "Belum ada catatan"}
         </p>
      </TableCell>
      <TableCell className="align-top py-5 text-center pr-8">
        <Button onClick={onOpen} variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all h-9 w-9 rounded-lg">
          <Eye size={18} />
        </Button>
      </TableCell>
    </TableRow>
  )
}

function StatCard({ title, value, icon, desc }: any) {
  return (
    <Card className="border-none shadow-sm rounded-[20px] bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        </div>
        <h3 className="text-3xl font-extrabold text-slate-800 leading-none mb-1">{value}</h3>
        <p className="text-[11px] text-slate-400 font-medium">{desc}</p>
      </CardContent>
    </Card>
  )
}

function formatDate(dateString: string) {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}
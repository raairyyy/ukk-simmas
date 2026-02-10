"use client"

import { useEffect, useState } from "react"
import {
  Users, GraduationCap, CheckCircle2, Calendar, Search, Filter, Plus, Pencil, Trash2, Building2,
  ChevronLeft, ChevronRight, X, Loader2, CheckCircle
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { SharedHeader } from "@/components/shared-header"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

export default function GuruMagangPage() {
  // === STATES ===
  const [userData, setUserData] = useState<any>(null)
  const [magangList, setMagangList] = useState<any[]>([])
  const [siswaList, setSiswaList] = useState<any[]>([])
  const [dudiList, setDudiList] = useState<any[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [guruId, setGuruId] = useState<number | null>(null)

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  
  // Toast State
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Form Data
  const [formData, setFormData] = useState({
    siswa_id: "",
    dudi_id: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    status: "berlangsung", 
    nilai_akhir: ""
  })

  // === FETCH INITIAL DATA ===
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        setUserData(data.user)
        if (data.user?.id) fetchMagangData(data.user.id)
      })

    // Fetch Resources untuk Dropdown
    const fetchResources = async () => {
        try {
          // 1. Ambil Siswa yang Belum Magang
          const resSiswa = await fetch("/api/siswa/available")
          const jsonSiswa = await resSiswa.json()
          if (jsonSiswa.data) setSiswaList(jsonSiswa.data)

          // 2. Ambil Data DUDI
          const resDudi = await fetch("/api/dudi")
          const jsonDudi = await resDudi.json()
          if (jsonDudi.data) setDudiList(jsonDudi.data)
          
        } catch (error) {
          console.error("Gagal memuat data resource:", error)
        }
      }

      fetchResources()
  }, [])

  const fetchMagangData = async (userId: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/guru/magang?user_id=${userId}`)
      const json = await res.json()
      if (json.data) {
        setMagangList(json.data)
        setGuruId(json.guruId)
      }
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // === HANDLERS ===
  const handleAdd = async () => {
    if (!guruId) return alert("Guru ID tidak ditemukan")
    
    // Validasi Sederhana
    if (!formData.siswa_id || !formData.dudi_id) {
        alert("Mohon lengkapi data siswa dan tempat magang")
        return
    }

    const payload = {
      ...formData,
      guru_id: guruId,
      status: "berlangsung" // Default status aktif
    }

    const res = await fetch("/api/guru/magang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      setIsAddOpen(false)
      fetchMagangData(userData.id)
      resetForm()
      showSuccessToast("Data siswa magang berhasil ditambahkan")
    }
  }

  const handleEdit = async () => {
    const payload = {
      id: selectedItem.id,
      status: formData.status,
      nilai_akhir: formData.nilai_akhir || null,
      tanggal_mulai: formData.tanggal_mulai,
      tanggal_selesai: formData.tanggal_selesai
    }

    const res = await fetch("/api/guru/magang", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      setIsEditOpen(false)
      fetchMagangData(userData.id)
      showSuccessToast("Data magang berhasil diperbarui")
    }
  }

  const handleDelete = async () => {
    const res = await fetch("/api/guru/magang", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedItem.id })
    })

    if (res.ok) {
      setIsDeleteOpen(false)
      fetchMagangData(userData.id)
      showSuccessToast("Data magang berhasil dihapus")
    }
  }

  const showSuccessToast = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const openEditModal = (item: any) => {
    setSelectedItem(item)
    setFormData({
      ...formData,
      status: item.status,
      nilai_akhir: item.nilai_akhir || "",
      tanggal_mulai: item.tanggal_mulai,
      tanggal_selesai: item.tanggal_selesai
    })
    setIsEditOpen(true)
  }

  const resetForm = () => {
    setFormData({
      siswa_id: "", dudi_id: "", tanggal_mulai: "", tanggal_selesai: "", status: "berlangsung", nilai_akhir: ""
    })
  }

  // === FILTER LOGIC ===
  const filteredData = magangList.filter((item) => 
    item.siswa?.nama?.toLowerCase().includes(search.toLowerCase()) ||
    item.dudi?.nama_perusahaan?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50/50 relative">
      <SharedHeader />

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed top-24 right-10 z-[100] animate-in slide-in-from-right fade-in duration-300">
          <div className="bg-[#84cc16] text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 min-w-[320px] border border-lime-500">
            <div className="bg-white/20 p-1 rounded-full"><CheckCircle size={18} strokeWidth={3} /></div>
            <p className="font-bold text-sm tracking-wide">{toastMessage}</p>
            <button onClick={() => setShowToast(false)} className="ml-auto hover:bg-white/10 p-1 rounded-lg transition-colors"><X size={18}/></button>
          </div>
        </div>
      )}

      <div className="p-10 max-w-[1680px] mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen Siswa Magang</h1>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Siswa" value={magangList.length} desc="Siswa magang terdaftar" icon={<Users className="text-[#0EA5E9]" />} />
          <StatCard title="Aktif" value={magangList.filter(m => m.status === 'berlangsung').length} desc="Sedang magang" icon={<GraduationCap className="text-[#06b6d4]" />} />
          <StatCard title="Selesai" value={magangList.filter(m => m.status === 'selesai').length} desc="Magang selesai" icon={<CheckCircle2 className="text-[#10b981]" />} />
          <StatCard title="Pending" value={magangList.filter(m => m.status === 'pending').length} desc="Menunggu penempatan" icon={<Calendar className="text-[#f59e0b]" />} />
        </div>

        <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden min-h-[600px]">
          <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-slate-50 rounded-xl text-slate-500"><Users size={24} strokeWidth={2.5} /></div>
                   <h3 className="text-2xl font-bold text-slate-800">Daftar Siswa Magang</h3>
                </div>
                <Button onClick={() => { resetForm(); setIsAddOpen(true); }} className="bg-[#00A9D8] hover:bg-[#0092ba] rounded-xl h-12 px-6 font-bold shadow-lg transition-all hover:scale-105">
                   <Plus className="mr-2" strokeWidth={3} /> Tambah
                </Button>
            </div>

            <div className="flex justify-between gap-4">
               <div className="relative w-[400px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <Input 
                    placeholder="Cari siswa, guru, atau DUDI..." 
                    className="pl-12 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                    value={search} onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-100">
               <Table>
                  <TableHeader className="bg-[#F8FAFC]">
                     <TableRow>
                        <TableHead className="py-6 pl-8 font-bold text-slate-700 text-sm">Siswa</TableHead>
                        <TableHead className="py-6 font-bold text-slate-700 text-sm">Guru Pembimbing</TableHead>
                        <TableHead className="py-6 font-bold text-slate-700 text-sm">DUDI</TableHead>
                        <TableHead className="py-6 font-bold text-slate-700 text-sm">Periode</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-700 text-sm">Status</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-700 text-sm">Nilai</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-700 text-sm pr-8">Aksi</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={7} className="h-40 text-center"><div className="flex justify-center items-center gap-2 text-slate-500"><Loader2 className="animate-spin"/> Memuat data...</div></TableCell></TableRow>
                    ) : filteredData.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="h-40 text-center text-slate-500 font-medium italic">Tidak ada data siswa magang.</TableCell></TableRow>
                    ) : (
                      filteredData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                           <TableCell className="pl-8 py-5">
                              <p className="font-bold text-slate-800 text-sm">{item.siswa?.nama}</p>
                              <p className="text-[11px] text-slate-500 font-bold mt-0.5">NIS: {item.siswa?.nis}</p>
                           </TableCell>
                           <TableCell className="py-5">
                              <p className="font-bold text-slate-700 text-sm">{item.guru?.nama}</p>
                              <p className="text-[11px] text-slate-400 font-bold mt-0.5">NIP: {item.guru?.nip}</p>
                           </TableCell>
                           <TableCell className="py-5">
                              <div className="flex gap-3 items-start">
                                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400"><Building2 size={16} /></div>
                                <div>
                                  <p className="font-bold text-slate-700 text-sm leading-tight">{item.dudi?.nama_perusahaan}</p>
                                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]">{item.dudi?.alamat}</p>
                                </div>
                              </div>
                           </TableCell>
                           <TableCell className="py-5 text-xs font-semibold text-slate-600">
                              <p>{item.tanggal_mulai || "-"}</p>
                              <p className="text-slate-400 italic mt-0.5">s.d {item.tanggal_selesai || "-"}</p>
                           </TableCell>
                           <TableCell className="text-center">
                              <Badge className={`${getStatusStyle(item.status)} border-none shadow-none px-2.5 py-1 text-[10px] uppercase tracking-wide font-bold rounded-lg`}>
                                {getDisplayStatus(item.status)}
                              </Badge>
                           </TableCell>
                           <TableCell className="text-center">
                              {item.nilai_akhir ? (
                                <div className="w-9 h-9 rounded-xl bg-[#84cc16] text-white flex items-center justify-center mx-auto font-bold shadow-sm text-sm border border-lime-500">{item.nilai_akhir}</div>
                              ) : (
                                <span className="text-slate-300 font-bold text-lg">-</span>
                              )}
                           </TableCell>
                           <TableCell className="text-center pr-8">
                              <div className="flex justify-center gap-1">
                                <Button onClick={() => openEditModal(item)} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Pencil size={16} strokeWidth={2.5}/></Button>
                                <Button onClick={() => { setSelectedItem(item); setIsDeleteOpen(true); }} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={16} strokeWidth={2.5}/></Button>
                              </div>
                           </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
               </Table>
            </div>
          </div>
        </Card>
      </div>

      {/* === MODAL TAMBAH (MIRIP GAMBAR 78211d.png) === */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-3xl rounded-[28px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="px-8 py-6 border-b border-slate-100 bg-white sticky top-0 z-10">
             <DialogTitle className="text-2xl font-bold text-slate-800">Tambah Data Siswa Magang</DialogTitle>
             <p className="text-sm text-slate-500 mt-1 font-medium">Masukkan informasi data magang siswa baru</p>
          </div>
          
          <div className="p-8 space-y-8 bg-white overflow-y-auto max-h-[70vh]">
             {/* Section 1 */}
             <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 border-b pb-2 mb-2">Siswa & Pembimbing</h4>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Siswa</Label>
                      <Select onValueChange={(val) => setFormData({...formData, siswa_id: val})}>
                         <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-100 transition-all"><SelectValue placeholder="Pilih Siswa" /></SelectTrigger>
                         <SelectContent>
                            {siswaList.length > 0 ? siswaList.map(s => (
                                <SelectItem key={s.id} value={s.id.toString()}>{s.nama} - {s.kelas}</SelectItem>
                            )) : <div className="p-2 text-sm text-slate-500 text-center">Tidak ada siswa tersedia</div>}
                         </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Guru Pembimbing</Label>
                      <Input value={userData?.name || "Loading..."} disabled className="h-12 rounded-xl bg-slate-100 text-slate-500 font-bold border-slate-200 cursor-not-allowed" />
                   </div>
                </div>
             </div>

             {/* Section 2 */}
             <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 border-b pb-2 mb-2">Tempat Magang</h4>
                <div className="space-y-2">
                   <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Dunia Usaha/Dunia Industri</Label>
                   <Select onValueChange={(val) => setFormData({...formData, dudi_id: val})}>
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-100 transition-all"><SelectValue placeholder="Pilih Perusahaan Mitra" /></SelectTrigger>
                      <SelectContent>
                         {dudiList.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.nama_perusahaan}</SelectItem>)}
                      </SelectContent>
                   </Select>
                </div>
             </div>

             {/* Section 3 */}
             <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 border-b pb-2 mb-2">Periode & Status</h4>
                <div className="grid grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tanggal Mulai</Label>
                      <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-100" onChange={e => setFormData({...formData, tanggal_mulai: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tanggal Selesai</Label>
                      <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-100" onChange={e => setFormData({...formData, tanggal_selesai: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Status Awal</Label>
                      <Input value="Pending (Default)" disabled className="h-12 rounded-xl bg-slate-100 text-slate-500 font-bold border-slate-200 italic" />
                   </div>
                </div>
             </div>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0">
             <Button variant="outline" onClick={() => setIsAddOpen(false)} className="h-12 px-8 rounded-xl font-bold border-slate-300 text-slate-600 hover:bg-white hover:text-slate-800">Batal</Button>
             <Button onClick={handleAdd} className="h-12 px-10 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all transform hover:-translate-y-0.5">Simpan Data</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* === MODAL EDIT (MIRIP GAMBAR 78ff37.png) === */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl rounded-[28px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="px-8 py-6 border-b border-slate-100 bg-white">
             <DialogTitle className="text-2xl font-bold text-slate-800">Edit Data Siswa Magang</DialogTitle>
             <p className="text-sm text-slate-500 mt-1 font-medium">Perbarui informasi status atau nilai magang</p>
          </div>

          <div className="p-8 space-y-8 bg-white overflow-y-auto max-h-[70vh]">
             {/* Section Periode */}
             <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 border-b pb-2 mb-2">Periode & Status</h4>
                <div className="grid grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tanggal Mulai</Label>
                      <Input type="date" value={formData.tanggal_mulai} className="h-12 rounded-xl bg-slate-50 border-slate-200" onChange={e => setFormData({...formData, tanggal_mulai: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tanggal Selesai</Label>
                      <Input type="date" value={formData.tanggal_selesai} className="h-12 rounded-xl bg-slate-50 border-slate-200" onChange={e => setFormData({...formData, tanggal_selesai: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Status</Label>
                      <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                         <SelectTrigger className="h-12 rounded-xl bg-white border-slate-200 font-medium"><SelectValue /></SelectTrigger>
                         <SelectContent>
                            <SelectItem value="berlangsung">Aktif (Berlangsung)</SelectItem>
                            <SelectItem value="selesai">Selesai</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                            <SelectItem value="ditolak">Ditolak</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                </div>
             </div>

             {/* Section Penilaian */}
             <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 border-b pb-2 mb-2">Penilaian</h4>
                <div className="space-y-2">
                   <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nilai Akhir</Label>
                   <Input 
                      placeholder={formData.status === "selesai" ? "Masukkan nilai (0-100)" : "Hanya bisa diisi jika status selesai"} 
                      value={formData.nilai_akhir} 
                      disabled={formData.status !== "selesai"}
                      onChange={e => setFormData({...formData, nilai_akhir: e.target.value})}
                      className={`h-12 rounded-xl border-slate-200 transition-all ${formData.status !== "selesai" ? "bg-slate-100 cursor-not-allowed text-slate-400" : "bg-white border-blue-200 focus:ring-2 focus:ring-blue-100"}`} 
                   />
                   <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                      Nilai hanya dapat diisi setelah status magang diubah menjadi "Selesai"
                   </p>
                </div>
             </div>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0">
             <Button variant="outline" onClick={() => setIsEditOpen(false)} className="h-12 px-8 rounded-xl font-bold border-slate-300 text-slate-600 hover:bg-white">Batal</Button>
             <Button onClick={handleEdit} className="h-12 px-10 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5">Update Data</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* === MODAL HAPUS (MIRIP GAMBAR 782141.png) === */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md rounded-[28px] p-8 shadow-2xl border-none">
          <div className="space-y-4 text-center sm:text-left">
             <h3 className="text-xl font-bold text-slate-900">Konfirmasi Hapus</h3>
             <p className="text-slate-500 leading-relaxed text-sm font-medium">
                Apakah Anda yakin ingin menghapus data magang ini? <br/>
                <span className="text-red-500">Aksi ini tidak bisa dibatalkan dan data akan hilang permanen.</span>
             </p>
          </div>
          <div className="flex gap-3 mt-8">
             <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="h-12 flex-1 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50">Batal</Button>
             <Button onClick={handleDelete} className="h-12 flex-1 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 transition-all hover:scale-[1.02]">Ya, Hapus</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, desc, icon }: any) {
  return (
    <Card className="border-none shadow-sm rounded-[20px] bg-white h-[140px] flex flex-col justify-center transition-all hover:shadow-md hover:-translate-y-1">
      <div className="p-6">
         <div className="flex justify-between items-start mb-3">
             <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
             <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
         </div>
         <h3 className="text-3xl font-extrabold text-slate-800 leading-none mb-1">{value}</h3>
         <p className="text-[11px] text-slate-400 font-bold">{desc}</p>
      </div>
    </Card>
  )
}

function getStatusStyle(status: string) {
  switch (status) {
    case "berlangsung": return "bg-emerald-50 text-emerald-600 border-emerald-100" // Hijau
    case "selesai": return "bg-blue-50 text-blue-600 border-blue-100" // Biru
    case "pending": return "bg-amber-50 text-amber-600 border-amber-100" // Kuning/Oranye
    case "dibatalkan": return "bg-red-50 text-red-600 border-red-100" // Merah
    case "ditolak": return "bg-rose-50 text-rose-600 border-rose-100" // Merah Muda
    default: return "bg-gray-50 text-gray-600 border-gray-200"
  }
}

function getDisplayStatus(status: string) {
  switch (status) {
    case "berlangsung": return "Aktif"
    case "selesai": return "Selesai"
    case "pending": return "Pending"
    case "dibatalkan": return "Dibatalkan"
    case "ditolak": return "Ditolak"
    default: return status
  }
}
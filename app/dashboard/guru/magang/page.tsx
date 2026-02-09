"use client"

import { useEffect, useState } from "react"
import {
  Users,
  GraduationCap,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  Plus,
  Pencil,
  Trash2,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card" 
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SharedHeader } from "@/components/shared-header"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function GuruMagangPage() {
  // === STATES ===
  const [magangList, setMagangList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [search, setSearch] = useState("")

  // === FETCH DATA FROM SUPABASE ===
  const fetchMagang = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/magang")
      const json = await res.json()
      if (res.ok) {
        setMagangList(json.data)
      }
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMagang()
  }, [])

  // === FILTER LOGIC ===
  const filteredData = magangList.filter((item) => 
    item.siswa?.nama?.toLowerCase().includes(search.toLowerCase()) ||
    item.dudi?.nama_perusahaan?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Page */}
      <SharedHeader />

      {/* Content Body */}
      <div className="p-10 max-w-[1680px] mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen Siswa Magang</h1>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            title="Total Siswa" 
            value={magangList.length} 
            desc="Siswa magang terdaftar" 
            icon={<Users className="text-[#0EA5E9]" size={24} />} 
          />
          <StatCard 
            title="Aktif" 
            value={magangList.filter(m => m.status === 'Aktif').length} 
            desc="Sedang magang" 
            icon={<GraduationCap className="text-[#06b6d4]" size={24} />} 
          />
          <StatCard 
            title="Selesai" 
            value={magangList.filter(m => m.status === 'Selesai').length} 
            desc="Magang selesai" 
            icon={<CheckCircle2 className="text-[#10b981]" size={24} />} 
          />
          <StatCard 
            title="Pending" 
            value={magangList.filter(m => m.status === 'Pending').length} 
            desc="Menunggu penempatan" 
            icon={<Calendar className="text-[#f59e0b]" size={24} />} 
          />
        </div>

        {/* Main Content Card */}
        <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden min-h-[600px]">
          <div className="p-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
                      <Users size={24} strokeWidth={2.5} />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-800">Daftar Siswa Magang</h3>
                </div>
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded-xl px-6 h-12 font-bold text-base shadow-lg shadow-cyan-200/50 transition-all hover:scale-105"
                >
                    <Plus className="mr-2 h-5 w-5" strokeWidth={3} /> Tambah
                </Button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
               <div className="relative w-full sm:w-[450px]">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input 
                     placeholder="Cari siswa, guru, atau DUDI..." 
                     className="pl-14 h-14 rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-base text-slate-700"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                  <Button variant="outline" className="h-12 px-5 rounded-xl border-slate-200 text-slate-600 font-semibold">
                     <Filter size={18} className="mr-2" /> Tampilkan Filter
                  </Button>
               </div>
            </div>

            {/* Table Section */}
            <div className="overflow-hidden rounded-xl border border-slate-100">
               <Table>
                  <TableHeader className="bg-[#F8FAFC]">
                     <TableRow className="border-slate-100">
                        <TableHead className="py-6 pl-8 font-bold text-slate-700">Siswa</TableHead>
                        <TableHead className="py-6 font-bold text-slate-700">Guru Pembimbing</TableHead>
                        <TableHead className="py-6 font-bold text-slate-700">DUDI</TableHead>
                        <TableHead className="py-6 font-bold text-slate-700">Periode</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-700">Status</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-700">Nilai</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-700 pr-8">Aksi</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-40 text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-400" />
                          <p className="mt-2 text-slate-500 font-medium">Memuat data...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-40 text-center text-slate-500 font-medium">
                          Tidak ada data magang ditemukan.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((item) => (
                        <MagangRow 
                          key={item.id} 
                          data={item} 
                          onEdit={() => { setSelectedItem(item); setIsEditModalOpen(true); }}
                          onDelete={() => { setSelectedItem(item); setIsDeleteModalOpen(true); }}
                        />
                      ))
                    )}
                  </TableBody>
               </Table>
            </div>
          </div>
        </Card>
      </div>

      {/* MODALS TETAP SAMA SEPERTI SEBELUMNYA */}
      {/* ... (Modal Tambah, Edit, Hapus) */}
    </div>
  )
}

// === SUB-COMPONENTS ===

function StatCard({ title, value, desc, icon }: any) {
  return (
    <Card className="border-none shadow-sm rounded-[20px] bg-white h-[140px] flex flex-col justify-center transition-all hover:shadow-md">
      <CardContent className="p-6">
         <div className="flex justify-between items-start mb-3">
             <p className="text-sm font-bold text-slate-500 tracking-wide uppercase">{title}</p>
             <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
         </div>
         <div>
            <h3 className="text-3xl font-extrabold text-slate-800 leading-none mb-1">{value}</h3>
            <p className="text-[11px] text-slate-400 font-bold">{desc}</p>
         </div>
      </CardContent>
    </Card>
  )
}

function MagangRow({ data, onEdit, onDelete }: any) {
  const statusStyles: any = {
    Aktif: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Selesai: "bg-blue-50 text-blue-600 border-blue-100",
    Pending: "bg-orange-50 text-orange-600 border-orange-100",
  }
  const style = statusStyles[data.status] || "bg-gray-50 text-gray-600";

  // Format tanggal ke ID locale
  const formatDate = (date: string) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <TableRow className="border-slate-50 hover:bg-slate-50/50 transition-colors">
       <TableCell className="pl-8 py-5 align-top">
          <div>
             <p className="font-bold text-slate-800 text-sm mb-1">{data.siswa?.nama || "N/A"}</p>
             <p className="text-[11px] text-slate-500 font-bold">NIS: {data.siswa?.nis || "-"}</p>
             <p className="text-[10px] text-slate-400 mt-0.5">{data.siswa?.kelas} • {data.siswa?.jurusan}</p>
          </div>
       </TableCell>
       <TableCell className="py-5 align-top">
          <div>
             <p className="font-bold text-slate-700 text-sm mb-1">{data.guru?.nama || "N/A"}</p>
             <p className="text-[11px] text-slate-400 font-bold">NIP: {data.guru?.nip || "-"}</p>
          </div>
       </TableCell>
       <TableCell className="py-5 align-top">
          <div className="flex items-start gap-2">
             <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 size={14} className="text-slate-500"/>
             </div>
             <div>
                <p className="font-bold text-slate-700 text-sm mb-0.5">{data.dudi?.nama_perusahaan || "Perusahaan N/A"}</p>
                <p className="text-[11px] text-slate-400 font-medium">{data.dudi?.alamat || "-"}</p>
             </div>
          </div>
       </TableCell>
       <TableCell className="py-5 align-top">
          <div className="text-xs font-semibold text-slate-600 space-y-1">
             <p>{formatDate(data.tanggal_mulai)}</p>
             <p className="text-slate-400 font-medium italic">s.d {formatDate(data.tanggal_selesai)}</p>
          </div>
       </TableCell>
       <TableCell className="py-5 text-center">
          <Badge className={`border px-3 py-1 text-[10px] font-bold shadow-none rounded-lg ${style}`}>
             {data.status || "Pending"}
          </Badge>
       </TableCell>
       <TableCell className="py-5 text-center">
          {data.nilai_akhir ? (
             <div className="w-9 h-9 rounded-xl bg-[#84cc16] text-white flex items-center justify-center mx-auto text-sm font-extrabold shadow-sm">
                {data.nilai_akhir}
             </div>
          ) : (
             <span className="text-slate-300 text-xl font-bold">-</span>
          )}
       </TableCell>
       <TableCell className="pr-8 py-5 text-center">
          <div className="flex items-center justify-center gap-1">
             <Button onClick={onEdit} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Pencil size={18} strokeWidth={2.5} />
             </Button>
             <Button onClick={onDelete} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                <Trash2 size={18} strokeWidth={2.5} />
             </Button>
          </div>
       </TableCell>
    </TableRow>
  )
}
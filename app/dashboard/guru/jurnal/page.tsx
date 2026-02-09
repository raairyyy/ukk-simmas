"use client"

import {
  BookOpen,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { SharedHeader } from "@/components/shared-header"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function GuruJurnalPage() {
  return (
    <>
      {/* Header Page */}
      <SharedHeader />

      {/* Content Body */}
      <div className="p-10 max-w-[1680px] mx-auto space-y-8">
        
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen Jurnal Harian Magang</h1>
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            title="Total Logbook" 
            value="5" 
            desc="Laporan harian terdaftar" 
            icon={<BookOpen className="text-[#0EA5E9]" size={24} />} 
          />
          <StatCard 
            title="Belum Diverifikasi" 
            value="2" 
            desc="Menunggu verifikasi" 
            icon={<Clock className="text-[#06b6d4]" size={24} />} 
          />
          <StatCard 
            title="Disetujui" 
            value="2" 
            desc="Sudah diverifikasi" 
            icon={<ThumbsUp className="text-[#0EA5E9]" size={24} />} 
          />
          <StatCard 
            title="Ditolak" 
            value="1" 
            desc="Perlu perbaikan" 
            icon={<ThumbsDown className="text-[#0EA5E9]" size={24} />} 
          />
        </div>

        {/* Main Content Card */}
        <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden min-h-[600px]">
          <div className="p-8 space-y-8">
            
            {/* Header: Title */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
                   <BookOpen size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Daftar Logbook Siswa</h3>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
               <div className="relative w-full sm:w-[450px]">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input 
                     placeholder="Cari siswa, kegiatan, atau kendala..." 
                     className="pl-14 h-14 rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-base text-slate-700 placeholder:text-slate-400"
                  />
               </div>
               
               <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                  <Button variant="outline" className="h-12 px-5 rounded-xl border-slate-200 text-slate-600 font-semibold">
                     <Filter size={18} className="mr-2" /> Tampilkan Filter
                  </Button>

                  <div className="flex items-center gap-3">
                      <span className="text-base text-slate-600 font-medium">Tampilkan:</span>
                      <div className="relative">
                        <select className="h-12 rounded-xl border border-slate-200 bg-white text-base font-semibold px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer text-slate-700 min-w-[70px]">
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                        </select>
                      </div>
                      <span className="text-base text-slate-600 font-medium">per halaman</span>
                  </div>
               </div>
            </div>

            {/* Table Section */}
            <div className="overflow-hidden rounded-xl border border-slate-100">
               <Table>
                  <TableHeader className="bg-[#F8FAFC]">
                     <TableRow className="border-slate-100 hover:bg-[#F8FAFC]">
                        <TableHead className="w-[50px] py-6 pl-6">
                           <Checkbox className="rounded-md border-slate-300" />
                        </TableHead>
                        <TableHead className="py-6 font-bold text-slate-700 text-sm w-[200px]">Siswa & Tanggal</TableHead>
                        <TableHead className="py-6 font-bold text-slate-700 text-sm">Kegiatan & Kendala</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-700 text-sm w-[150px]">Status</TableHead>
                        <TableHead className="py-6 font-bold text-slate-700 text-sm w-[250px]">Catatan Guru</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-700 text-sm pr-8 w-[80px]">Aksi</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {jurnalData.map((item, index) => (
                        <JurnalRow key={index} data={item} />
                     ))}
                  </TableBody>
               </Table>
            </div>

            {/* Footer Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-2">
               <p className="text-sm text-slate-500 font-medium">Menampilkan 1 sampai 5 dari 5 entri</p>
               <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-600" disabled>
                     <ChevronLeft size={20} />
                  </Button>
                  <Button className="h-10 w-10 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-sm shadow-md">
                     1
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-600">
                     <ChevronRight size={20} />
                  </Button>
               </div>
            </div>

          </div>
        </Card>
      </div>
    </>
  )
}

// === COMPONENTS & DATA ===

function StatCard({ title, value, desc, icon }: any) {
  return (
    <Card className="border-none shadow-sm rounded-[20px] bg-white h-[140px] flex flex-col justify-center">
      <CardContent className="p-6">
         <div className="flex justify-between items-start mb-3">
             <p className="text-sm font-bold text-slate-500">{title}</p>
             <div className="opacity-90">{icon}</div>
         </div>
         <div>
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none mb-1">{value}</h3>
            <p className="text-[11px] text-slate-400 font-medium">{desc}</p>
         </div>
      </CardContent>
    </Card>
  )
}

function JurnalRow({ data }: any) {
  // Logic warna badge status
  const statusStyles: any = {
    Disetujui: "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Belum Diverifikasi": "bg-orange-50 text-orange-600 border-orange-100",
    Ditolak: "bg-red-50 text-red-600 border-red-100",
  }
  const style = statusStyles[data.status] || "bg-gray-50 text-gray-600";

  return (
    <TableRow className="group border-slate-50 hover:bg-slate-50/50 transition-colors align-top">
       <TableCell className="pl-6 py-6 align-top">
          <Checkbox className="rounded-md border-slate-300 mt-1" />
       </TableCell>

       {/* SISWA & TANGGAL */}
       <TableCell className="py-6 align-top">
          <div>
             <p className="font-bold text-slate-800 text-sm mb-1">{data.siswa.nama}</p>
             <p className="text-[11px] text-slate-500 font-medium">NIS: {data.siswa.nis}</p>
             <p className="text-[11px] text-slate-400 mt-0.5">{data.siswa.kelas}</p>
             <p className="text-xs text-slate-500 font-bold mt-2">{data.tanggal}</p>
          </div>
       </TableCell>

       {/* KEGIATAN & KENDALA */}
       <TableCell className="py-6 align-top">
          <div className="space-y-3">
             <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Kegiatan:</span>
                <p className="text-sm text-slate-600 leading-relaxed">{data.kegiatan}</p>
             </div>
             <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Kendala:</span>
                <p className="text-sm text-slate-500 leading-relaxed italic">{data.kendala}</p>
             </div>
          </div>
       </TableCell>

       {/* STATUS */}
       <TableCell className="py-6 align-top text-center">
          <Badge className={`border px-3 py-1 text-[10px] font-bold shadow-none rounded-lg hover:bg-opacity-80 ${style}`}>
             {data.status}
          </Badge>
       </TableCell>

       {/* CATATAN GURU */}
       <TableCell className="py-6 align-top">
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 min-h-[60px]">
             {data.catatan ? (
                <p className="text-xs text-slate-600 italic leading-snug">{data.catatan}</p>
             ) : (
                <p className="text-xs text-slate-400 italic">Belum ada catatan</p>
             )}
          </div>
       </TableCell>

       {/* AKSI */}
       <TableCell className="pr-8 py-6 align-top text-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg mt-2">
             <Eye size={18} strokeWidth={2.5} />
          </Button>
       </TableCell>
    </TableRow>
  )
}

// === DUMMY DATA ===
const jurnalData = [
  {
    siswa: { nama: "Ahmad Rizki", nis: "2024001", kelas: "XII RPL 1" },
    tanggal: "1 Mar 2024",
    kegiatan: "Membuat desain UI aplikasi kasir menggunakan Figma. Melakukan analisis user experience dan wireframing untuk interface yang user-friendly.",
    kendala: "Kesulitan menentukan skema warna yang tepat dan konsisten untuk seluruh aplikasi.",
    status: "Disetujui",
    catatan: "Bagus, lanjutkan dengan implementasi."
  },
  {
    siswa: { nama: "Ahmad Rizki", nis: "2024001", kelas: "XII RPL 1" },
    tanggal: "2 Mar 2024",
    kegiatan: "Belajar backend Laravel untuk membangun REST API sistem kasir. Mempelajari konsep MVC dan routing.",
    kendala: "Error saat menjalankan migration database dan kesulitan memahami relationship antar tabel.",
    status: "Belum Diverifikasi",
    catatan: ""
  },
  {
    siswa: { nama: "Siti Nurhaliza", nis: "2024002", kelas: "XII RPL 1" },
    tanggal: "1 Mar 2024",
    kegiatan: "Setup server Linux Ubuntu untuk deployment aplikasi web. Konfigurasi Apache dan MySQL.",
    kendala: "Belum familiar dengan command line interface dan permission system di Linux.",
    status: "Ditolak",
    catatan: "Perbaiki deskripsi kegiatan, terlalu singkat."
  },
  {
    siswa: { nama: "Budi Santoso", nis: "2024003", kelas: "XII TKJ 1" },
    tanggal: "3 Mar 2024",
    kegiatan: "Melakukan troubleshooting jaringan komputer kantor dan mengkonfigurasi switch managed.",
    kendala: "Beberapa port switch tidak berfungsi dengan baik.",
    status: "Disetujui",
    catatan: "Sudah bagus, dokumentasikan solusinya."
  },
  {
    siswa: { nama: "Dewi Lestari", nis: "2024004", kelas: "XII RPL 2" },
    tanggal: "4 Mar 2024",
    kegiatan: "Membuat dokumentasi API dan testing menggunakan Postman untuk endpoint yang sudah dibuat.",
    kendala: "Kesulitan dalam membuat dokumentasi yang comprehensive dan mudah dipahami.",
    status: "Belum Diverifikasi",
    catatan: ""
  },
]
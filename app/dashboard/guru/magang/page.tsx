"use client"

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
  ChevronRight
} from "lucide-react"
// FIX: Menambahkan import CardContent
import { Card, CardContent } from "@/components/ui/card" 
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function GuruMagangPage() {
  return (
    <>
      {/* Header Page */}
      <header className="bg-white border-b border-slate-100 h-[90px] px-10 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="font-bold text-xl text-slate-800">SMK Karangkates</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Sistem Manajemen Magang Siswa</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-base font-bold text-slate-800">Guru Pembimbing</p>
            <p className="text-sm text-slate-500 font-medium">Guru</p>
          </div>
          <Avatar className="h-12 w-12 bg-[#0EA5E9] text-white ring-4 ring-slate-50 cursor-pointer">
            <AvatarFallback className="bg-[#0EA5E9] text-white font-bold"><User size={24} /></AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Content Body */}
      <div className="p-10 max-w-[1680px] mx-auto space-y-8">
        
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen Siswa Magang</h1>
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            title="Total Siswa" 
            value="6" 
            desc="Siswa magang terdaftar" 
            icon={<Users className="text-[#0EA5E9]" size={24} />} 
          />
          <StatCard 
            title="Aktif" 
            value="3" 
            desc="Sedang magang" 
            icon={<GraduationCap className="text-[#06b6d4]" size={24} />} 
          />
          <StatCard 
            title="Selesai" 
            value="2" 
            desc="Magang selesai" 
            icon={<CheckCircle2 className="text-[#0EA5E9]" size={24} />} 
          />
          <StatCard 
            title="Pending" 
            value="1" 
            desc="Menunggu penempatan" 
            icon={<Calendar className="text-[#0EA5E9]" size={24} />} 
          />
        </div>

        {/* Main Content Card */}
        <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden min-h-[600px]">
          <div className="p-8 space-y-8">
            
            {/* Header: Title & Add Button */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
                      <Users size={24} strokeWidth={2.5} />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-800">Daftar Siswa Magang</h3>
                </div>
                <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded-xl px-6 h-12 font-bold text-base shadow-lg shadow-cyan-200/50 transition-all hover:scale-105">
                    <Plus className="mr-2 h-5 w-5" strokeWidth={3} /> Tambah
                </Button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
               <div className="relative w-full sm:w-[450px]">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input 
                     placeholder="Cari siswa, guru, atau DUDI..." 
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
                     {magangData.map((item, index) => (
                        <MagangRow key={index} data={item} />
                     ))}
                  </TableBody>
               </Table>
            </div>

            {/* Footer Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-2">
               <p className="text-sm text-slate-500 font-medium">Menampilkan 1 sampai 5 dari 6 entri</p>
               <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-600" disabled>
                     <ChevronLeft size={20} />
                  </Button>
                  <Button className="h-10 w-10 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-sm shadow-md">
                     1
                  </Button>
                  <Button variant="ghost" className="h-10 w-10 rounded-xl text-slate-500 font-bold hover:bg-slate-100">
                     2
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

function MagangRow({ data }: any) {
  // Logic warna badge status
  const statusStyles: any = {
    Aktif: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Selesai: "bg-blue-50 text-blue-600 border-blue-100",
    Pending: "bg-orange-50 text-orange-600 border-orange-100",
  }
  const style = statusStyles[data.status] || "bg-gray-50 text-gray-600";

  return (
    <TableRow className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
       {/* SISWA */}
       <TableCell className="pl-8 py-5 align-top">
          <div>
             <p className="font-bold text-slate-800 text-sm mb-1">{data.siswa.nama}</p>
             <p className="text-xs text-slate-500 font-medium">NIS: {data.siswa.nis}</p>
             <p className="text-xs text-slate-400 mt-0.5">{data.siswa.kelas} • {data.siswa.jurusan}</p>
          </div>
       </TableCell>

       {/* GURU */}
       <TableCell className="py-5 align-top">
          <div>
             <p className="font-bold text-slate-700 text-sm mb-1">{data.guru.nama}</p>
             <p className="text-[11px] text-slate-400 font-medium">NIP: {data.guru.nip}</p>
          </div>
       </TableCell>

       {/* DUDI */}
       <TableCell className="py-5 align-top">
          <div className="flex items-start gap-2">
             <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 size={12} className="text-slate-500"/>
             </div>
             <div>
                <p className="font-bold text-slate-700 text-sm mb-0.5">{data.dudi.nama}</p>
                <p className="text-[11px] text-slate-500 leading-tight mb-1">{data.dudi.lokasi}</p>
                <p className="text-[11px] text-slate-400">{data.dudi.pembimbing}</p>
             </div>
          </div>
       </TableCell>

       {/* PERIODE */}
       <TableCell className="py-5 align-top">
          <div>
             <p className="font-medium text-slate-600 text-xs mb-1">{data.periode.mulai}</p>
             <p className="text-[11px] text-slate-400">s.d {data.periode.selesai}</p>
             <p className="text-[10px] text-slate-400 mt-1 font-bold">{data.periode.durasi}</p>
          </div>
       </TableCell>

       {/* STATUS */}
       <TableCell className="py-5 text-center">
          <Badge className={`border px-3 py-1 text-[10px] font-bold shadow-none rounded-lg hover:bg-opacity-80 ${style}`}>
             {data.status}
          </Badge>
       </TableCell>

       {/* NILAI */}
       <TableCell className="py-5 text-center">
          {data.nilai ? (
             <div className="w-8 h-8 rounded-lg bg-[#84cc16] text-white flex items-center justify-center mx-auto text-xs font-bold shadow-sm">
                {data.nilai}
             </div>
          ) : (
             <span className="text-slate-300 text-xl">-</span>
          )}
       </TableCell>

       {/* AKSI */}
       <TableCell className="pr-8 py-5 text-center">
          <div className="flex items-center justify-center gap-2">
             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                <Pencil size={16} strokeWidth={2.5} />
             </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 size={16} strokeWidth={2.5} />
             </Button>
          </div>
       </TableCell>
    </TableRow>
  )
}

// === DUMMY DATA ===
const magangData = [
  {
    siswa: { nama: "Ahmad Rizki", nis: "2024001", kelas: "XII RPL 1", jurusan: "Rekayasa Perangkat Lunak" },
    guru: { nama: "Pak Suryanto", nip: "198501012010011001" },
    dudi: { nama: "PT Kreatif Teknologi", lokasi: "Jakarta", pembimbing: "Andi Wijaya" },
    periode: { mulai: "1 Feb 2024", selesai: "1 Mei 2024", durasi: "90 hari" },
    status: "Aktif",
    nilai: null
  },
  {
    siswa: { nama: "Siti Nurhaliza", nis: "2024002", kelas: "XII RPL 1", jurusan: "Rekayasa Perangkat Lunak" },
    guru: { nama: "Bu Kartika", nip: "198502022010012002" },
    dudi: { nama: "CV Digital Solusi", lokasi: "Surabaya", pembimbing: "Sari Dewi" },
    periode: { mulai: "15 Jan 2024", selesai: "15 Apr 2024", durasi: "91 hari" },
    status: "Selesai",
    nilai: 87
  },
  {
    siswa: { nama: "Budi Santoso", nis: "2024003", kelas: "XII RPL 2", jurusan: "Rekayasa Perangkat Lunak" },
    guru: { nama: "Pak Hendro", nip: "198503032010013003" },
    dudi: { nama: "PT Inovasi Mandiri", lokasi: "Surabaya", pembimbing: "Budi Santoso" },
    periode: { mulai: "1 Mar 2024", selesai: "1 Jun 2024", durasi: "92 hari" },
    status: "Pending",
    nilai: null
  },
  {
    siswa: { nama: "Dewi Lestari", nis: "2024004", kelas: "XII RPL 2", jurusan: "Rekayasa Perangkat Lunak" },
    guru: { nama: "Bu Ratna", nip: "198504042010014004" },
    dudi: { nama: "PT Kreatif Teknologi", lokasi: "Jakarta", pembimbing: "Andi Wijaya" },
    periode: { mulai: "15 Feb 2024", selesai: "15 Mei 2024", durasi: "90 hari" },
    status: "Aktif",
    nilai: null
  },
  {
    siswa: { nama: "Randi Pratama", nis: "2024005", kelas: "XII TKJ 1", jurusan: "Teknik Komputer dan Jaringan" },
    guru: { nama: "Pak Agus", nip: "198505052010015005" },
    dudi: { nama: "PT Teknologi Maju", lokasi: "Jakarta", pembimbing: "Randi Pratama" },
    periode: { mulai: "1 Jan 2024", selesai: "1 Apr 2024", durasi: "91 hari" },
    status: "Selesai",
    nilai: 92
  },
]
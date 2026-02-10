"use client"
import { useEffect, useState } from "react"
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
  const [data, setData] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    disetujui: 0,
    ditolak: 0
  })

  useEffect(() => {
    fetch("/api/guru/logbook")
      .then(res => res.json())
      .then(res => {
        setData(res.data || [])
        setStats(res.stats || {})
      })
  }, [])
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
        <div className="grid grid-cols-4 gap-6">
          <StatCard title="Total Logbook" value={stats.total} icon={<BookOpen />} />
          <StatCard title="Belum Diverifikasi" value={stats.pending} icon={<Clock />} />
          <StatCard title="Disetujui" value={stats.disetujui} icon={<ThumbsUp />} />
          <StatCard title="Ditolak" value={stats.ditolak} icon={<ThumbsDown />} />
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
                  {data.map((item, index) => (
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

function StatCard({ title, value, icon }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <p className="text-sm font-bold">{title}</p>
          {icon}
        </div>
        <h3 className="text-3xl font-extrabold">{value}</h3>
      </CardContent>
    </Card>
  )
}


function JurnalRow({ data }: any) {
  const siswa = data.magang.siswa

  const statusMap: any = {
    pending: "Belum Diverifikasi",
    disetujui: "Disetujui",
    ditolak: "Ditolak"
  }

  const colorMap: any = {
    pending: "bg-orange-100 text-orange-600",
    disetujui: "bg-green-100 text-green-600",
    ditolak: "bg-red-100 text-red-600"
  }

  return (
    <TableRow>
      <TableCell>
        <b>{siswa.nama}</b><br />
        <span className="text-xs">{siswa.nis} • {siswa.kelas}</span>
      </TableCell>

      <TableCell>{data.tanggal}</TableCell>

      <TableCell>{data.kegiatan}</TableCell>

      <TableCell>
        <Badge className={colorMap[data.status_verifikasi]}>
          {statusMap[data.status_verifikasi]}
        </Badge>
      </TableCell>

      <TableCell>
        <Button variant="ghost" size="icon">
          <Eye size={18} />
        </Button>
      </TableCell>
    </TableRow>
  )
}


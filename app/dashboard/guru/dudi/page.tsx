"use client"

import { useEffect, useState } from "react"
import {
  Building2, Users, Search, User, Mail, Phone, BookOpen, MapPin, 
  ChevronLeft, ChevronRight, Loader2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SharedHeader } from "@/components/shared-header"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

export default function GuruDudiPage() {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dudiList, setDudiList] = useState<any[]>([])
  const [stats, setStats] = useState({ totalDudi: 0, totalSiswaMagang: 0, rataRataSiswa: 0 })
  const [search, setSearch] = useState("")

  // 1. Ambil User Login
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUserData(data.user))
      .catch(err => console.error(err))
  }, [])

  // 2. Fetch Data DUDI Guru
  useEffect(() => {
    if (!userData?.id) return

    setLoading(true)
    fetch(`/api/guru/dudi?user_id=${userData.id}`)
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setDudiList(res.data)
          setStats(res.stats)
        }
      })
      .finally(() => setLoading(false))
  }, [userData])

  // Filter Pencarian Client-Side
  const filteredDudi = dudiList.filter(d => 
    d.nama_perusahaan.toLowerCase().includes(search.toLowerCase()) ||
    d.alamat?.toLowerCase().includes(search.toLowerCase()) ||
    d.penanggung_jawab?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SharedHeader />

      <div className="p-10 max-w-[1680px] mx-auto space-y-8">
        
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen DUDI</h1>
          <p className="text-slate-500 mt-2 font-medium">Daftar perusahaan mitra siswa bimbingan Anda.</p>
        </div>

        {/* STATISTIK CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total DUDI" 
            value={stats.totalDudi} 
            desc="Perusahaan mitra aktif" 
            icon={<Building2 className="text-[#0EA5E9]" size={26} />} 
          />
          <StatCard 
            title="Total Siswa Magang" 
            value={stats.totalSiswaMagang} 
            desc="Siswa bimbingan aktif" 
            icon={<Users className="text-[#0EA5E9]" size={26} />} 
          />
          <StatCard 
            title="Rata-rata Siswa" 
            value={stats.rataRataSiswa} 
            desc="Per perusahaan" 
            icon={<BookOpen className="text-[#0EA5E9]" size={26} />} 
          />
        </div>

        {/* TABEL DUDI (READ ONLY) */}
        <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden min-h-[600px]">
          <div className="p-8 space-y-8">
            
            <div className="flex items-center gap-4">
               <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
                  <Building2 size={24} strokeWidth={2.5} />
               </div>
               <h3 className="text-2xl font-bold text-slate-800">Daftar Perusahaan Mitra</h3>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
               <div className="relative w-full sm:w-[450px]">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input 
                     placeholder="Cari perusahaan, alamat, penanggung jawab..." 
                     className="pl-14 h-14 rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-base text-slate-700"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               
               <div className="flex items-center gap-3">
                  <span className="text-base text-slate-600 font-medium">Tampilkan:</span>
                  <select className="h-12 rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none">
                     <option>10</option>
                     <option>20</option>
                     <option>50</option>
                  </select>
                  <span className="text-base text-slate-600 font-medium">per halaman</span>
               </div>
            </div>

            {/* Table Content */}
            <div className="overflow-hidden rounded-xl border border-slate-100">
               <Table>
                  <TableHeader className="bg-[#F8FAFC]">
                     <TableRow className="border-slate-100 hover:bg-[#F8FAFC]">
                        <TableHead className="py-6 pl-8 font-bold text-slate-700 text-sm">Perusahaan</TableHead>
                        <TableHead className="py-6 font-bold text-slate-700 text-sm">Kontak</TableHead>
                        <TableHead className="py-6 font-bold text-slate-700 text-sm">Penanggung Jawab</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-700 text-sm pr-8">Siswa Bimbingan</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {loading ? (
                        <TableRow>
                           <TableCell colSpan={4} className="h-48 text-center text-slate-400">
                              <div className="flex justify-center items-center gap-2">
                                 <Loader2 className="animate-spin" /> Memuat data...
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : filteredDudi.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={4} className="h-48 text-center text-slate-400 font-medium italic">
                              Tidak ada data perusahaan yang ditemukan.
                           </TableCell>
                        </TableRow>
                     ) : (
                        filteredDudi.map((dudi, index) => (
                           <TableRow key={index} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                              <TableCell className="pl-8 py-6 align-top">
                                 <div className="flex items-start gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-lg bg-[#0EA5E9] text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-200">
                                       <Building2 size={20} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                       <p className="font-bold text-slate-800 text-base">{dudi.nama_perusahaan}</p>
                                       <div className="flex items-start gap-1.5 mt-1.5 text-slate-500">
                                          <MapPin size={14} className="mt-0.5 shrink-0" />
                                          <p className="text-sm font-medium leading-snug max-w-[280px]">{dudi.alamat}</p>
                                       </div>
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell className="py-6 align-top">
                                 <div className="space-y-2">
                                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                                       <Mail size={15} className="text-slate-400" /> {dudi.email || "-"}
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                                       <Phone size={15} className="text-slate-400" /> {dudi.telepon || "-"}
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell className="py-6 align-top">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                                       <User size={14} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{dudi.penanggung_jawab || "-"}</span>
                                 </div>
                              </TableCell>
                              <TableCell className="pr-8 py-6 align-top text-center">
                                 <div className="w-9 h-9 rounded-full bg-[#a38b26] text-white flex items-center justify-center mx-auto text-sm font-bold shadow-sm cursor-default">
                                    {dudi.jumlah_siswa}
                                 </div>
                              </TableCell>
                           </TableRow>
                        ))
                     )}
                  </TableBody>
               </Table>
            </div>

            {/* Pagination UI (Statis untuk contoh) */}
            {!loading && filteredDudi.length > 0 && (
               <div className="flex flex-col sm:flex-row items-center justify-between pt-2">
                  <p className="text-sm text-slate-500 font-medium">Menampilkan {filteredDudi.length} entri</p>
                  <div className="flex gap-2">
                     <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-600" disabled>
                        <ChevronLeft size={20} />
                     </Button>
                     <Button className="h-10 w-10 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-sm shadow-md">1</Button>
                     <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-600" disabled>
                        <ChevronRight size={20} />
                     </Button>
                  </div>
               </div>
            )}

          </div>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, desc, icon }: any) {
  return (
    <Card className="border-none shadow-sm rounded-[24px] bg-white">
      <CardContent className="p-8">
         <div className="flex justify-between items-start mb-4">
             <p className="text-sm font-bold text-slate-500">{title}</p>
             <div className="opacity-90">{icon}</div>
         </div>
         <div>
            <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-none mb-2">{value}</h3>
            <p className="text-xs text-slate-400 font-medium">{desc}</p>
         </div>
      </CardContent>
    </Card>
  )
}
"use client"

import { useEffect, useState } from "react"
import {
  Building2, Users, Plus, Search, Pencil, Trash2,
  CheckCircle2, XCircle, User, Mail, Phone,
  ChevronLeft, ChevronRight
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"

type Dudi = {
  id: number
  nama_perusahaan: string
  alamat: string
  email: string
  telepon: string
  penanggung_jawab: string
  status: "aktif" | "nonaktif" 
}

export default function DudiManagement() {
  const [dudiList, setDudiList] = useState<Dudi[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchDudi()
  }, [])

  const fetchDudi = async () => {
    try {
      const res = await fetch("/api/dudi")
      const json = await res.json()
      if (res.ok) {
        setDudiList(json.data)
      } else {
        console.error(json.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Filter hasil search
  const filteredDudi = dudiList.filter(d =>
    d.nama_perusahaan.toLowerCase().includes(search.toLowerCase()) ||
    d.alamat.toLowerCase().includes(search.toLowerCase()) ||
    d.penanggung_jawab.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-100 h-[90px] px-10 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="font-bold text-xl text-slate-800">SMK Brantas Karangkates</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Sistem Manajemen Magang Siswa</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-base font-bold text-slate-800">Admin Sistem</p>
            <p className="text-sm text-slate-500 font-medium">Admin</p>
          </div>
          <Avatar className="h-12 w-12 bg-[#0EA5E9] text-white ring-4 ring-slate-50 cursor-pointer">
            <AvatarFallback className="bg-[#0EA5E9] text-white"><User size={24} /></AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Body */}
      <div className="p-10 max-w-[1680px] mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen DUDI</h1>

        {/* Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <StatCardDudi title="Total DUDI" value={dudiList.length} desc="Perusahaan mitra" icon={<Building2 className="text-[#0EA5E9]" size={28} />} />
          
          {/* Perbaikan: status === "aktif" */}
          <StatCardDudi title="DUDI Aktif" value={dudiList.filter(d => d.status === "aktif").length} desc="Perusahaan aktif" icon={<CheckCircle2 className="text-[#16A34A]" size={28} />} />
          
          {/* Perbaikan: status === "nonaktif" sesuai database */}
          <StatCardDudi title="DUDI Tidak Aktif" value={dudiList.filter(d => d.status === "nonaktif").length} desc="Perusahaan tidak aktif" icon={<XCircle className="text-[#DC2626]" size={28} />} />
          
          <StatCardDudi title="Total Siswa Magang" value={0} desc="Siswa magang aktif" icon={<Users className="text-[#0EA5E9]" size={28} />} />
        </div>

        {/* Daftar DUDI */}
        <Card className="border-none shadow-sm rounded-[20px] bg-white overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
                  <Building2 size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Daftar DUDI</h3>
              </div>
              <Button className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-xl px-8 py-7 font-bold text-base shadow-lg shadow-blue-200/50 transition-all hover:scale-105">
                <Plus className="mr-2 h-6 w-6" strokeWidth={3} /> Tambah DUDI
              </Button>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
              <div className="relative w-full sm:w-[450px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input 
                  placeholder="Cari perusahaan, alamat, penanggung jawab..."
                  className="pl-12 h-14 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-base text-slate-700 placeholder:text-slate-400"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-[#F8FAFC]">
                  <TableRow>
                    <TableHead className="py-6 pl-6 font-bold text-slate-600 text-sm uppercase tracking-wide">Perusahaan</TableHead>
                    <TableHead className="py-6 font-bold text-slate-600 text-sm uppercase tracking-wide">Kontak</TableHead>
                    <TableHead className="py-6 font-bold text-slate-600 text-sm uppercase tracking-wide">Penanggung Jawab</TableHead>
                    <TableHead className="py-6 text-center font-bold text-slate-600 text-sm uppercase tracking-wide">Status</TableHead>
                    <TableHead className="py-6 text-center font-bold text-slate-600 text-sm uppercase tracking-wide">Siswa Magang</TableHead>
                    <TableHead className="py-6 text-center font-bold text-slate-600 text-sm uppercase tracking-wide pr-6">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-slate-500">Loading...</TableCell>
                    </TableRow>
                  ) : filteredDudi.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-slate-500">Tidak ada data</TableCell>
                    </TableRow>
                  ) : (
                    filteredDudi.map(d => (
                      <DudiRow
                        id={d.id}
                        nama_perusahaan={d.nama_perusahaan}
                        alamat={d.alamat}
                        email={d.email}
                        telepon={d.telepon}
                        penanggung_jawab={d.penanggung_jawab}
                        status={d.status}
                        count={0} // nanti bisa hitung siswa magang
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

// === Komponen tambahan ===
function StatCardDudi({ title, value, desc, icon }: any) {
  return (
    <Card className="border-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] rounded-[20px] bg-white h-[160px] flex flex-col justify-center overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-8">
         <div className="flex justify-between items-start">
             <div className="space-y-3">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">{title}</p>
                <h3 className="text-[40px] font-extrabold text-slate-800 leading-none">{value}</h3>
                <p className="text-sm text-slate-400 font-medium">{desc}</p>
             </div>
             <div className="opacity-100">{icon}</div>
         </div>
      </CardContent>
    </Card>
  )
}

function DudiRow({ nama_perusahaan, alamat, email, telepon, penanggung_jawab, status, count }: Dudi & { count: number }) {
  const isAktif = status === "aktif"
  const initials = penanggung_jawab
    ? penanggung_jawab.split(' ').map(n => n[0]).join('').substring(0, 2)
    : "NA" // fallback kalau null/undefined

  return (
    <TableRow className="group hover:bg-slate-50/80 border-slate-100 transition-colors">
      <TableCell className="pl-6 py-6 flex items-start gap-4">
        <div className="mt-0.5 p-3 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-xl shrink-0 group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors">
          <Building2 size={22} strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-base">{nama_perusahaan}</p>
          <p className="text-sm text-slate-500 font-medium mt-1 max-w-[250px]">{alamat}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
            <Mail size={15} className="text-slate-400" /> {email}
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
            <Phone size={15} className="text-slate-400" /> {telepon}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-slate-100 bg-slate-50">
            <AvatarFallback className="text-xs text-slate-500 font-bold bg-slate-100">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold text-slate-700">{penanggung_jawab || "Belum ada"}</span>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <Badge className={`border-none px-4 py-1.5 text-xs font-bold rounded-lg ${
          isAktif ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        }`}>{status}</Badge>
      </TableCell>
      <TableCell className="text-center">
        <div className="w-8 h-8 rounded-lg bg-[#84cc16] hover:bg-[#65a30d] text-white flex items-center justify-center mx-auto text-xs font-bold">{count}</div>
      </TableCell>
      <TableCell className="pr-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
            <Pencil size={18} strokeWidth={2.5} />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 size={18} strokeWidth={2.5} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

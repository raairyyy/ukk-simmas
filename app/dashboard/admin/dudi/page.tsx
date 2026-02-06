"use client"

import {
  Building2,
  Users,
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  User,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
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

export default function DudiManagement() {
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

        {/* Content Body */}
        <div className="p-10 max-w-[1680px] mx-auto space-y-8">
          
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen DUDI</h1>
          </div>

          {/* Grid 2 Kolom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <StatCardDudi
              title="Total DUDI"
              value="6"
              desc="Perusahaan mitra"
              icon={<Building2 className="text-[#0EA5E9]" size={28} />} 
            />
            <StatCardDudi
              title="DUDI Aktif"
              value="4"
              desc="Perusahaan aktif"
              icon={<CheckCircle2 className="text-[#16A34A]" size={28} />} 
            />
             <StatCardDudi
              title="DUDI Tidak Aktif"
              value="2"
              desc="Perusahaan tidak aktif"
              icon={<XCircle className="text-[#DC2626]" size={28} />} 
            />
            <StatCardDudi
              title="Total Siswa Magang"
              value="55"
              desc="Siswa magang aktif"
              icon={<Users className="text-[#0EA5E9]" size={28} />} 
            />
          </div>

          {/* MAIN CARD: DAFTAR DUDI */}
          <Card className="border-none shadow-sm rounded-[20px] bg-white overflow-hidden">
            <div className="p-8 space-y-8">
                
                {/* Header Tabel */}
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

                {/* Filter & Search */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                    <div className="relative w-full sm:w-[450px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <Input 
                            placeholder="Cari perusahaan, alamat, penanggung jawab..." 
                            className="pl-12 h-14 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-base text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <span className="text-base text-slate-600 font-medium">Tampilkan:</span>
                        <div className="relative">
                            <select className="h-12 rounded-xl border border-slate-200 bg-white text-base font-semibold px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer text-slate-700 min-w-[80px]">
                                <option>5</option>
                                <option>10</option>
                                <option>25</option>
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 rotate-90 pointer-events-none" />
                        </div>
                        <span className="text-base text-slate-600 font-medium">entri</span>
                    </div>
                </div>

                {/* Tabel */}
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                    <Table>
                    <TableHeader className="bg-[#F8FAFC]">
                        <TableRow className="border-slate-100 hover:bg-[#F8FAFC]">
                        <TableHead className="py-6 pl-6 font-bold text-slate-600 text-sm uppercase tracking-wide">Perusahaan</TableHead>
                        <TableHead className="py-6 font-bold text-slate-600 text-sm uppercase tracking-wide">Kontak</TableHead>
                        <TableHead className="py-6 font-bold text-slate-600 text-sm uppercase tracking-wide">Penanggung Jawab</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-600 text-sm uppercase tracking-wide">Status</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-600 text-sm uppercase tracking-wide">Siswa Magang</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-600 text-sm uppercase tracking-wide pr-6">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <DudiRow 
                            name="PT Kreatif Teknologi" 
                            address="Jl. Merdeka No. 123, Jakarta"
                            email="info@kreatiftek.com"
                            phone="021-12345678"
                            pic="Andi Wijaya"
                            status="Aktif"
                            count={8}
                        />
                        <DudiRow 
                            name="CV Digital Solusi" 
                            address="Jl. Sudirman No. 45, Surabaya"
                            email="contact@digitalsolusi.com"
                            phone="031-87654321"
                            pic="Sari Dewi"
                            status="Aktif"
                            count={5}
                        />
                        <DudiRow 
                            name="PT Inovasi Mandiri" 
                            address="Jl. Diponegoro No. 78, Surabaya"
                            email="hr@inovasimandiri.co.id"
                            phone="031-5553456"
                            pic="Budi Santoso"
                            status="Tidak Aktif"
                            count={12}
                        />
                        <DudiRow 
                            name="PT Teknologi Maju" 
                            address="Jl. HR Rasuna Said No. 12, Jakarta"
                            email="info@tekmaju.com"
                            phone="021-33445566"
                            pic="Lisa Permata"
                            status="Aktif"
                            count={6}
                        />
                        <DudiRow 
                            name="CV Solusi Digital Prima" 
                            address="Jl. Gatot Subroto No. 88, Bandung"
                            email="contact@sdprima.com"
                            phone="022-7788990"
                            pic="Rahmat Hidayat"
                            status="Aktif"
                            count={9}
                        />
                    </TableBody>
                    </Table>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                    <p className="text-base text-slate-500 font-medium">Menampilkan 1 sampai 5 dari 6 entri</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50" disabled>
                            <ChevronLeft size={18} />
                        </Button>
                        <Button variant="default" size="icon" className="h-10 w-10 rounded-lg bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold shadow-md shadow-blue-200 text-base">
                            1
                        </Button>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-base">
                            2
                        </Button>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50">
                            <ChevronRight size={18} />
                        </Button>
                    </div>
                </div>

            </div>
          </Card>
        </div>
    </>
  )
}

// === KOMPONEN TAMBAHAN ===
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
             <div className="opacity-100">
                {icon}
             </div>
         </div>
      </CardContent>
    </Card>
  )
}

function DudiRow({ name, address, email, phone, pic, status, count }: any) {
  const isAktif = status === "Aktif"
  
  return (
    <TableRow className="group hover:bg-slate-50/80 border-slate-100 transition-colors">
      <TableCell className="pl-6 py-6">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 p-3 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-xl shrink-0 group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors">
             <Building2 size={22} strokeWidth={2.5} />
          </div>
          <div>
             <p className="font-bold text-slate-800 text-base">{name}</p>
             <div className="flex items-start gap-1.5 mt-1.5">
                <p className="text-sm text-slate-500 font-medium leading-tight max-w-[250px]">{address}</p>
             </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
         <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
               <Mail size={15} className="text-slate-400" /> {email}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
               <Phone size={15} className="text-slate-400" /> {phone}
            </div>
         </div>
      </TableCell>
      <TableCell>
         <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-slate-100 bg-slate-50">
               <AvatarFallback className="text-xs text-slate-500 font-bold bg-slate-100">
                  {pic.split(' ').map((n:string) => n[0]).join('').substring(0,2)}
               </AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold text-slate-700">{pic}</span>
         </div>
      </TableCell>
      <TableCell className="text-center">
         <Badge className={`border-none px-4 py-1.5 text-xs font-bold shadow-none rounded-lg ${
            isAktif 
            ? "bg-green-50 text-green-600 hover:bg-green-50" 
            : "bg-red-50 text-red-600 hover:bg-red-50"
         }`}>
            {status}
         </Badge>
      </TableCell>
      <TableCell className="text-center">
         <div className="w-8 h-8 rounded-lg bg-[#84cc16] hover:bg-[#65a30d] text-white flex items-center justify-center mx-auto text-xs font-bold shadow-sm cursor-pointer transition-colors">
            {count}
         </div>
      </TableCell>
      <TableCell className="pr-6 text-center">
         <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
               <Pencil size={18} strokeWidth={2.5} />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
               <Trash2 size={18} strokeWidth={2.5} />
            </Button>
         </div>
      </TableCell>
    </TableRow>
  )
}
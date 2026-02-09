"use client"

import {
  Building2,
  Users,
  Search,
  User,
  Mail,
  Phone,
  BookOpen,
  MapPin,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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

export default function GuruDudiPage() {
  return (
    <>
      {/* Header Page */}
      <SharedHeader />

      {/* Content Body */}
      <div className="p-10 max-w-[1680px] mx-auto space-y-8">
        
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen DUDI</h1>
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total DUDI" 
            value="6" 
            desc="Perusahaan mitra aktif" 
            icon={<Building2 className="text-[#0EA5E9]" size={26} />} 
          />
          <StatCard 
            title="Total Siswa Magang" 
            value="55" 
            desc="Siswa magang aktif" 
            icon={<Users className="text-[#0EA5E9]" size={26} />} 
          />
          <StatCard 
            title="Rata-rata Siswa" 
            value="9" 
            desc="Per perusahaan" 
            icon={<BookOpen className="text-[#0EA5E9]" size={26} />} 
          />
        </div>

        {/* Main Content Card */}
        <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden min-h-[600px]">
          <div className="p-8 space-y-8">
            
            {/* Card Header Title */}
            <div className="flex items-center gap-4">
               <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
                  <Building2 size={24} strokeWidth={2.5} />
               </div>
               <h3 className="text-2xl font-bold text-slate-800">Daftar DUDI</h3>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
               <div className="relative w-full sm:w-[450px]">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input 
                     placeholder="Cari perusahaan, alamat, penanggung jawab..." 
                     className="pl-14 h-14 rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-base text-slate-700 placeholder:text-slate-400"
                  />
               </div>
               
               <div className="flex items-center gap-3">
                  <span className="text-base text-slate-600 font-medium">Tampilkan:</span>
                  <div className="relative">
                     <select className="h-12 rounded-xl border border-slate-200 bg-white text-base font-semibold px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer text-slate-700 min-w-[80px]">
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                     </select>
                  </div>
                  <span className="text-base text-slate-600 font-medium">per halaman</span>
               </div>
            </div>

            {/* Table Section */}
            <div className="overflow-hidden rounded-xl border border-slate-100">
               <Table>
                  <TableHeader className="bg-[#F8FAFC]">
                     <TableRow className="border-slate-100 hover:bg-[#F8FAFC]">
                        <TableHead className="py-6 pl-8 font-bold text-slate-700 text-sm">Perusahaan</TableHead>
                        <TableHead className="py-6 font-bold text-slate-700 text-sm">Kontak</TableHead>
                        <TableHead className="py-6 font-bold text-slate-700 text-sm">Penanggung Jawab</TableHead>
                        <TableHead className="py-6 text-center font-bold text-slate-700 text-sm pr-8">Siswa Magang</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {dudiList.map((dudi, index) => (
                        <TableRow key={index} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                           <TableCell className="pl-8 py-6">
                              <div className="flex items-start gap-4">
                                 <div className="mt-1 w-10 h-10 rounded-lg bg-[#0EA5E9] text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-200">
                                    <Building2 size={20} strokeWidth={2.5} />
                                 </div>
                                 <div>
                                    <p className="font-bold text-slate-800 text-base">{dudi.name}</p>
                                    <div className="flex items-start gap-1.5 mt-1.5 text-slate-500">
                                       <MapPin size={14} className="mt-0.5 shrink-0" />
                                       <p className="text-sm font-medium leading-snug max-w-[280px]">{dudi.address}</p>
                                    </div>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell className="py-6">
                              <div className="space-y-2">
                                 <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                                    <Mail size={15} className="text-slate-400" /> {dudi.email}
                                 </div>
                                 <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                                    <Phone size={15} className="text-slate-400" /> {dudi.phone}
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell className="py-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                                    <User size={14} />
                                 </div>
                                 <span className="text-sm font-bold text-slate-700">{dudi.pic}</span>
                              </div>
                           </TableCell>
                           <TableCell className="pr-8 py-6 text-center">
                              <div className="w-9 h-9 rounded-full bg-[#a38b26] hover:bg-[#85711f] text-white flex items-center justify-center mx-auto text-sm font-bold shadow-sm cursor-pointer transition-colors">
                                 {dudi.count}
                              </div>
                           </TableCell>
                        </TableRow>
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

// === KOMPONEN & DATA DUMMY ===

function StatCard({ title, value, desc, icon }: any) {
  return (
    <Card className="border-none shadow-sm rounded-[20px] bg-white">
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

const dudiList = [
  {
    name: "PT Kreatif Teknologi",
    address: "Jl. Merdeka No. 123, Jakarta",
    email: "info@kreatiftek.com",
    phone: "021-12345678",
    pic: "Andi Wijaya",
    count: 8
  },
  {
    name: "CV Digital Solusi",
    address: "Jl. Sudirman No. 45, Surabaya",
    email: "contact@digitalsolusi.com",
    phone: "031-87654321",
    pic: "Sari Dewi",
    count: 5
  },
  {
    name: "PT Inovasi Mandiri",
    address: "Jl. Diponegoro No. 78, Surabaya",
    email: "hr@inovasimandiri.co.id",
    phone: "031-5553456",
    pic: "Budi Santoso",
    count: 12
  },
  {
    name: "PT Teknologi Maju",
    address: "Jl. HR Rasuna Said No. 12, Jakarta",
    email: "info@tekmaju.com",
    phone: "021-33445566",
    pic: "Lisa Permata",
    count: 6
  },
  {
    name: "CV Solusi Digital Prima",
    address: "Jl. Gatot Subroto No. 88, Bandung",
    email: "contact@sdprima.com",
    phone: "022-7788990",
    pic: "Rahmat Hidayat",
    count: 9
  },
]
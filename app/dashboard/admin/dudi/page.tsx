"use client"

import { useEffect, useState } from "react"
import {
  Building2, Users, Plus, Search, Pencil, Trash2,
  CheckCircle2, XCircle, User, Mail, Phone,RotateCcw,
  ChevronLeft, ChevronRight,
  Bell
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
  total_siswa_magang: number
  is_deleted: boolean   // ✅ tambahkan ini
}


export default function DudiManagement() {
  const [dudiList, setDudiList] = useState<Dudi[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showToast, setShowToast] = useState(false); // State untuk menampilkan notifikasi
  const [toastMessage, setToastMessage] = useState(""); // Pesan notifikasi
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

const handleSubmit = async () => {

  if (
    !formData.nama_perusahaan ||
    !formData.alamat ||
    !formData.telepon ||
    !formData.email ||
    !formData.penanggung_jawab
  ) {
    alert("Semua field wajib diisi")
    return
  }

  const res = await fetch("/api/dudi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  })

  const json = await res.json()

if (res.ok) {
    // 1. Tutup Modal
    setIsOpen(false)
    // 2. Reset Form
    setFormData({ nama_perusahaan: "", alamat: "", telepon: "", email: "", penanggung_jawab: "", status: "aktif" })
    // 3. Refresh Data
    fetchDudi()
    
    // 4. Tampilkan Notifikasi Kustom
    setToastMessage("Data DUDI berhasil ditambahkan")
    setShowToast(true)
    
    // 5. Hilangkan otomatis setelah 3 detik
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  } else {
    const json = await res.json()
    alert(json.error)
  }
}



  // Filter hasil search
  const filteredDudi = dudiList.filter(d =>
    d.nama_perusahaan.toLowerCase().includes(search.toLowerCase()) ||
    d.alamat.toLowerCase().includes(search.toLowerCase()) ||
    d.penanggung_jawab.toLowerCase().includes(search.toLowerCase())
  )
  
  //Modal Tambah DUDI
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    nama_perusahaan: "",
    alamat: "",
    telepon: "",
    email: "",
    penanggung_jawab: "",
    status: "aktif"
  })

  return (
    <>
    {/* NOTIFIKASI TOAST KUSTOM (POJOK KANAN ATAS) */}
    {showToast && (
      <div className="fixed top-6 right-6 z-[200] animate-in slide-in-from-right duration-300">
        <div className="bg-[#84cc16] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20 min-w-[300px]">
          {/* Ikon Centang (CheckCircle2) */}
          <div className="bg-white/20 p-1.5 rounded-full flex items-center justify-center">
            <CheckCircle2 size={20} strokeWidth={3} />
          </div>
          
          <p className="font-bold text-sm tracking-wide flex-1">
            {toastMessage}
          </p>
          
          {/* Tombol Close (X) */}
          <button 
            onClick={() => setShowToast(false)} 
            className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-2"
          >
            <XCircle size={20} className="opacity-80" />
          </button>
        </div>
      </div>
    )}
      {/* Header */}
      <header className="bg-white border-b border-slate-100 h-[90px] px-10 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="font-bold text-xl text-slate-800">SMK Brantas Karangkates</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Sistem Manajemen Magang Siswa</p>
        </div>

        <div className="flex items-center gap-8">
          {/* Ikon Lonceng Notifikasi */}
          <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
            <Bell size={24} strokeWidth={1.5} />
            {/* Dot indikator jika ada notifikasi baru (Opsional) */}
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Profil Section */}
          <div className="flex items-center gap-4">
            {/* Avatar Kotak Tumpul sesuai Gambar */}
            <div className="w-12 h-12 bg-[#00A9D8] rounded-[14px] flex items-center justify-center text-white shadow-sm cursor-pointer hover:bg-[#0092ba] transition-colors">
              <User size={26} strokeWidth={2.5} />
            </div>

            {/* Info Teks Admin */}
            <div className="text-left hidden sm:block">
              <p className="text-[17px] font-bold text-[#1E293B] leading-none">Admin Sistem</p>
              <p className="text-sm text-slate-400 font-semibold mt-1.5">Admin</p>
            </div>
          </div>
        </div>
      </header>
      {/* Body */}
      <div className="p-8 xl:p-10 max-w-[1400px] mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen DUDI</h1>

        {/* Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <StatCardDudi title="Total DUDI" value={dudiList.length} desc="Perusahaan mitra" icon={<Building2 className="text-[#0EA5E9]" size={28} />} />
          
          {/* Perbaikan: status === "aktif" */}
          <StatCardDudi title="DUDI Aktif" value={dudiList.filter(d => d.status === "aktif").length} desc="Perusahaan aktif" icon={<CheckCircle2 className="text-[#16A34A]" size={28} />} />
          
          {/* Perbaikan: status === "nonaktif" sesuai database */}
          <StatCardDudi title="DUDI Tidak Aktif" value={dudiList.filter(d => d.status === "nonaktif").length} desc="Perusahaan tidak aktif" icon={<XCircle className="text-[#DC2626]" size={28} />} />
          
          <StatCardDudi 
            title="Total Siswa Magang" 
            value={
              dudiList.reduce(
                (total, d) => total + (d.total_siswa_magang || 0),
                0
              )
            }
            desc="Siswa magang aktif" 
            icon={<Users className="text-[#0EA5E9]" size={28} />}
          />
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
              <Button onClick={() => setIsOpen(true)} className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-xl px-8 py-7 font-bold text-base shadow-lg shadow-blue-200/50 transition-all hover:scale-105" >
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
                  <TableRow className="hover:bg-slate-50 transition">
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
                        total_siswa_magang={d.total_siswa_magang}
                        is_deleted={d.is_deleted}   // ✅ tambahkan ini
                        fetchDudi={fetchDudi}
                      />
                    ))


                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
        /* MODAL TAMBAH DUDI (SESUAI GAMBAR) */
        {isOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white w-full max-w-[500px] rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Tambah DUDI Baru</h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">Lengkapi semua informasi yang diperlukan</p>
                </div>

                <div className="space-y-5">
                  {/* Nama Perusahaan */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                      Nama Perusahaan <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Masukkan nama perusahaan"
                      className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 bg-slate-50/30"
                      value={formData.nama_perusahaan}
                      onChange={e => setFormData({...formData, nama_perusahaan: e.target.value})}
                    />
                  </div>

                  {/* Alamat */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                      Alamat <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Masukkan alamat lengkap"
                      className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 bg-slate-50/30"
                      value={formData.alamat}
                      onChange={e => setFormData({...formData, alamat: e.target.value})}
                    />
                  </div>

                  {/* Telepon */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                      Telepon <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Contoh: 021-12345678"
                      className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 bg-slate-50/30"
                      value={formData.telepon}
                      onChange={e => setFormData({...formData, telepon: e.target.value})}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Contoh: info@perusahaan.com"
                      className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 bg-slate-50/30"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  {/* Penanggung Jawab */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                      Penanggung Jawab <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Nama penanggung jawab"
                      className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 bg-slate-50/30"
                      value={formData.penanggung_jawab}
                      onChange={e => setFormData({...formData, penanggung_jawab: e.target.value})}
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full h-12 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white font-medium"
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as "aktif" | "nonaktif"})}
                    >
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Tidak Aktif</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button 
                    className="flex-1 h-12 rounded-xl font-bold bg-[#CBD5E1] hover:bg-slate-400 text-slate-700 transition-all shadow-md shadow-slate-200"
                    onClick={handleSubmit}
                  >
                    Simpan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

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

function DudiRow({ nama_perusahaan, alamat, email, telepon, penanggung_jawab, status, total_siswa_magang,id, is_deleted }: Dudi & { total_siswa_magang: number, fetchDudi: () => void}) {
  const isAktif = status === "aktif"
  const initials = penanggung_jawab
    ? penanggung_jawab.split(' ').map(n => n[0]).join('').substring(0, 2)
    : "NA" // fallback kalau null/undefined

  function fetchDudi() {
    throw new Error("Function not implemented.")
  }

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
      <Badge
        className={`text-xs px-3 py-1 rounded-full font-semibold ${
          isAktif
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
        }`}
      >
        {isAktif ? "Aktif" : "Nonaktif"}
      </Badge>

      </TableCell>
      <TableCell className="text-center">
        <div className="w-8 h-8 rounded-lg bg-[#84cc16] hover:bg-[#65a30d] text-white flex items-center justify-center mx-auto text-xs font-bold">{total_siswa_magang}</div>
      </TableCell>
      <TableCell className="pr-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
            <Pencil size={18} strokeWidth={2.5} />
          </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                const confirmDelete = confirm(
                  is_deleted
                    ? "Pulihkan data ini?"
                    : "Yakin ingin menghapus data ini?"
                )

                if (!confirmDelete) return

                await fetch("/api/dudi", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id, restore: is_deleted })
                })

                fetchDudi()
              }}
            >
              {is_deleted ? (
                <RotateCcw size={18} />
              ) : (
                <Trash2 size={18} />
              )}
            </Button>

        </div>
      </TableCell>
    </TableRow>
  )
  
}

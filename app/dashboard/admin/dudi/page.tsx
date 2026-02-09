"use client"

import { useEffect, useState } from "react"
import {
  Building2, Users, Plus, Search, Pencil, Trash2,
  CheckCircle2, XCircle, User, Mail, Phone, RotateCcw,
  ChevronLeft, ChevronRight, Bell,
  LogOut
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ConfirmModal } from "@/components/modals/confirm-modal"

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
  is_deleted: boolean
}

export default function DudiManagement() {
  const [dudiList, setDudiList] = useState<Dudi[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [targetDudi, setTargetDudi] = useState<{ id: number, name: string, isDeleted: boolean } | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [nameError, setNameError] = useState("")

  const [formData, setFormData] = useState({
    nama_perusahaan: "",
    alamat: "",
    telepon: "",
    email: "",
    penanggung_jawab: "",
    status: "aktif" as "aktif" | "nonaktif"
  })

  // FIX: Tambahkan pengecekan (val || "") agar tidak error saat nilai null
  const isFormValid = 
    (formData.nama_perusahaan || "").trim() !== "" &&
    (formData.alamat || "").trim() !== "" &&
    (formData.telepon || "").trim() !== "" &&
    (formData.email || "").trim() !== "" &&
    (formData.penanggung_jawab || "").trim() !== "" &&
    nameError === "";

const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  // Ambil data profil saat halaman dimuat
  useEffect(() => {
    fetch("/api/auth/me").then(res => res.json()).then(res => setUserData(res.user))
    fetchDudi()
  }, [])

  // Fungsi Logout
  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) window.location.href = "/login"
  }

  const fetchDudi = async () => {
    setLoading(true)
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

  const handleEdit = (dudi: Dudi) => {
    setEditId(dudi.id)
    setFormData({
      nama_perusahaan: dudi.nama_perusahaan || "",
      alamat: dudi.alamat || "",
      telepon: dudi.telepon || "",
      email: dudi.email || "",
      penanggung_jawab: dudi.penanggung_jawab || "",
      status: dudi.status || "aktif"
    })
    setNameError("")
    setIsOpen(true)
  }

  const triggerAction = (id: number, name: string, isDeleted: boolean) => {
    setTargetDudi({ id, name, isDeleted })
    setIsConfirmOpen(true)
  }

  const handleConfirmAction = async () => {
    if (!targetDudi) return
    try {
      const res = await fetch("/api/dudi", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetDudi.id,
          restore: targetDudi.isDeleted
        })
      })

      if (res.ok) {
        setToastMessage(targetDudi.isDeleted ? "Data berhasil dipulihkan" : "Data berhasil dihapus")
        setShowToast(true)
        fetchDudi()
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsConfirmOpen(false)
      setTargetDudi(null)
    }
  }

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setNameError("");

    const method = editId ? "PUT" : "POST"
    const payload = editId ? { ...formData, id: editId } : formData

    const res = await fetch("/api/dudi", {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    const json = await res.json()

    if (res.ok) {
      setIsOpen(false)
      setEditId(null)
      setFormData({ nama_perusahaan: "", alamat: "", telepon: "", email: "", penanggung_jawab: "", status: "aktif" })
      fetchDudi()
      setToastMessage(editId ? "Data DUDI berhasil diperbarui" : "Data DUDI berhasil ditambahkan")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } else {
      if (json.error === "Nama perusahaan sudah terdaftar") {
        setNameError(json.error);
      } else {
        alert(json.error)
      }
    }
  }

  const filteredDudi = dudiList.filter(d =>
    (d.nama_perusahaan || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.alamat || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.penanggung_jawab || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title={targetDudi?.isDeleted ? "Konfirmasi Pulihkan" : "Konfirmasi Hapus"}
        description={
          targetDudi?.isDeleted
            ? `Apakah Anda yakin ingin memulihkan data ${targetDudi.name}? Data ini akan aktif kembali di sistem.`
            : `Apakah Anda yakin ingin menghapus data ${targetDudi?.name}? Data akan dipindahkan ke arsip.`
        }
        confirmText={targetDudi?.isDeleted ? "Ya, Pulihkan" : "Ya, Hapus"}
        variant={targetDudi?.isDeleted ? "success" : "danger"}
      />

      {showToast && (
        <div className="fixed top-6 right-6 z-[200] animate-in slide-in-from-right duration-300">
          <div className="bg-[#84cc16] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20 min-w-[300px]">
            <div className="bg-white/20 p-1.5 rounded-full flex items-center justify-center">
              <CheckCircle2 size={20} strokeWidth={3} />
            </div>
            <p className="font-bold text-sm tracking-wide flex-1">{toastMessage}</p>
            <button onClick={() => setShowToast(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-2">
              <XCircle size={20} className="opacity-80" />
            </button>
          </div>
        </div>
      )}

<header className="bg-white border-b border-slate-100 h-[90px] px-10 flex items-center justify-between sticky top-0 z-50">
        <div>
          <h2 className="font-bold text-xl text-slate-800">SMK Brantas Karangkates</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Sistem Manajemen Magang Siswa</p>
        </div>

        <div className="flex items-center gap-8">
          <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
            <Bell size={24} strokeWidth={1.5} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* === DROPDOWN PROFILE SECTION === */}
          <div className="relative">
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-[#00A9D8] rounded-[14px] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <User size={26} strokeWidth={2.5} />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[17px] font-bold text-[#1E293B] leading-none">{userData?.name || "admin"}</p>
                <p className="text-sm text-slate-400 font-semibold mt-1.5 uppercase">Admin</p>
              </div>
            </div>

            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-sm font-bold text-slate-800">{userData?.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Admin</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors text-sm font-bold group"
                  >
                    <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                      <LogOut size={18} strokeWidth={2.5} />
                    </div>
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="p-8 xl:p-10 max-w-[1400px] mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen DUDI</h1>

{/* Grid Kartu Statistik - Kembali ke tata letak 2x2 */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-7">
  <StatCardDudi 
    title="Total DUDI" 
    value={dudiList.filter(d => !d.is_deleted).length} 
    desc="Perusahaan mitra" 
    icon={<Building2 className="text-[#0EA5E9]" size={28} />} 
  />
  
  <StatCardDudi 
    title="DUDI Aktif" 
    value={dudiList.filter(d => d.status === "aktif" && !d.is_deleted).length} 
    desc="Perusahaan aktif" 
    icon={<CheckCircle2 className="text-[#16A34A]" size={28} />} 
  />
  
  <StatCardDudi 
    title="DUDI Tidak Aktif" 
    value={dudiList.filter(d => d.status === "nonaktif" && !d.is_deleted).length} 
    desc="Perusahaan Tidak Aktif" 
    icon={<RotateCcw className="text-slate-400" size={28} />} 
  />
  
  <StatCardDudi 
    title="Total Siswa Magang" 
    value={dudiList.reduce((total, d) => !d.is_deleted ? total + (Number(d.total_siswa_magang) || 0) : total, 0)}
    desc="Siswa magang aktif" 
    icon={<Users className="text-[#0EA5E9]" size={28} />}
  />
</div>

        <Card className="border-none shadow-sm rounded-[20px] bg-white overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-500"><Building2 size={24} strokeWidth={2.5} /></div>
                <h3 className="text-2xl font-bold text-slate-800">Daftar DUDI</h3>
              </div>
              <Button 
                onClick={() => {
                  setEditId(null);
                  setFormData({ nama_perusahaan: "", alamat: "", telepon: "", email: "", penanggung_jawab: "", status: "aktif" });
                  setIsOpen(true);
                }} 
                className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-xl px-8 py-7 font-bold text-base shadow-lg shadow-blue-200/50 transition-all hover:scale-105"
              >
                <Plus className="mr-2 h-6 w-6" strokeWidth={3} /> Tambah DUDI
              </Button>
            </div>

            <div className="relative w-full sm:w-[450px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Cari perusahaan, alamat, penanggung jawab..."
                className="pl-12 h-14 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-base text-slate-700 placeholder:text-slate-400"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

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
                    <TableRow><TableCell colSpan={6} className="text-center py-6">Loading...</TableCell></TableRow>
                  ) : filteredDudi.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-6">Tidak ada data</TableCell></TableRow>
                  ) : (
                    filteredDudi.map(d => (
                      <DudiRow
                        key={d.id}
                        {...d}
                        onEdit={() => handleEdit(d)}
                        onAction={() => triggerAction(d.id, d.nama_perusahaan, d.is_deleted)}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-[500px] rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {editId ? "Edit Data DUDI" : "Tambah DUDI Baru"}
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-1">Lengkapi semua informasi yang diperlukan</p>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nama Perusahaan <span className="text-red-500">*</span></label>
                  <Input 
                    placeholder="Masukkan nama perusahaan" 
                    className={`h-12 rounded-xl border-slate-200 bg-slate-50/30 ${nameError ? "border-red-500 focus:ring-red-500" : ""}`}
                    value={formData.nama_perusahaan} 
                    onChange={e => {
                        setFormData({ ...formData, nama_perusahaan: e.target.value });
                        setNameError(""); 
                    }} 
                  />
                  {nameError && <p className="text-xs font-bold text-red-500 mt-1 pl-1">• {nameError}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Alamat <span className="text-red-500">*</span></label>
                  <Input placeholder="Masukkan alamat lengkap" className="h-12 rounded-xl border-slate-200 bg-slate-50/30" value={formData.alamat} onChange={e => setFormData({ ...formData, alamat: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Telepon <span className="text-red-500">*</span></label>
                  <Input placeholder="Contoh: 021-12345678" className="h-12 rounded-xl border-slate-200 bg-slate-50/30" value={formData.telepon} onChange={e => setFormData({ ...formData, telepon: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email <span className="text-red-500">*</span></label>
                  <Input placeholder="Contoh: info@perusahaan.com" className="h-12 rounded-xl border-slate-200 bg-slate-50/30" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Penanggung Jawab <span className="text-red-500">*</span></label>
                  <Input placeholder="Nama penanggung jawab" className="h-12 rounded-xl border-slate-200 bg-slate-50/30" value={formData.penanggung_jawab} onChange={e => setFormData({ ...formData, penanggung_jawab: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Status <span className="text-red-500">*</span></label>
                  <select
                    className="w-full h-12 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white font-medium"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as "aktif" | "nonaktif" })}
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold text-slate-600" onClick={() => setIsOpen(false)}>Batal</Button>
                
                <Button 
                  disabled={!isFormValid}
                  className={`flex-1 h-12 rounded-xl font-bold transition-all shadow-md ${
                    isFormValid 
                    ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white shadow-cyan-100" 
                    : "bg-[#CBD5E1] text-slate-400 cursor-not-allowed shadow-none"
                  }`} 
                  onClick={handleSubmit}
                >
                  {editId ? "Simpan Perubahan" : "Simpan"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

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
          <div>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function DudiRow({
  nama_perusahaan, alamat, email, telepon, penanggung_jawab, status, total_siswa_magang, is_deleted, onAction, onEdit
}: Dudi & { onAction: () => void, onEdit: () => void }) {
  const isSoftDeleted = is_deleted === true;
  const initials = penanggung_jawab ? penanggung_jawab.split(' ').map(n => n[0]).join('').substring(0, 2) : "NA";

  return (
    <TableRow className={`group transition-all ${isSoftDeleted ? "bg-slate-50/50 opacity-60" : "hover:bg-slate-50/80"}`}>
      <TableCell className="pl-6 py-6 flex items-start gap-4">
        <div className={`mt-0.5 p-3 rounded-xl shrink-0 ${isSoftDeleted ? "bg-slate-200 text-slate-400" : "bg-[#0EA5E9]/10 text-[#0EA5E9]"}`}>
          <Building2 size={22} strokeWidth={2.5} />
        </div>
        <div>
          <p className={`font-bold text-base ${isSoftDeleted ? "text-slate-400 line-through" : "text-slate-800"}`}>
            {nama_perusahaan} {isSoftDeleted && "(Terhapus)"}
          </p>
          <p className="text-sm text-slate-500 font-medium mt-1 max-w-[250px]">{alamat}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className={`space-y-2 ${isSoftDeleted ? "text-slate-400" : ""}`}>
          <div className="flex items-center gap-2.5 text-sm font-medium"><Mail size={15} /> {email}</div>
          <div className="flex items-center gap-2.5 text-sm font-medium"><Phone size={15} /> {telepon}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 opacity-80">
            <AvatarFallback className="text-xs font-bold bg-slate-100 text-slate-500">{initials}</AvatarFallback>
          </Avatar>
          <span className={`text-sm font-bold ${isSoftDeleted ? "text-slate-400" : "text-slate-700"}`}>{penanggung_jawab}</span>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <Badge className={`text-xs px-3 py-1 rounded-full font-semibold shadow-none border-none ${
          isSoftDeleted 
            ? "bg-slate-200 text-slate-500" 
            : status === "aktif" 
              ? "bg-green-100 text-green-600" 
              : "bg-red-100 text-red-600" // Ubah ini agar status nonaktif berwarna merah, bukan amber
        }`}>
          {isSoftDeleted ? "Nonaktif" : status === "aktif" ? "Aktif" : "Tidak Aktif"}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto text-xs font-bold ${isSoftDeleted ? "bg-slate-200 text-slate-400" : "bg-[#84cc16] text-white"}`}>{total_siswa_magang}</div>
      </TableCell>
      <TableCell className="pr-6 text-center">
        <div className="flex items-center justify-center gap-2">
          {!isSoftDeleted && (
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
              <Pencil size={18} strokeWidth={2.5} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onAction}
            className={`h-9 w-9 ${isSoftDeleted ? "text-green-600 hover:bg-green-50" : "text-slate-400 hover:text-red-600 hover:bg-red-50"}`}
          >
            {isSoftDeleted ? <RotateCcw size={18} strokeWidth={2.5} /> : <Trash2 size={18} strokeWidth={2.5} />}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
"use client"

import { useEffect, useState } from "react"
import {
  Users, Plus, Search, Pencil, Trash2, User, Mail, CheckCircle2,
  Lock, Bell, LogOut, XCircle, Eye, EyeOff,
  GraduationCap
} from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ConfirmModal } from "@/components/modals/confirm-modal"
import { SharedHeader } from "@/components/shared-header"

// Inisialisasi Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const [guruList, setGuruList] = useState<any[]>([])

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // Profile & UI States
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const isAdminLogin = userData?.role === "admin"


  // Form States
const [formData, setFormData] = useState({
  name: "",
  email: "",
  role: "siswa",
  password: "",
  confirmPassword: "",
  verifiedStatus: "unverified",

  // Akademik
  nis: "",
  kelas: "",
  jurusan: "",
  guru_id: "",

  // OPSIONAL
  alamat: "",
  telepon: ""
})


  // LOGIKA VALIDASI: Tombol aktif hanya jika semua field terisi
const isUserFormValid = 
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.password.trim() !== "" &&
    formData.confirmPassword.trim() !== "" &&
    formData.password === formData.confirmPassword &&
    // Validasi tambahan jika role siswa
    (formData.role === 'siswa' ? (formData.nis !== "" && formData.kelas !== "" && formData.jurusan !== "") : true);

  useEffect(() => {
    fetch("/api/auth/me").then(res => res.json()).then(res => setUserData(res.user)) // Jika ada state setUserData
    fetchUsers()
    fetchGurus() // Fetch data guru saat component mount
  }, [])

  const fetchGurus = async () => {
    const { data } = await supabase.from("guru").select("id, nama")
    if (data) setGuruList(data)
  }
  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) window.location.href = "/login"
  }

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("users").select("*").order("id", { ascending: true })
    if (!error) setUsers(data)
    setLoading(false)
  }

  const triggerToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

const handleSaveAdd = async () => {
    if (!isUserFormValid) return;
    try {
      const res = await fetch("/api/pengguna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
          verified: formData.verifiedStatus === "verified",

          ...(formData.role === "siswa" && {
            nis: formData.nis,
            kelas: formData.kelas,
            jurusan: formData.jurusan,
            guru_id: formData.guru_id,
            alamat: formData.alamat,
            telepon: formData.telepon
          })
        }),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        setIsAddOpen(false);
        fetchUsers(); 
        resetForm();
        triggerToast("User berhasil ditambahkan")
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSaveEdit = async () => {
    const { error } = await supabase
      .from("users")
      .update({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        email_verified_at: formData.verifiedStatus === "verified" ? (selectedUser.email_verified_at || new Date().toISOString()) : null
      })
      .eq("id", selectedUser.id)

    if (!error) {
      setIsEditOpen(false)
      fetchUsers()
      triggerToast("Data User berhasil diperbarui")
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    const { error } = await supabase.from("users").delete().eq("id", selectedUser.id)
    if (!error) {
      setIsConfirmOpen(false)
      fetchUsers()
      triggerToast("Data User berhasil dihapus")
    }
  }

const resetForm = () => {
    setFormData({ 
      name: "", email: "", role: "siswa", password: "", confirmPassword: "", verifiedStatus: "unverified",
      nis: "", kelas: "", jurusan: "", guru_id: "", alamat: "", telepon: ""
    })
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const filteredUsers = users.filter(u => {
    const matchSearch = (u.name || "").toLowerCase().includes(search.toLowerCase()) || (u.email || "").toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "all" || u.role?.toLowerCase() === roleFilter.toLowerCase()
    return matchSearch && matchRole
  })

  return (
    <>
      {/* TOAST NOTIFICATION */}
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

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus"
        description="Apakah Anda yakin ingin menghapus data user ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        variant="danger"
      />

      <SharedHeader />

      <div className="p-10 max-w-[1680px] mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen User</h1>

        <Card className="border-none shadow-sm rounded-[20px] bg-white overflow-hidden min-h-[600px]">
          <div className="p-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <Users size={28} className="text-[#0EA5E9]" />
                <h3 className="text-2xl font-bold text-slate-800">Daftar User</h3>
              </div>
              <Button onClick={() => { resetForm(); setIsAddOpen(true); }} className="bg-[#0EA5E9] hover:bg-[#0284C7] rounded-xl px-6 h-12 font-bold transition-all hover:scale-105">
                <Plus className="mr-2 h-5 w-5" strokeWidth={3} /> Tambah User
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mt-2">
              <div className="relative w-full sm:w-[450px]">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input placeholder="Cari nama atau email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-14 h-14 rounded-2xl border-slate-200" />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px] h-12 rounded-xl border-slate-200 font-semibold"><SelectValue placeholder="Semua Role" /></SelectTrigger>
                <SelectContent>
                  {!isAdminLogin && (
                    <SelectItem value="admin">Admin</SelectItem>
                  )}
                  <SelectItem value="guru">Guru</SelectItem>
                  <SelectItem value="siswa">Siswa</SelectItem>
                </SelectContent>

              </Select>
            </div>

            <div className="overflow-hidden mt-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100 uppercase text-xs tracking-wider">
                    <TableHead className="py-6 font-bold text-slate-900">User</TableHead>
                    <TableHead className="py-6 font-bold text-slate-900">Email & Verifikasi</TableHead>
                    <TableHead className="py-6 text-center font-bold text-slate-900">Role</TableHead>
                    <TableHead className="py-6 text-center font-bold text-slate-900">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400">Loading data user...</TableCell></TableRow>
                  ) : filteredUsers.map((user) => (
                    <TableRow key={user.id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="py-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 bg-[#0093E9] text-white">
                            <AvatarFallback>{(user.name || "U").substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-800 text-base">{user.name}</p>
                            <p className="text-xs text-slate-400">ID: {user.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                            <Mail size={16} className="text-slate-400" /> {user.email}
                          </div>
                          {user.email_verified_at && (
                            <Badge className="bg-green-50 text-green-600 border-none px-2 py-0.5 w-fit rounded-md font-bold text-[10px]">
                              <CheckCircle2 size={12} className="mr-1" /> VERIFIED
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`capitalize border-none px-4 py-1.5 rounded-lg font-bold ${
                          user.role?.toLowerCase() === 'admin' ? "bg-purple-100 text-purple-600" :
                          user.role?.toLowerCase() === 'guru' ? "bg-blue-100 text-blue-600" : "bg-cyan-100 text-cyan-600"
                        }`}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => {
                            setSelectedUser(user);
                            setFormData({ ...formData, name: user.name, email: user.email, role: user.role, password: "", confirmPassword: "", verifiedStatus: user.email_verified_at ? "verified" : "unverified" });
                            setIsEditOpen(true);
                          }} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50"><Pencil size={18} /></Button>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(user); setIsConfirmOpen(true); }} className="text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={18} /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>

      {/* --- MODAL TAMBAH USER --- */}
<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-[24px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Tambah User Baru</DialogTitle>
            <p className="text-sm text-slate-500 font-medium">Lengkapi informasi pengguna</p>
          </DialogHeader>
          
          <div className="grid gap-6 py-2">
            {/* Input Standar */}
            <div className="grid gap-2">
              <Label className="font-bold text-slate-700">Nama Lengkap <span className="text-red-500">*</span></Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Masukkan nama lengkap" className="h-12 rounded-xl bg-slate-50/50" />
            </div>
            
            <div className="grid gap-2">
              <Label className="font-bold text-slate-700">Role <span className="text-red-500">*</span></Label>
              <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {userData && userData.role !== "admin" && (
                    <SelectItem value="admin">Admin</SelectItem>
                  )}

                  <SelectItem value="guru">Guru</SelectItem>
                  <SelectItem value="siswa">Siswa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* --- INPUT KHUSUS ROLE SISWA --- */}
            {formData.role === 'siswa' && (
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-1">
                  <GraduationCap size={18} /> Data Akademik Siswa
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase">NIS <span className="text-red-500">*</span></Label>
                    <Input value={formData.nis} onChange={(e) => setFormData({...formData, nis: e.target.value})} placeholder="Nomor Induk" className="h-11 rounded-lg bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase">Kelas <span className="text-red-500">*</span></Label>
                    <Input value={formData.kelas} onChange={(e) => setFormData({...formData, kelas: e.target.value})} placeholder="Contoh: XII RPL 1" className="h-11 rounded-lg bg-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase">Jurusan <span className="text-red-500">*</span></Label>
                    <Input value={formData.jurusan} onChange={(e) => setFormData({...formData, jurusan: e.target.value})} placeholder="Contoh: Rekayasa Perangkat Lunak" className="h-11 rounded-lg bg-white" />
                </div>
                <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 uppercase">
                  Alamat (Opsional)
                </Label>
                <Input
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Alamat tempat tinggal"
                  className="h-11 rounded-lg bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 uppercase">
                  No. Telepon (Opsional)
                </Label>
                <Input
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="h-11 rounded-lg bg-white"
                />
              </div>


                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase">Guru Pembimbing (Opsional)</Label>
                  <Select value={formData.guru_id} onValueChange={(val) => setFormData({...formData, guru_id: val})}>
                    <SelectTrigger className="h-11 rounded-lg bg-white"><SelectValue placeholder="Pilih Guru Pembimbing" /></SelectTrigger>
                    <SelectContent>
                      {guruList.map((guru) => (
                        <SelectItem key={guru.id} value={guru.id.toString()}>{guru.nama}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {/* ------------------------------- */}

            <div className="grid gap-2">
              <Label className="font-bold text-slate-700">Email <span className="text-red-500">*</span></Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="user@email.com" className="h-12 rounded-xl bg-slate-50/50" />
            </div>

            <div className="grid gap-2">
              <Label className="font-bold text-slate-700">Password <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="h-12 rounded-xl bg-slate-50/50 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="font-bold text-slate-700">Konfirmasi Password <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="h-12 rounded-xl bg-slate-50/50 pr-10" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="font-bold text-slate-700">Status Verifikasi</Label>
              <Select value={formData.verifiedStatus} onValueChange={(val) => setFormData({...formData, verifiedStatus: val})}>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unverified">Unverified</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="h-12 px-8 rounded-xl font-bold text-slate-600 flex-1">Batal</Button>
            <Button 
              disabled={!isUserFormValid} 
              onClick={handleSaveAdd} 
              className={`h-12 px-8 rounded-xl font-bold transition-all flex-1 shadow-md ${
                isUserFormValid 
                ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white shadow-cyan-100" 
                : "bg-[#CBD5E1] text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL EDIT USER --- */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-[24px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit User</DialogTitle>
            <p className="text-sm text-slate-500 font-medium">Perbarui informasi user</p>
          </DialogHeader>
          <div className="grid gap-6 py-2">
            <div className="grid gap-2">
              <Label className="font-bold text-slate-700">Nama Lengkap <span className="text-red-500">*</span></Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl bg-slate-50/50" />
            </div>
            <div className="grid gap-2">
              <Label className="font-bold text-slate-700">Email <span className="text-red-500">*</span></Label>
              <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-12 rounded-xl bg-slate-50/50" />
            </div>
            <div className="grid gap-2">
              <Label className="font-bold text-slate-700">Role <span className="text-red-500">*</span></Label>
              <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50/50"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="guru">Guru</SelectItem><SelectItem value="siswa">Siswa</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 border border-blue-100 text-blue-600 p-4 rounded-xl text-sm font-medium leading-relaxed">
              <span className="font-bold">Catatan:</span> Untuk mengubah password, silakan gunakan fitur reset password yang terpisah.
            </div>
            <div className="grid gap-2">
              <Label className="font-bold text-slate-700">Email Verification</Label>
              <Select value={formData.verifiedStatus} onValueChange={(val) => setFormData({...formData, verifiedStatus: val})}>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unverified">Unverified</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="h-12 px-8 rounded-xl font-bold text-slate-600 flex-1">Batal</Button>
            <Button onClick={handleSaveEdit} className="bg-[#06b6d4] hover:bg-[#0891b2] text-white h-12 px-8 rounded-xl font-bold flex-1 shadow-md">Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
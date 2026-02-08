"use client"

import { useEffect, useState } from "react"
import {
  Users, Plus, Search, Pencil, Trash2, User, Mail, CheckCircle2,
  Shield, Filter, Lock, ChevronLeft, ChevronRight, GraduationCap, Bell, LogOut
} from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

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

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "siswa",
    password: "",
    confirmPassword: "",
    verified: false
  })

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  // Ambil data profil dan users saat halaman dimuat
  useEffect(() => {
    fetch("/api/auth/me").then(res => res.json()).then(res => setUserData(res.user))
    fetchUsers() // FIX: Panggil fetchUsers, bukan fetchDudi
  }, [])

  // Fungsi Logout
  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) window.location.href = "/login"
  }

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("id", { ascending: true })
    
    if (!error) setUsers(data)
    setLoading(false)
  }

  const handleSaveAdd = async () => {
    if (formData.password !== formData.confirmPassword) return alert("Password tidak cocok!");

    try {
      const res = await fetch("/api/pengguna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
          verified: formData.verified
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setIsAddOpen(false);
        fetchUsers(); 
        resetForm();
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error("Error pendaftaran:", err);
    }
  };

  const handleSaveEdit = async () => {
    const { error } = await supabase
      .from("users")
      .update({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        email_verified_at: formData.verified ? (selectedUser.email_verified_at || new Date().toISOString()) : null
      })
      .eq("id", selectedUser.id)

    if (!error) {
      setIsEditOpen(false)
      fetchUsers()
    } else {
      alert(error.message)
    }
  }

  const handleDelete = async () => {
    const { error } = await supabase.from("users").delete().eq("id", selectedUser.id)
    if (!error) {
      setIsDeleteOpen(false)
      fetchUsers()
    }
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "siswa", password: "", confirmPassword: "", verified: false })
  }

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "all" || u.role?.toLowerCase() === roleFilter.toLowerCase()
    return matchSearch && matchRole
  })

  return (
    <>
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

          <div className="relative">
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-[#00A9D8] rounded-[14px] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <User size={26} strokeWidth={2.5} />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[17px] font-bold text-[#1E293B] leading-none">{userData?.name || "Admin Sistem"}</p>
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
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
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
                            <AvatarFallback>{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
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
                            setFormData({ ...formData, name: user.name, email: user.email, role: user.role, verified: !!user.email_verified_at });
                            setIsEditOpen(true);
                          }} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                            <Pencil size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(user); setIsDeleteOpen(true); }} className="text-slate-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 size={18} />
                          </Button>
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

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-[24px]">
          <DialogHeader><DialogTitle className="text-2xl font-bold">Tambah User Baru</DialogTitle></DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label className="font-semibold">Nama Lengkap *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Masukkan nama lengkap" className="h-12 rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label className="font-semibold">Email *</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="user@email.com" className="h-12 rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label className="font-semibold">Role *</Label>
              <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="guru">Guru</SelectItem><SelectItem value="siswa">Siswa</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-semibold">Password *</Label>
                <Input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="h-12 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label className="font-semibold">Konfirmasi Password *</Label>
                <Input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="h-12 rounded-xl" />
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-xl">
              <Checkbox id="verified" checked={formData.verified} onCheckedChange={(val) => setFormData({...formData, verified: !!val})} />
              <Label htmlFor="verified" className="font-medium text-slate-600 cursor-pointer">Verifikasi email secara otomatis?</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="h-12 px-8 rounded-xl">Batal</Button>
            <Button onClick={handleSaveAdd} className="bg-[#0EA5E9] hover:bg-[#0284C7] h-12 px-8 rounded-xl font-bold text-white">Simpan Data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-[24px]">
          <DialogHeader><DialogTitle className="text-2xl font-bold">Edit User</DialogTitle></DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl text-sm flex gap-3">
              <Lock size={20} className="shrink-0" />
              <p className="font-medium">Catatan: Untuk mengubah password, silakan gunakan fitur reset password yang terpisah.</p>
            </div>
            <div className="grid gap-2">
              <Label className="font-semibold">Nama Lengkap *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label className="font-semibold">Email *</Label>
              <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-12 rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label className="font-semibold">Role *</Label>
              <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="guru">Guru</SelectItem><SelectItem value="siswa">Siswa</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
              <Checkbox id="edit-verified" checked={formData.verified} onCheckedChange={(val) => setFormData({...formData, verified: !!val})} />
              <Label htmlFor="edit-verified" className="font-medium text-slate-600 cursor-pointer">Verified (Terverifikasi)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="h-12 px-8 rounded-xl">Batal</Button>
            <Button onClick={handleSaveEdit} className="bg-[#0EA5E9] hover:bg-[#0284C7] h-12 px-8 rounded-xl font-bold text-white">Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[24px]">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500"><Trash2 size={32} /></div>
            <DialogTitle className="text-center text-2xl font-bold">Konfirmasi Hapus</DialogTitle>
            <DialogDescription className="text-center text-base pt-3">Apakah Anda yakin ingin menghapus data user ini? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="h-12 px-8 rounded-xl">Batal</Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white h-12 px-8 rounded-xl font-bold">Ya, Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
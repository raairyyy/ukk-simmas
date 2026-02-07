"use client"

import { useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"
import {
  Users,
  Plus,
  Search,
  Pencil,
  Trash2,
  User,
  Mail,
  CheckCircle2,
  Shield,
  Filter,
  Lock,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from "lucide-react"
import { Card } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function UserManagement() {

    const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    verified: false,
  })
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  
useEffect(() => {
  fetchUsers()
}, [])

const fetchUsers = async () => {
  setLoading(true)

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetch users:", error)
  } else {
    setUsers(data || [])
  }

  setLoading(false)
}


  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setIsEditOpen(true)
  }

  const handleDelete = (user: any) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  const handleCreateUser = async () => {
  if (
    !formData.name ||
    !formData.email ||
    !formData.role ||
    !formData.password
  ) {
    alert("Semua field wajib diisi")
    return
  }

  if (formData.password !== formData.confirmPassword) {
    alert("Password tidak cocok")
    return
  }

  // INSERT ke tabel users
  const { error } = await supabase.from("users").insert([
    {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password, // ⚠ nanti kita bisa hash
      verified: formData.verified,
    },
  ])

  if (error) {
    alert(error.message)
  } else {
    alert("User berhasil ditambahkan")
    setIsAddOpen(false)
    fetchUsers()
    setFormData({
      name: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
      verified: false,
    })
  }
}

const handleUpdateUser = async () => {
  const { error } = await supabase
    .from("users")
    .update({
      name: selectedUser.name,
      email: selectedUser.email,
      role: selectedUser.role,
      verified: selectedUser.verified,
    })
    .eq("id", selectedUser.id)

  if (error) {
    alert(error.message)
  } else {
    alert("User berhasil diupdate")
    setIsEditOpen(false)
    fetchUsers()
  }
}

const confirmDeleteUser = async () => {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", selectedUser.id)

  if (error) {
    alert(error.message)
  } else {
    alert("User berhasil dihapus")
    setIsDeleteOpen(false)
    fetchUsers()
  }
}


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
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen User</h1>
          </div>

          {/* Card Container */}
          <Card className="border-none shadow-sm rounded-[20px] bg-white overflow-hidden min-h-[600px]">
            <div className="p-8 space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-transparent text-[#0EA5E9]">
                           <Users size={28} strokeWidth={2} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">Daftar User</h3>
                    </div>
                    
                    <Button 
                      onClick={() => setIsAddOpen(true)}
                      className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-xl px-6 h-12 font-bold text-base shadow-lg shadow-blue-200/50 transition-all hover:scale-105"
                    >
                        <Plus className="mr-2 h-5 w-5" strokeWidth={3} /> Tambah User
                    </Button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mt-2">
                    <div className="relative w-full sm:w-[450px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <Input 
                            placeholder="Cari nama, email, atau role..." 
                            className="pl-14 h-14 rounded-2xl border-slate-200 bg-white focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-base text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                    
                    <div className="flex items-center gap-6 w-full sm:w-auto justify-end">
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-slate-400"/>
                            <Select defaultValue="all">
                              <SelectTrigger className="w-[150px] h-10 border-none shadow-none text-slate-600 font-semibold text-base focus:ring-0">
                                <SelectValue placeholder="Semua Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Semua Role</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="guru">Guru</SelectItem>
                                <SelectItem value="siswa">Siswa</SelectItem>
                              </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                           <span className="text-base text-slate-600 font-medium">Tampilkan:</span>
                           <Select defaultValue="5">
                              <SelectTrigger className="w-[60px] h-10 border-none shadow-none text-slate-600 font-semibold text-base focus:ring-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                              </SelectContent>
                            </Select>
                            <span className="text-base text-slate-600 font-medium">entri</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden mt-4">
                    <Table>
                    <TableHeader>
                        <TableRow className="border-b border-slate-100 hover:bg-transparent">
                            <TableHead className="py-6 pl-0 font-bold text-slate-900 text-sm uppercase tracking-wide w-[250px]">User</TableHead>
                            <TableHead className="py-6 font-bold text-slate-900 text-sm uppercase tracking-wide w-[300px]">Email & Verifikasi</TableHead>
                            <TableHead className="py-6 text-center font-bold text-slate-900 text-sm uppercase tracking-wide">Role</TableHead>
                            <TableHead className="py-6 text-center font-bold text-slate-900 text-sm uppercase tracking-wide">Terdaftar</TableHead>
                            <TableHead className="py-6 text-center font-bold text-slate-900 text-sm uppercase tracking-wide pr-0">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Loading data...
                          </TableCell>
                        </TableRow>
                      ) : users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Tidak ada user
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.id} className="border-b border-slate-50">
                            
                            <TableCell className="pl-0 py-6">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 bg-[#0093E9] text-white">
                                  <AvatarFallback>
                                    {user.name
                                      ?.split(" ")
                                      .map((n: string) => n[0])
                                      .join("")
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-bold">{user.name}</p>
                                  <p className="text-xs text-slate-400">ID: {user.id}</p>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="py-6">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail size={16} /> {user.email}
                                </div>
                                {user.verified && (
                                  <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded">
                                    <CheckCircle2 size={12} className="text-green-600" />
                                    <span className="text-xs text-green-600 font-bold">
                                      Verified
                                    </span>
                                  </div>
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="text-center py-6">
                              <Badge className={`capitalize ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-600"
                                  : user.role === "guru"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-cyan-100 text-cyan-600"
                              }`}>
                                {user.role}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-center py-6">
                              {new Date(user.created_at).toLocaleDateString("id-ID")}
                            </TableCell>

                            <TableCell className="text-center py-6">
                              <div className="flex justify-center gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(user)}
                              >
                                <Pencil size={18} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(user)}
                              >
                                <Trash2 size={18} />
                              </Button>

                              </div>
                            </TableCell>

                          </TableRow>
                        ))
                      )}
                      </TableBody>

                    </Table>
                </div>

                {/* Footer Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4">
                    <p className="text-sm text-slate-500 font-medium pl-1">Menampilkan 1 sampai 5 dari 6 entri</p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600" disabled>
                            <ChevronLeft size={18} />
                        </Button>
                        <Button variant="default" size="icon" className="h-9 w-9 rounded-lg bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-sm shadow-md">
                            1
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 font-medium hover:text-slate-900">
                            2
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600">
                            <ChevronRight size={18} />
                        </Button>
                    </div>
                </div>

            </div>
          </Card>
        </div>

      {/* === MODAL TAMBAH USER === */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Tambah User Baru</DialogTitle>
            <DialogDescription className="text-base mt-1 text-slate-500">
              Masukkan informasi detail pengguna baru di sini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-base font-semibold text-slate-700">Nama Lengkap</Label>
<Input
  id="name"
  placeholder="Contoh: Ahmad Rizki"
  className="h-12 text-base rounded-xl border-slate-200"
  value={formData.name}
  onChange={(e) =>
    setFormData({ ...formData, name: e.target.value })
  }
/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-base font-semibold text-slate-700">Email</Label>
<Input
  id="email"
  type="email"
  placeholder="contoh@sekolah.sch.id"
  className="h-12 text-base rounded-xl border-slate-200"
  value={formData.email}
  onChange={(e) =>
    setFormData({ ...formData, email: e.target.value })
  }
/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-base font-semibold text-slate-700">Role</Label>
<Select
  onValueChange={(value) =>
    setFormData({ ...formData, role: value })
  }
>
  <SelectTrigger className="h-12 text-base rounded-xl border-slate-200 text-slate-600">
    <SelectValue placeholder="Pilih Role" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="admin">Admin</SelectItem>
    <SelectItem value="guru">Guru Pembimbing</SelectItem>
    <SelectItem value="siswa">Siswa</SelectItem>
  </SelectContent>
</Select>

            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="grid gap-2">
                 <Label htmlFor="password" className="text-base font-semibold text-slate-700">Password</Label>
<Input
  id="password"
  type="password"
  className="h-12 text-base rounded-xl border-slate-200"
  value={formData.password}
  onChange={(e) =>
    setFormData({ ...formData, password: e.target.value })
  }
/>
               </div>
               <div className="grid gap-2">
                 <Label htmlFor="conf-password" className="text-base font-semibold text-slate-700">Konfirmasi Password</Label>
<Input
  id="conf-password"
  type="password"
  className="h-12 text-base rounded-xl border-slate-200"
  value={formData.confirmPassword}
  onChange={(e) =>
    setFormData({ ...formData, confirmPassword: e.target.value })
  }
/>
               </div>
            </div>
            <div className="flex items-center space-x-3 mt-2">
<Checkbox
  id="verified"
  checked={formData.verified}
  onCheckedChange={(checked) =>
    setFormData({ ...formData, verified: !!checked })
  }
/>
                <Label htmlFor="verified" className="text-base font-medium text-slate-600 cursor-pointer">
                  Verifikasi email pengguna ini secara langsung?
                </Label>
            </div>
          </div>
          <DialogFooter className="gap-3 sm:gap-0">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="h-12 px-6 text-base rounded-xl font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 mr-3">Batal</Button>
            <Button
              onClick={handleCreateUser}
              className="bg-[#0EA5E9] hover:bg-[#0284C7] h-12 px-8 text-base rounded-xl font-bold shadow-md text-white"
            >
              Simpan Data
            </Button>
                      </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === MODAL EDIT USER === */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Data User</DialogTitle>
            <DialogDescription className="text-base mt-1 text-slate-500">
              Perbarui informasi pengguna ID: <span className="font-bold text-slate-900">{selectedUser?.id}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
             <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 px-4 py-4 rounded-xl text-sm flex gap-3 items-start">
                <Lock size={20} className="mt-0.5 shrink-0 text-yellow-600" />
                <p className="font-medium text-base text-yellow-700">Perubahan password tidak dapat dilakukan di sini. Gunakan fitur Reset Password terpisah.</p>
             </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-base font-semibold text-slate-700">Nama Lengkap</Label>
              <Input id="edit-name" defaultValue={selectedUser?.name} className="h-12 text-base rounded-xl border-slate-200" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email" className="text-base font-semibold text-slate-700">Email</Label>
              <Input id="edit-email" defaultValue={selectedUser?.email} className="h-12 text-base rounded-xl border-slate-200" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role" className="text-base font-semibold text-slate-700">Role</Label>
              <Select defaultValue={selectedUser?.role.toLowerCase()}>
                <SelectTrigger className="h-12 text-base rounded-xl border-slate-200 text-slate-600">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin" className="py-3">Admin</SelectItem>
                  <SelectItem value="guru" className="py-3">Guru</SelectItem>
                  <SelectItem value="siswa" className="py-3">Siswa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-3 mt-2">
                <Checkbox id="edit-verified" defaultChecked={selectedUser?.verified} className="h-5 w-5 rounded border-slate-300" />
                <Label htmlFor="edit-verified" className="text-base font-medium text-slate-600 cursor-pointer">Email Verified (Terverifikasi)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="h-12 px-6 text-base rounded-xl font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 mr-3">Batal</Button>
<Button
  onClick={handleUpdateUser}
  className="bg-[#0EA5E9] hover:bg-[#0284C7] h-12 px-8 text-base rounded-xl font-bold shadow-md text-white"
>
  Simpan Perubahan
</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === DIALOG KONFIRMASI HAPUS === */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500">
               <Trash2 size={32} />
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-slate-900">Hapus User Ini?</DialogTitle>
            <DialogDescription className="text-center text-base pt-3 text-slate-500 px-6">
              Apakah Anda yakin ingin menghapus user <b className="text-slate-900">{selectedUser?.name}</b>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="w-full sm:w-auto h-12 text-base px-8 rounded-xl font-semibold border-slate-200">Tidak, Batalkan</Button>
<Button
  onClick={confirmDeleteUser}
  className="bg-red-600 hover:bg-red-700 w-full sm:w-auto h-12 text-base px-8 rounded-xl font-bold shadow-md text-white"
>
  Ya, Hapus
</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
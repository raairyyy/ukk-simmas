"use client"
import { useEffect, useState } from "react"
import { User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function SiswaDashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    fetch("/api/auth/me").then(res => res.json()).then(data => setUserData(data.user))
  }, [])

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b h-[90px] px-10 flex items-center justify-between">
        <h2 className="font-bold text-xl">Dashboard Siswa</h2>
        <div className="relative">
          <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 cursor-pointer">
            <p className="font-bold text-slate-800">{userData?.name || "Siswa"}</p>
            <Avatar className="h-10 w-10 bg-blue-500 text-white">
              <AvatarFallback><User size={20} /></AvatarFallback>
            </Avatar>
          </div>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border p-2">
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-red-500 font-bold text-sm hover:bg-red-50 rounded-md">
                <LogOut size={16} /> Keluar
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="p-10">
         <h1 className="text-2xl font-bold">Selamat Datang, {userData?.name}!</h1>
      </main>
    </div>
  )
}
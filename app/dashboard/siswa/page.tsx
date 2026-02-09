"use client"

import { useEffect, useState } from "react"
import { User, LogOut, Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SharedHeader } from "@/components/shared-header"

export default function SiswaDashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUserData(data.user))
  }, [])

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Sesuai dengan desain SIMMAS */}
      <SharedHeader />

      {/* Konten Utama */}
      <main className="p-10 max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Selamat datang, {userData?.name || "..."}!
        </h1>
      </main>
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { Users, Building2, GraduationCap, BookOpen, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function GuruDashboard() {
  const [stats, setStats] = useState({ totalSiswa: 0, dudi: 0, aktif: 0, logbook: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fungsi untuk mengambil stats dari API atau langsung Supabase
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/guru/dashboard-stats") // Anda perlu buat API ini
        const data = await res.json()
        if (res.ok) setStats(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <>
      <header className="bg-white border-b border-slate-100 h-[90px] px-10 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="font-bold text-xl text-slate-800">Panel Guru</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">SMK Brantas Karangkates</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-base font-bold text-slate-800">Guru Pembimbing</p>
            <p className="text-sm text-slate-500 font-medium">Guru</p>
          </div>
          <Avatar className="h-12 w-12 bg-[#06b6d4] text-white ring-4 ring-slate-50">
            <AvatarFallback className="bg-[#06b6d4] text-white font-bold">
              <User size={24} />
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="p-10 max-w-[1680px] mx-auto space-y-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Guru</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          <StatCard title="Siswa Anda" value={stats.totalSiswa} desc="Siswa yang Anda bimbing" icon={<Users className="text-[#06b6d4]" />} />
          <StatCard title="DUDI Aktif" value={stats.dudi} desc="Mitra industri" icon={<Building2 className="text-[#06b6d4]" />} />
          {/* ... dst */}
        </div>
        {/* ... List magang terbaru */}
      </div>
    </>
  )
}

function StatCard({ title, value, desc, icon }: any) {
  return (
    <Card className="border-none shadow-sm rounded-[24px] bg-white">
      <CardContent className="p-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-4xl font-extrabold text-slate-800 mt-2">{value}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
        </div>
        <p className="text-xs text-slate-400 mt-4 font-medium">{desc}</p>
      </CardContent>
    </Card>
  )
}
"use client"

import { useEffect, useState } from "react"
import { 
  Users, Building2, GraduationCap, BookOpen, 
  PieChart as PieIcon, Phone, 
  CalendarDays
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SharedHeader } from "@/components/shared-header"

// Import Recharts & Shadcn Chart
import { Pie, PieChart, Label, Cell } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

export default function AdminDashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>({
    stats: { totalSiswa: 0, totalDudi: 0, siswaMagang: 0, logbookHariIni: 0 },
    magangTerbaru: [],
    logbookTerbaru: [],
    dudiAktif: [],
    guruChartData: [] 
  })

  // WARNA MANUAL (Agar pasti muncul walaupun CSS variable shadcn belum diset)
  const CHART_COLORS = [
    "#0EA5E9", // Biru (Sky-500)
    "#22c55e", // Hijau (Green-500)
    "#eab308", // Kuning (Yellow-500)
    "#f97316", // Oranye (Orange-500)
    "#ef4444", // Merah (Red-500)
    "#8b5cf6", // Ungu (Violet-500)
  ]

  useEffect(() => {
    fetch("/api/auth/me").then(res => res.json()).then(data => setUserData(data.user))

    fetch("/api/admin/dashboard")
      .then(res => res.json())
      .then(res => {
        if (!res.error) {
          // Format data & Assign Warna secara manual
          const chartDataWithColors = res.guruChartData.map((item: any, index: number) => ({
            ...item,
            // Gunakan warna dari array CHART_COLORS, loop jika data lebih dari 6
            fill: CHART_COLORS[index % CHART_COLORS.length], 
          }))
          
          setDashboardData({ ...res, guruChartData: chartDataWithColors })
        }
      })
  }, [])

  // Konfigurasi Chart Config untuk Tooltip & Legend
  const chartConfig = {
    visitors: { label: "Siswa" },
    ...dashboardData.guruChartData.reduce((acc: any, curr: any, index: number) => {
      acc[curr.name] = {
        label: curr.name,
        color: CHART_COLORS[index % CHART_COLORS.length], // Pakai warna yang sama
      }
      return acc
    }, {})
  } satisfies ChartConfig

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SharedHeader />

      <div className="p-10 max-w-[1680px] mx-auto space-y-10">
        <div>
          <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight">Dashboard Admin</h1>
          {userData && <p className="text-slate-500 mt-2 text-sm font-medium">Selamat datang kembali, {userData.name}!</p>}
        </div>
        
        {/* STATISTIK CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          <StatCard title="Total Siswa" value={dashboardData.stats.totalSiswa} desc="Seluruh siswa terdaftar" icon={<Users className="text-[#0EA5E9]" />} />
          <StatCard title="DUDI Partner" value={dashboardData.stats.totalDudi} desc="Perusahaan mitra" icon={<Building2 className="text-[#0EA5E9]" />} />
          <StatCard title="Siswa Magang" value={dashboardData.stats.siswaMagang} desc="Sedang aktif magang" icon={<GraduationCap className="text-[#0EA5E9]" />} />
          <StatCard title="Logbook Hari Ini" value={dashboardData.stats.logbookHariIni} desc="Laporan masuk hari ini" icon={<BookOpen className="text-[#0EA5E9]" />} />
        </div>

        {/* LAYOUT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* KOLOM KIRI (Chart, Magang, & Logbook) */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* 1. GRAFIK DONUT GURU */}
<Card className="border-none shadow-sm rounded-[20px] overflow-hidden bg-white flex flex-col">
    <CardHeader className="items-center pb-0 pt-6">
      <CardTitle className="flex items-center gap-3 text-[19px] font-bold text-slate-800">
        <PieIcon className="text-[#0EA5E9] w-6 h-6" strokeWidth={2.5} />
        Guru Pembimbing Teraktif
      </CardTitle>
      <p className="text-sm text-slate-400 font-medium">Top 5 Guru berdasarkan jumlah siswa</p>
    </CardHeader>
    <CardContent className="flex-1 pb-0">
      {dashboardData.guruChartData.length > 0 ? (
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={dashboardData.guruChartData}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={105}
              strokeWidth={4}
              paddingAngle={2}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-slate-800 text-3xl font-extrabold">
                          {/* GUNAKAN TOTAL DARI HASIL HITUNG CHART */}
                          {dashboardData.stats.totalSiswaBimbingan || dashboardData.stats.siswaMagang}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-slate-400 text-xs font-medium uppercase tracking-wide">
                          Total Siswa
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"/>
          </PieChart>
        </ChartContainer>
      ) : (
        <div className="h-[300px] flex flex-col items-center justify-center text-slate-400 gap-2">
          <PieIcon size={40} className="opacity-20" />
          <p className="italic text-sm">Belum ada data bimbingan.</p>
        </div>
      )}
    </CardContent>
  </Card>

            {/* 2. MAGANG TERBARU */}
            <Card className="border-none shadow-sm rounded-[20px] overflow-hidden bg-white">
              <CardHeader className="pb-4 pt-8 px-8 border-b border-slate-50 mb-4">
                <CardTitle className="flex items-center gap-3 text-[19px] font-bold text-slate-800">
                  <GraduationCap className="text-[#0EA5E9] w-6 h-6" strokeWidth={2.5} />
                  Magang Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 px-8 pb-8">
                {dashboardData.magangTerbaru.length > 0 ? (
                  dashboardData.magangTerbaru.map((m: any) => (
                    <MagangItem key={m.id} name={m.siswa?.nama} dudi={m.dudi?.nama_perusahaan} date={m.tanggal_mulai} status={m.status} />
                  ))
                ) : (
                  <p className="text-center text-slate-400 py-4">Belum ada data magang.</p>
                )}
              </CardContent>
            </Card>

            {/* 3. LOGBOOK TERBARU */}
            <Card className="border-none shadow-sm rounded-[20px] overflow-hidden bg-white">
              <CardHeader className="pb-4 pt-8 px-8 border-b border-slate-50 mb-4">
                <CardTitle className="flex items-center gap-3 text-[19px] font-bold text-slate-800">
                  <BookOpen className="text-[#65a30d] w-6 h-6" strokeWidth={2.5} />
                  Logbook Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 px-8 pb-8">
                {dashboardData.logbookTerbaru.length > 0 ? (
                  dashboardData.logbookTerbaru.map((l: any) => (
                    <LogbookItem 
                      key={l.id} 
                      title={l.kegiatan} 
                      date={formatDate(l.tanggal)} 
                      status={l.status_verifikasi} 
                      kendala={l.kendala}
                    />
                  ))
                ) : (
                  <p className="text-center text-slate-400 py-4">Belum ada logbook terbaru.</p>
                )}
              </CardContent>
            </Card>

          </div>

          {/* KOLOM KANAN: DUDI AKTIF */}
          <div className="xl:col-span-1 h-full">
            <Card className="border-none shadow-sm rounded-[20px] bg-white h-full">
              <CardHeader className="pb-6 pt-8 px-8 border-b border-slate-50 mb-4">
                <CardTitle className="flex items-center gap-3 text-[19px] font-bold text-slate-800">
                  <Building2 className="text-orange-500 w-6 h-6" strokeWidth={2.5} />
                  DUDI Aktif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 px-8 pb-8">
                {dashboardData.dudiAktif.map((d: any, idx: number) => (
                  <DudiItem key={idx} {...d} />
                ))}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}

// --- SUB KOMPONEN ---

function StatCard({ title, value, desc, icon }: any) {
  return (
    <Card className="border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-[20px] bg-white h-[160px] flex flex-col justify-center">
      <CardContent className="p-7">
        <div className="flex justify-between items-start mb-2">
            <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">{title}</p>
            <div className="bg-slate-50 p-2 rounded-xl text-slate-600">{icon}</div>
        </div>
        <h3 className="text-[36px] font-black text-slate-800 leading-none">{value}</h3>
        <p className="text-xs text-slate-400 font-medium mt-1">{desc}</p>
      </CardContent>
    </Card>
  )
}

function MagangItem({ name, dudi, date, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
          {name?.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm">{name}</h4>
          <p className="text-xs text-slate-500">{dudi}</p>
        </div>
      </div>
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">{status}</Badge>
    </div>
  )
}

function LogbookItem({ title, date, status, kendala }: any) {
  const statusStyles: any = { disetujui: "text-green-600 bg-green-100", menunggu: "text-yellow-600 bg-yellow-100", ditolak: "text-red-600 bg-red-100" };
  return (
    <div className="p-4 bg-white border border-slate-100 rounded-2xl">
      <div className="flex justify-between items-start gap-3">
         <div className="flex gap-4">
            <div className="w-10 h-10 bg-lime-100 text-lime-700 rounded-xl flex items-center justify-center"><BookOpen size={20}/></div>
            <div>
                <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{title}</h4>
                <div className="flex items-center gap-2 mt-1">
                     <CalendarDays size={12} className="text-slate-400"/>
                     <span className="text-[11px] text-slate-500">{date}</span>
                </div>
                {kendala && <p className="text-[10px] text-orange-500 mt-1 italic">Kendala: {kendala}</p>}
            </div>
         </div>
         <Badge className={`${statusStyles[status] || "bg-slate-100 text-slate-500"} border-none text-[10px] capitalize`}>{status || 'Pending'}</Badge>
      </div>
    </div>
  )
}

function DudiItem({ name, address, phone, count }: any) {
  return (
    <div className="relative group pl-4 border-l-2 border-slate-100 hover:border-blue-400 transition-all">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-slate-800 text-sm">{name}</h4>
        <Badge className="bg-amber-100 text-amber-700 border-none text-[10px]">{count} siswa</Badge>
      </div>
      <p className="text-xs text-slate-500 line-clamp-1">{address}</p>
      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Phone size={10}/> {phone}</p>
    </div>
  )
}

function formatDate(dateString: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
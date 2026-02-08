// app/dashboard/layout.tsx
import Sidebar from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      {/* Sidebar ini akan otomatis berubah isi menunya */}
      {/* tergantung URL yang sedang dibuka (admin/guru/siswa) */}
      <Sidebar />
      
      {/* Konten Utama */}
      <main className="flex-1 md:ml-[320px] min-w-0">
        {children}
      </main>
      
    </div>
  )
}
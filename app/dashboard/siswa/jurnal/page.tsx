"use client"

import { useEffect, useState } from "react"
import { 
  Plus, Search, Eye, Pencil, Trash2, 
  CheckCircle2, Clock, XCircle, 
  FileText, Calendar, Upload, Bell, LogOut, User, X, Info
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@supabase/supabase-js"
import { SharedHeader } from "@/components/shared-header"

export default function JurnalHarianPage() {
  const [jurnals, setJurnals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedJurnal, setSelectedJurnal] = useState<any>(null)
  
  // Toast State
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

    // Di dalam komponen JurnalHarianPage, tambahkan fungsi ini:
    const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kegiatan: "",
    kendala: "",
    file: null as any
  })

  useEffect(() => {
    fetch("/api/auth/me").then(res => res.json()).then(data => setUserData(data.user))
    fetchJurnal()
  }, [])

  const fetchJurnal = async () => {
    setLoading(true)
    const res = await fetch("/api/logbook")
    const data = await res.json()
    if (res.ok) setJurnals(data.data)
    setLoading(false)
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) window.location.href = "/login"
  }

  const handleSave = async () => {
    const res = await fetch("/api/logbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    if (res.ok) {
      setIsAddOpen(false)
      fetchJurnal()
      setToastMessage("Jurnal berhasil ditambahkan")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  try {
    setUploading(true);
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `docs/${fileName}`;

    // Proses upload ke Bucket 'logbook_docs'
    const { error: uploadError } = await supabase.storage
      .from('logbook_docs')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Simpan path ke state formData
    setFormData({ ...formData, file: filePath });
    setToastMessage("File berhasil diunggah");
    setShowToast(true);
  } catch (error: any) {
    alert("Gagal upload: " + error.message);
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* TOAST SUCCESS (Gambar 15) */}
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

      {/* HEADER (Gambar 12) */}
      <SharedHeader />

      {/* MAIN CONTENT */}
      <main className="p-10 max-w-[1600px] mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Jurnal Harian Magang</h1>
          <Button onClick={() => { resetForm(); setIsAddOpen(true); }} className="bg-[#00A9D8] hover:bg-[#0092ba] rounded-xl h-12 px-6 font-bold shadow-lg shadow-blue-100 transition-all hover:scale-105">
            <Plus className="mr-2 h-5 w-5" strokeWidth={3} /> Tambah Jurnal
          </Button>
        </div>

        {/* REMINDER JURNAL (Gambar 18) */}
        <div className="bg-[#FFF9E6] border border-[#FFD966] p-6 rounded-[24px] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FFB800]/10 text-[#FFB800] rounded-2xl">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Jangan Lupa Jurnal Hari Ini!</h4>
              <p className="text-sm text-slate-600">Anda belum membuat jurnal untuk hari ini. Dokumentasikan kegiatan magang Anda sekarang.</p>
            </div>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="bg-[#FFB800] hover:bg-[#E6A600] text-white font-bold rounded-xl px-6 transition-all hover:scale-105">Buat Sekarang</Button>
        </div>

        {/* STAT CARDS (Gambar 18) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Jurnal" value={jurnals.length} sub="Jurnal yang telah dibuat" icon={<FileText className="text-blue-500" />} />
          <StatCard title="Disetujui" value={jurnals.filter(j => j.status_verifikasi === 'disetujui').length} sub="Jurnal disetujui guru" icon={<CheckCircle2 className="text-green-500" />} />
          <StatCard title="Menunggu" value={jurnals.filter(j => j.status_verifikasi === 'menunggu').length} sub="Belum diverifikasi" icon={<Clock className="text-amber-500" />} />
          <StatCard title="Ditolak" value={jurnals.filter(j => j.status_verifikasi === 'ditolak').length} sub="Perlu diperbaiki" icon={<XCircle className="text-red-500" />} />
        </div>

        {/* RIWAYAT JURNAL (Gambar 18) */}
        <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Calendar className="text-[#00A9D8]" />
              <h3 className="text-xl font-bold text-slate-800">Riwayat Jurnal</h3>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                <Input placeholder="Cari kegiatan atau kendala..." className="pl-12 h-12 rounded-xl border-slate-200 focus:bg-white bg-slate-50/50" />
              </div>
              <Select><SelectTrigger className="w-[180px] h-12 rounded-xl"><SelectValue placeholder="Semua Status" /></SelectTrigger></Select>
              <Select><SelectTrigger className="w-[180px] h-12 rounded-xl"><SelectValue placeholder="Semua Bulan" /></SelectTrigger></Select>
            </div>

            <div className="space-y-4">
              {loading ? (
                <p className="text-center py-10 text-slate-400 font-medium">Memuat riwayat jurnal...</p>
              ) : jurnals.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed">
                   <p className="text-slate-400 font-bold">Belum ada jurnal yang tercatat.</p>
                </div>
              ) : jurnals.map((jurnal) => (
                <div key={jurnal.id} className="group border border-slate-100 rounded-3xl p-6 hover:bg-slate-50/50 transition-all flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-slate-500 min-w-[120px]">{new Date(jurnal.tanggal).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <Badge className={`px-3 py-1 rounded-lg font-bold border-none capitalize ${
                        jurnal.status_verifikasi === 'disetujui' ? 'bg-green-50 text-green-600' : 
                        jurnal.status_verifikasi === 'ditolak' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {jurnal.status_verifikasi}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kegiatan:</p>
                      <p className="text-slate-700 leading-relaxed font-medium">{jurnal.kegiatan}</p>
                    </div>
                    {jurnal.catatan_guru && (
                      <div className="bg-slate-100/50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-1">🚩 Feedback Guru:</p>
                        <p className="text-sm text-slate-600 italic font-medium">{jurnal.catatan_guru}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedJurnal(jurnal); setIsDetailOpen(true); }} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"><Eye size={20} /></Button>
                    {jurnal.status_verifikasi !== 'disetujui' && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedJurnal(jurnal); setIsEditOpen(true); }} className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl"><Pencil size={20} /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedJurnal(jurnal); setIsConfirmOpen(true); }} className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={20} /></Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </main>

      {/* MODAL TAMBAH JURNAL (Gambar 19) */}
{/* MODAL TAMBAH JURNAL DENGAN SCROLL AREA */}
<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
  {/* Tambahkan max-h dan overflow-y-auto di DialogContent */}
  <DialogContent className="max-w-3xl rounded-[32px] p-0 overflow-hidden border-none bg-white">
    
    {/* Header tetap diam di atas */}
    <div className="p-8 pb-4 border-b border-slate-50">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Tambah Jurnal Harian</DialogTitle>
        <p className="text-sm text-slate-500">Dokumentasikan kegiatan magang harian Anda</p>
      </DialogHeader>
    </div>

    {/* Area Konten yang bisa di-scroll (Tinggi maksimal 80% layar) */}
    <div className="p-8 pt-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
      
      {/* Box Panduan */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl space-y-1 mb-6 mt-2">
        <p className="text-sm font-bold text-blue-800 flex items-center gap-2"><Info size={16} /> Panduan Penulisan Jurnal</p>
        <ul className="text-[11px] text-blue-600 ml-6 list-disc space-y-0.5 font-medium">
          <li>Minimal 50 karakter untuk deskripsi kegiatan</li>
          <li>Sertakan kendala yang dihadapi (jika ada)</li>
          <li>Upload dokumentasi pendukung untuk memperkuat laporan</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Label className="font-bold text-slate-700">Tanggal <span className="text-red-500">*</span></Label>
          <Input type="date" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} className="rounded-xl h-12 bg-slate-50/50" />
        </div>
        <div className="space-y-2">
          <Label className="font-bold text-slate-400">Status</Label>
          <Input value="Menunggu Verifikasi" disabled className="rounded-xl h-12 bg-slate-100/50 text-slate-400 font-bold" />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center">
          <Label className="font-bold text-slate-700">Deskripsi Kegiatan <span className="text-red-500">*</span></Label>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${formData.kegiatan.length < 50 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>{formData.kegiatan.length}/50 minimum</span>
        </div>
        <Textarea 
          placeholder="Deskripsikan kegiatan Anda secara detail..." 
          value={formData.kegiatan}
          onChange={(e) => setFormData({...formData, kegiatan: e.target.value})}
          className="min-h-[150px] rounded-2xl resize-none p-4 bg-slate-50/50 border-slate-200 transition-all focus:bg-white focus:ring-2 focus:ring-blue-100" 
        />
      </div>

      {/* Input File dengan Logika Real-time */}
      <div className="space-y-2 mb-4">
        <Label className="font-bold text-slate-700">Dokumentasi Pendukung (Opsional)</Label>
        <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
          <input 
            type="file" 
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.doc,.docx,.jpg,.png"
          />
          <div className="bg-slate-100 size-14 rounded-2xl flex items-center justify-center mx-auto text-slate-400 group-hover:bg-blue-50 group-hover:text-[#00A9D8] transition-all mb-4">
            {uploading ? <Clock className="animate-spin" /> : <Upload size={28} />}
          </div>
          <p className="text-sm font-bold text-slate-700">
            {formData.file ? `✅ ${formData.file.split('/').pop()}` : "Klik atau seret file ke sini"}
          </p>
          <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (Maks 5MB)</p>
        </div>
      </div>
    </div>

    {/* Footer tetap diam di bawah */}
    <div className="p-8 pt-4 border-t border-slate-50 bg-white">
      <DialogFooter className="gap-3">
        <Button variant="outline" onClick={() => setIsAddOpen(false)} className="h-12 px-8 rounded-xl font-bold text-slate-600 flex-1">Batal</Button>
        <Button 
          onClick={handleSave} 
          disabled={formData.kegiatan.length < 50 || uploading}
          className={`h-12 px-10 rounded-xl font-bold transition-all flex-1 shadow-md ${
            formData.kegiatan.length >= 50 && !uploading
            ? "bg-[#00A9D8] text-white hover:bg-[#0092ba] shadow-blue-100" 
            : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          {uploading ? "Mengunggah..." : "Simpan Jurnal"}
        </Button>
      </DialogFooter>
    </div>

  </DialogContent>
</Dialog>

      {/* DETAIL MODAL (Gambar 20, 21, 22) */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
          {selectedJurnal && (
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-800">Detail Jurnal Harian</h2>
                  <p className="text-sm text-slate-400 font-medium">{new Date(selectedJurnal.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <Badge className={`px-4 py-1.5 rounded-xl font-bold border-none capitalize text-sm ${
                  selectedJurnal.status_verifikasi === 'disetujui' ? 'bg-green-100 text-green-600' : 
                  selectedJurnal.status_verifikasi === 'ditolak' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {selectedJurnal.status_verifikasi === 'menunggu' ? 'Belum Diverifikasi' : selectedJurnal.status_verifikasi}
                </Badge>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="size-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#00A9D8] border border-blue-50"><User size={28} /></div>
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{userData?.name || "Ahmad Rizki"}</p>
                    <p className="text-sm text-slate-400 font-medium tracking-wide">XII RPL 1 • Jurusan: Rekayasa Perangkat Lunak</p>
                  </div>
                </div>
              </div>

              <section className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><FileText size={14} /> Kegiatan Hari Ini</h4>
                <div className="p-5 border border-slate-100 rounded-2xl text-slate-700 leading-relaxed font-bold bg-white">
                  {selectedJurnal.kegiatan}
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Upload size={14} /> Dokumentasi</h4>
                <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-2xl border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-green-600 shadow-sm"><FileText size={18} /></div>
                    <p className="text-sm font-bold text-green-800 truncate max-w-[250px]">{selectedJurnal.file || "documento1.pdf"}</p>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-9 px-4 font-bold transition-all shadow-sm shadow-green-100 uppercase text-[10px]">Unduh</Button>
                </div>
              </section>

              <div className="flex pt-4 border-t border-slate-50">
                <Button onClick={() => setIsDetailOpen(false)} className="w-full h-12 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl transition-colors">Tutup Pratinjau</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE MODAL (Gambar 27) */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
           // Logika delete di sini
           setIsConfirmOpen(false);
           setToastMessage("Jurnal berhasil dihapus");
           setShowToast(true);
           setTimeout(() => setShowToast(false), 3000);
        }}
        title="Konfirmasi Hapus"
        description="Apakah Anda yakin ingin menghapus jurnal ini? Aksi ini tidak bisa dibatalkan."
        confirmText="Ya, Hapus"
        variant="danger"
      />
    </div>
  )
}

function StatCard({ title, value, sub, icon }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl bg-white p-6 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
        <p className="text-2xl font-black text-slate-800 leading-none">{value}</p>
      </div>
      <div>
        <h5 className="font-bold text-sm text-slate-500 mb-1">{title}</h5>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{sub}</p>
      </div>
    </Card>
  )
}

function resetForm() {
  // Fungsi dummy, bisa ditambahkan logika reset state form di sini
}
"use client"

import { X, AlertTriangle, RotateCcw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText: string
  variant: "danger" | "success"
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  variant
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[440px] rounded-[28px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-8">
          {/* Header & Icon */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-2xl ${variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {variant === 'danger' ? <Trash2 size={24} /> : <RotateCcw size={24} />}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h3>
          </div>

          {/* Description */}
          <p className="text-slate-500 text-[15px] font-medium leading-relaxed mb-8">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 h-12 rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50 transition-all"
            >
              Batal
            </Button>
            <Button 
              onClick={onConfirm}
              className={`flex-1 h-12 rounded-xl font-bold text-white transition-all shadow-lg ${
                variant === "danger" 
                ? "bg-[#EF4444] hover:bg-red-700 shadow-red-200" 
                : "bg-[#16A34A] hover:bg-green-700 shadow-green-200"
              }`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
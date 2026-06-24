import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface SlidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function SlidePanel({ open, onClose, title, children }: SlidePanelProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden animate-slide-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E0D8]">
          <h2 className="font-black uppercase text-[#16201C] tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F9F8F5] rounded-lg transition-colors">
            <X size={18} className="text-[#6B7280]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
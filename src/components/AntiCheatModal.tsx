import React from 'react';
import { AlertTriangle, ShieldX } from 'lucide-react';

interface AntiCheatModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  count: number;
}

export const AntiCheatModal: React.FC<AntiCheatModalProps> = ({ isOpen, onDismiss, count }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border-4 border-red-600 overflow-hidden transform scale-100 transition-all">
        {/* Retro Alert Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-3">
          <ShieldX className="w-8 h-8 text-yellow-300 animate-bounce" />
          <div>
            <h2 className="text-base font-bold font-retro tracking-wide text-yellow-200">
              PERINGATAN INTEGRITAS!
            </h2>
            <p className="text-xs text-red-100">Sistem Pengawasan Asesmen Online SMANDE</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div className="inline-flex p-3 bg-red-100 text-red-700 rounded-full mb-1">
            <AlertTriangle className="w-12 h-12" />
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-sm font-bold font-retro text-red-800 leading-relaxed uppercase">
              "KAMU MEMBUKA TAB LAIN INFO DARI GURU MUNAWAR ROIS, S.Pd."
            </p>
          </div>

          <div className="text-xs text-slate-600 space-y-1">
            <p>
              Aktivitas berpindah tab terdeteksi oleh sistem sebanyak{' '}
              <span className="font-bold text-red-600 font-mono text-sm">{count} kali</span>.
            </p>
            <p className="text-slate-500">
              Mohon selesaikan penjelajahan hukum dan pengisian kuis ini secara jujur, mandiri, dan berintegritas.
            </p>
          </div>

          <button
            onClick={onDismiss}
            className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-95 font-retro text-xs tracking-wider"
          >
            SAYA MENGERTI & KEMBALI KE GAME
          </button>
        </div>
      </div>
    </div>
  );
};

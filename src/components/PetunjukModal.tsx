import React from 'react';
import { HelpCircle, X, Gamepad2, ArrowRight, ShieldAlert, Award } from 'lucide-react';

interface PetunjukModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PetunjukModal: React.FC<PetunjukModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl border-4 border-sky-500 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-sky-500 text-white">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-6 h-6 text-yellow-300" />
            <div>
              <h2 className="text-lg font-bold font-retro tracking-wide">PETUNJUK PERMAINAN</h2>
              <p className="text-xs text-sky-100">Super Mario Pancasila: Jelajah Hukum Indonesia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-sky-600 transition-colors text-white"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-800 text-sm leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
              <h3 className="font-bold text-sky-900 mb-2 flex items-center gap-2">
                <span>💻 Kontrol Desktop / Laptop</span>
              </h3>
              <ul className="text-xs space-y-1.5 text-slate-700">
                <li>• <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono">←</kbd> / <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono">A</kbd> : Bergerak ke Kiri</li>
                <li>• <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono">→</kbd> / <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono">D</kbd> : Bergerak ke Kanan</li>
                <li>• <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono">↑</kbd> / <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono">Spasi</kbd> / <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono">W</kbd> : Melompat</li>
                <li>• <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono">Enter</kbd> : Konfirmasi Pilihan Kuis</li>
              </ul>
            </div>

            <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
              <h3 className="font-bold text-sky-900 mb-2 flex items-center gap-2">
                <span>📱 Kontrol Smartphone / Tablet</span>
              </h3>
              <p className="text-xs text-slate-700 leading-normal">
                Tersedia tombol virtual (On-Screen Touch D-Pad) di layar bagian bawah: Tombol Kiri, Kanan, dan Tombol Lompat untuk memainkan Mario dengan satu atau dua jempol.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3 items-start p-3 bg-amber-50 rounded-xl border border-amber-200">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-amber-950 font-retro font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
                ?
              </div>
              <div className="text-xs text-slate-700">
                <p className="font-bold text-amber-900 text-sm mb-1">Blok Pertanyaan (Question Block "?")</p>
                Lompat dan sundul dari bawah blok "?" untuk membuka soal kuis Pendidikan Pancasila. Setiap jawaban BENAR memberi +200 Skor & +100 Koin. Jika salah, terdapat pembahasan edukatif tanpa mengurangi nyawa agar siswa dapat terus belajar!
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-red-50 rounded-xl border border-red-200">
              <ShieldAlert className="w-8 h-8 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700">
                <p className="font-bold text-red-900 text-sm mb-1">Fitur Anti-Kecurangan (Integritas Asesmen)</p>
                Sistem akan mendeteksi secara otomatis jika siswa membuka tab lain atau berpindah jendela browser, disertai peringatan dari <strong>Guru Munawar Rois, S.Pd.</strong> Riwayat kepatuhan akan tercatat di lembar rekap nilai akhir.
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <Award className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700">
                <p className="font-bold text-emerald-900 text-sm mb-1">Tiang Bendera Merah Putih & Unduh Nilai</p>
                Setelah menyelesaikan semua rintangan dan menyundul soal di World 1, 2, dan 3, Mario akan melompat ke Tiang Bendera Merah Putih. Siswa dapat langsung mengunduh/mencetak Surat Rekap Nilai resmi lengkap dengan Logo SMAN 1 Mande dan deskripsi capaian pembelajaran!
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
          >
            Mengerti & Mulai Jelajah
          </button>
        </div>
      </div>
    </div>
  );
};

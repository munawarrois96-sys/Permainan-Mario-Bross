import React, { useState } from 'react';
import { GameResult } from '../types/game';
import {
  Award,
  Download,
  Copy,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  User,
  School,
  Clock,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';

interface ResultReportCardProps {
  result: GameResult;
  onRestart: () => void;
}

export const ResultReportCard: React.FC<ResultReportCardProps> = ({ result, onRestart }) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `================================================
LAPORAN ASESMEN SUMATIF PENDIDIKAN PANCASILA
SUPER MARIO PANCASILA: JELAJAH HUKUM INDONESIA
SMA NEGERI 1 MANDE - KELAS XI
================================================
Guru Pengampu : Munawar Rois, S.Pd.
Nama Siswa    : ${result.student.nama}
Kelas         : ${result.student.kelas}
Tanggal/Waktu : ${result.completedAt}

HASIL EVALUASI:
- Nilai Akhir    : ${result.finalGrade} / 100
- Predikat KKTP  : ${result.predicate}
- Skor Game      : ${result.score} poin
- Koin Terkumpul : ${result.coins} koin
- Jawaban Benar  : ${result.correctAnswers} dari ${result.totalQuestions} soal
- Integritas     : ${result.tabSwitchCount === 0 ? 'Tertib & Jujur (0 Pelanggaran Tab)' : `${result.tabSwitchCount} Kali Berpindah Tab`}

DESKRIPSI CAPAIAN PEMBELAJARAN (MODUL AJAR BAB 2):
${result.description}

Catatan Guru:
"TERIMAKASIH YANG SUDAH MENGISI QUIZ INI KALIAN LUAR BIASA"
================================================`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-4 sm:p-6">
      {/* Thank you banner as requested */}
      <div className="mb-6 p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 rounded-2xl shadow-xl text-white text-center border-4 border-yellow-300 no-print animate-in zoom-in-95 duration-300">
        <div className="inline-flex items-center justify-center p-2 bg-yellow-400 text-slate-950 rounded-full mb-2">
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>
        <h2 className="text-base sm:text-xl font-bold font-retro tracking-wide text-yellow-200 uppercase leading-snug">
          "TERIMAKASIH YANG SUDAH MENGISI QUIZ INI KALIAN LUAR BIASA"
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-medium">
          Apresiasi setinggi-tingginya dari <strong>Guru Munawar Rois, S.Pd.</strong> kepada siswa-siswi pembelajar SMANDE Hebat Bermartabat!
        </p>
      </div>

      {/* Action buttons (Print/Download and Copy) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh / Cetak PDF Hasil Nilai</span>
          </button>
          <button
            onClick={handleCopyText}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Teks Nilai'}</span>
          </button>
        </div>

        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Mainkan Lagi</span>
        </button>
      </div>

      {/* Printable Official Document / Report Slip */}
      <div className="print-card bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 p-6 sm:p-10">
        {/* Official Letterhead (KOP SURAT RESMI SMAN 1 MANDE) */}
        <div className="border-b-4 border-double border-slate-800 pb-5 mb-6 flex items-center justify-between gap-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-07-14_at_09.41.14__3__e6c1caac.jpeg"
              alt="Logo SMA Negeri 1 Mande"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center flex-1">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
              Pemerintah Daerah Provinsi Jawa Barat · Dinas Pendidikan
            </p>
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
              SMA NEGERI 1 MANDE
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-600">
              Jl. Bobojong No. 1, Kecamatan Mande, Kabupaten Cianjur, Jawa Barat
            </p>
            <div className="inline-block mt-2 px-3 py-1 bg-sky-100 text-sky-900 rounded font-bold text-xs">
              LEMBAR REKAPITULASI ASESMEN SUMATIF PENDIDIKAN PANCASILA KELAS XI
            </div>
          </div>
          <div className="w-20 hidden sm:flex flex-col items-center justify-center p-2 bg-slate-50 border rounded-lg text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Kurikulum</span>
            <span className="text-xs font-extrabold text-slate-800">Merdeka</span>
            <span className="text-[10px] text-sky-600 font-semibold">Fase F</span>
          </div>
        </div>

        {/* Assessment & Student Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
          <div className="space-y-2">
            <div className="flex">
              <span className="w-36 text-slate-500 font-medium">Mata Pelajaran</span>
              <span className="font-bold text-slate-900">: Pendidikan Pancasila</span>
            </div>
            <div className="flex">
              <span className="w-36 text-slate-500 font-medium">Materi Pembelajaran</span>
              <span className="font-semibold text-slate-900">: Bab 2: UUD NRI 1945 & Produk Hukum</span>
            </div>
            <div className="flex">
              <span className="w-36 text-slate-500 font-medium">Guru Pengampu</span>
              <span className="font-bold text-sky-900">: Munawar Rois, S.Pd.</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex">
              <span className="w-36 text-slate-500 font-medium">Nama Peserta Didik</span>
              <span className="font-extrabold text-slate-950 font-mono tracking-wide uppercase">
                : {result.student.nama}
              </span>
            </div>
            <div className="flex">
              <span className="w-36 text-slate-500 font-medium">Rombel / Kelas</span>
              <span className="font-bold text-slate-900">: {result.student.kelas}</span>
            </div>
            <div className="flex">
              <span className="w-36 text-slate-500 font-medium">Waktu Asesmen</span>
              <span className="font-medium text-slate-700">: {result.completedAt}</span>
            </div>
          </div>
        </div>

        {/* Score & Evaluation Dashboard Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-center">
          <div className="p-4 bg-sky-50 rounded-xl border-2 border-sky-300">
            <span className="text-[11px] font-bold text-sky-700 uppercase">Nilai Akhir</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-sky-900 font-mono mt-1">
              {result.finalGrade}
            </div>
            <span className="text-[11px] text-slate-500">Skala 100</span>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-300">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Ketercapaian (KKTP)</span>
            <div className="text-sm sm:text-base font-extrabold text-emerald-900 mt-2">
              {result.predicate}
            </div>
            <span className="text-[11px] text-emerald-600">Modul Ajar Bab 2</span>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border-2 border-amber-300">
            <span className="text-[11px] font-bold text-amber-700 uppercase">Akurasi Soal</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-mono mt-1">
              {result.correctAnswers}/{result.totalQuestions}
            </div>
            <span className="text-[11px] text-amber-700 font-semibold">
              {Math.round((result.correctAnswers / result.totalQuestions) * 100)}% Benar
            </span>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-300">
            <span className="text-[11px] font-bold text-purple-700 uppercase">Koin & Skor Mario</span>
            <div className="text-xl sm:text-2xl font-bold text-purple-900 font-mono mt-2">
              ★ {result.score}
            </div>
            <span className="text-[11px] text-purple-600">🪙 {result.coins} Koin</span>
          </div>
        </div>

        {/* Integrity & Tab Switch Audit Note */}
        <div className="mb-6 p-3 rounded-lg border flex items-center gap-3 text-xs bg-slate-50 border-slate-200">
          <ShieldCheck className={`w-5 h-5 shrink-0 ${result.tabSwitchCount === 0 ? 'text-emerald-600' : 'text-amber-600'}`} />
          <div>
            <span className="font-bold text-slate-800">Pemeriksaan Integritas Asesmen: </span>
            {result.tabSwitchCount === 0 ? (
              <span className="text-emerald-700 font-medium">
                Sangat Baik & Disiplin (0 riwayat perpindahan tab/jendela selama kuis berlangsung).
              </span>
            ) : (
              <span className="text-amber-800 font-medium">
                Tercatat sistem membuka tab lain sebanyak {result.tabSwitchCount} kali.
              </span>
            )}
          </div>
        </div>

        {/* Comprehensive Modul Ajar Learning Description */}
        <div className="mb-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Deskripsi Capaian Pembelajaran Sesuai Modul Ajar Kurikulum Merdeka</span>
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 text-justify">
            {result.description}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-2.5 rounded border border-slate-200">
              <span className="font-bold text-sky-800 block mb-1">Sub-Bab 1: Konstitusi UUD 1945</span>
              <span className="text-slate-600">Pemahaman sejarah perumusan, pengesahan, dan kedudukan UUD 1945 sebagai hukum dasar tertinggi.</span>
            </div>
            <div className="bg-white p-2.5 rounded border border-slate-200">
              <span className="font-bold text-sky-800 block mb-1">Sub-Bab 2: Hierarki Peraturan</span>
              <span className="text-slate-600">Penguasaan tata urutan UU 12/2011 jo UU 13/2022, asas hukum (Lex superior, specialis, posterior), serta Judicial Review MK & MA.</span>
            </div>
            <div className="bg-white p-2.5 rounded border border-slate-200">
              <span className="font-bold text-sky-800 block mb-1">Sub-Bab 3: Asas & Budaya Hukum</span>
              <span className="text-slate-600">Ketaatan hukum, partisipasi masyarakat bermakna (meaningful participation), serta implementasi karakter Pelajar Pancasila.</span>
            </div>
          </div>
        </div>

        {/* Signatures & Seal */}
        <div className="pt-6 border-t border-slate-300 flex justify-between items-end text-xs sm:text-sm">
          <div className="text-center w-48">
            <p className="text-slate-500 mb-1">Mengetahui,</p>
            <p className="font-bold text-slate-800">Orang Tua / Wali Siswa</p>
            <div className="h-16"></div>
            <p className="border-b border-slate-400 font-semibold">( ........................................ )</p>
          </div>

          <div className="text-center w-56">
            <p className="text-slate-500 mb-1">Mande, {result.completedAt.split(',')[0]}</p>
            <p className="font-bold text-slate-800">Guru Mata Pelajaran,</p>
            <div className="h-16 flex items-center justify-center">
              <div className="px-3 py-1 border-2 border-dashed border-sky-400 text-[10px] font-mono text-sky-700 rounded bg-sky-50">
                TERVERIFIKASI SISTEM ASESMEN SMANDE
              </div>
            </div>
            <p className="font-bold text-slate-900 underline">MUNAWAR ROIS, S.Pd.</p>
            <p className="text-[11px] text-slate-500">Guru Pendidikan Pancasila SMANDE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { GameResult } from '../types/game';
import { QUESTIONS } from '../data/questions';
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
  Check,
  FileDown
} from 'lucide-react';

interface ResultReportCardProps {
  result: GameResult;
  onRestart: () => void;
}

export const ResultReportCard: React.FC<ResultReportCardProps> = ({ result, onRestart }) => {
  const [copied, setCopied] = useState(false);
  const [downloadingWord, setDownloadingWord] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  // Export to Microsoft Word (.doc) natively supported by Word, WPS Office (HP & Komputer)
  const handleDownloadWord = () => {
    setDownloadingWord(true);

    const safeName = result.student.nama.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `REKAP_NILAI_PANCASILA_${safeName}_${result.student.kelas}.doc`;

    // Generate table rows of questions and student answers
    let rowsHtml = '';
    result.answers.forEach((ans, idx) => {
      const q = QUESTIONS.find((item) => item.id === ans.questionId);
      const isCorrect = ans.isCorrect;
      const chosenLetter = ans.selected >= 0 ? String.fromCharCode(65 + ans.selected) : '-';
      const keyLetter = q ? String.fromCharCode(65 + q.correctIndex) : '-';

      rowsHtml += `
        <tr style="background-color: ${idx % 2 === 0 ? '#f8fafc' : '#ffffff'};">
          <td style="text-align: center; font-weight: bold; padding: 6px;">${ans.questionId}</td>
          <td style="padding: 6px;">${ans.topic}</td>
          <td style="text-align: center; font-weight: bold; padding: 6px;">${chosenLetter}</td>
          <td style="text-align: center; font-weight: bold; padding: 6px; color: #0284c7;">${keyLetter}</td>
          <td style="text-align: center; font-weight: bold; padding: 6px; color: ${isCorrect ? '#16a34a' : '#dc2626'};">
            ${isCorrect ? 'BENAR (✓)' : 'SALAH (✗)'}
          </td>
        </tr>
      `;
    });

    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Laporan Asesmen Sumatif Pendidikan Pancasila Kelas XI - SMAN 1 Mande</title>
        <!--[if gte mso 9]>
        <xml>
        <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
        <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 11pt;
            color: #0f172a;
            line-height: 1.4;
            padding: 20px;
          }
          .kop-table {
            width: 100%;
            border-bottom: 3px double #0f172a;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .kop-text {
            text-align: center;
          }
          .title {
            font-size: 14pt;
            font-weight: bold;
            text-align: center;
            color: #0369a1;
            margin: 14px 0;
            text-transform: uppercase;
          }
          .meta-table, .score-table, .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
          }
          .meta-table td {
            padding: 5px 8px;
            font-size: 11pt;
          }
          .score-box {
            border: 2px solid #0284c7;
            background-color: #f0f9ff;
            padding: 12px;
            text-align: center;
            margin-bottom: 20px;
          }
          .score-num {
            font-size: 32pt;
            font-weight: bold;
            color: #0369a1;
            margin: 4px 0;
          }
          .data-table th {
            background-color: #0284c7;
            color: #ffffff;
            font-weight: bold;
            padding: 8px;
            text-align: center;
            border: 1px solid #cbd5e1;
            font-size: 10pt;
          }
          .data-table td {
            border: 1px solid #cbd5e1;
            padding: 6px 8px;
            font-size: 10pt;
          }
          .desc-box {
            background-color: #f8fafc;
            border-left: 4px solid #0284c7;
            padding: 12px 16px;
            margin-bottom: 20px;
            font-size: 10.5pt;
            text-align: justify;
          }
          .sig-table {
            width: 100%;
            margin-top: 30px;
          }
          .sig-table td {
            text-align: center;
            vertical-align: top;
            width: 50%;
          }
          .catatan-guru {
            background-color: #ecfdf5;
            border: 1px dashed #059669;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            color: #065f46;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <!-- KOP SURAT RESMI SMAN 1 MANDE -->
        <table class="kop-table" border="0">
          <tr>
            <td class="kop-text">
              <div style="font-size: 10pt; font-weight: bold; letter-spacing: 1px; color: #475569;">
                PEMERINTAH DAERAH PROVINSI JAWA BARAT &bull; DINAS PENDIDIKAN
              </div>
              <div style="font-size: 16pt; font-weight: bold; color: #0f172a; margin: 4px 0;">
                SMA NEGERI 1 MANDE
              </div>
              <div style="font-size: 9pt; color: #475569;">
                Jl. Bobojong No. 1, Kecamatan Mande, Kabupaten Cianjur, Jawa Barat
              </div>
            </td>
          </tr>
        </table>

        <div class="title">
          LEMBAR REKAPITULASI ASESMEN SUMATIF PENDIDIKAN PANCASILA<br>
          <span style="font-size: 11pt; color: #475569; font-weight: normal;">
            Game Edukatif: Super Mario Pancasila - Jelajah Hukum Indonesia (Fase F Kelas XI)
          </span>
        </div>

        <div class="catatan-guru">
          "TERIMAKASIH YANG SUDAH MENGISI QUIZ INI KALIAN LUAR BIASA"
        </div>

        <!-- IDENTITAS SISWA & MATA PELAJARAN -->
        <table class="meta-table" border="0">
          <tr>
            <td style="width: 25%; font-weight: bold;">Mata Pelajaran</td>
            <td style="width: 25%;">: Pendidikan Pancasila</td>
            <td style="width: 25%; font-weight: bold;">Nama Peserta Didik</td>
            <td style="width: 25%; font-weight: bold; color: #0369a1;">: ${result.student.nama}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Materi / Modul Ajar</td>
            <td>: Bab 2 (UUD 1945 & Produk Hukum)</td>
            <td style="font-weight: bold;">Kelas / Rombel</td>
            <td style="font-weight: bold;">: ${result.student.kelas}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Guru Pengampu</td>
            <td style="font-weight: bold;">: Munawar Rois, S.Pd.</td>
            <td style="font-weight: bold;">Waktu Asesmen</td>
            <td>: ${result.completedAt}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Integritas Ujian</td>
            <td colspan="3">: ${result.tabSwitchCount === 0 ? 'Tertib & Disiplin (0 kali buka tab lain)' : `${result.tabSwitchCount} kali membuka tab lain`}</td>
          </tr>
        </table>

        <!-- REKAPITULASI NILAI -->
        <div class="score-box">
          <div style="font-size: 11pt; font-weight: bold; text-transform: uppercase; color: #0369a1;">NILAI AKHIR ASESMEN (SKALA 100)</div>
          <div class="score-num">${result.finalGrade}</div>
          <div style="font-size: 12pt; font-weight: bold; color: #0f172a;">Kategori KKTP: ${result.predicate}</div>
          <div style="font-size: 10pt; color: #475569; margin-top: 4px;">
            Akurasi: ${result.correctAnswers} Benar dari ${result.totalQuestions} Soal (${Math.round((result.correctAnswers / result.totalQuestions) * 100)}%) &bull; Skor Mario: ${result.score} poin &bull; Koin: ${result.coins}
          </div>
        </div>

        <!-- DESKRIPSI CAPAIAN PEMBELAJARAN SESUAI MODUL AJAR KELAS XI -->
        <div style="font-weight: bold; font-size: 11pt; color: #0f172a; margin-bottom: 6px;">
          Deskripsi Capaian Pembelajaran (Kriteria Ketercapaian Tujuan Pembelajaran):
        </div>
        <div class="desc-box">
          ${result.description}
        </div>

        <!-- RINCIAN BUTIR SOAL 1 S.D 30 -->
        <div style="font-weight: bold; font-size: 11pt; color: #0f172a; margin: 16px 0 8px 0;">
          Rincian Jawaban Soal Kuis (30 Butir Soal):
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 8%;">No</th>
              <th style="width: 48%;">Materi Pembelajaran</th>
              <th style="width: 14%;">Jawaban Siswa</th>
              <th style="width: 14%;">Kunci Jawaban</th>
              <th style="width: 16%;">Hasil Evaluasi</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <!-- TANDA TANGAN DOKUMEN -->
        <table class="sig-table" border="0">
          <tr>
            <td>
              Mengetahui,<br>
              <strong>Orang Tua / Wali Siswa</strong>
              <br><br><br><br>
              ( .................................................... )
            </td>
            <td>
              Mande, ${result.completedAt.split(',')[0]}<br>
              Guru Mata Pelajaran Pendidikan Pancasila,
              <br><br><br><br>
              <strong><u>MUNAWAR ROIS, S.Pd.</u></strong><br>
              <span style="font-size: 9pt; color: #475569;">SMA Negeri 1 Mande</span>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadingWord(false), 1500);
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

      {/* Action buttons (Download Word, Print/PDF, and Copy) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <div className="flex flex-wrap items-center gap-2">
          {/* Unduh Word Button (.doc / .docx) */}
          <button
            onClick={handleDownloadWord}
            disabled={downloadingWord}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg border-2 border-blue-400 transition-all active:scale-95 cursor-pointer"
            title="Unduh file dokumen Word yang bisa dibuka di Handphone atau Komputer"
          >
            <FileDown className="w-4 h-4 text-yellow-300" />
            <span>{downloadingWord ? 'Menyiapkan File Word...' : 'Unduh Format Word (.doc)'}</span>
          </button>

          {/* Cetak / Simpan PDF */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>

          {/* Salin Teks */}
          <button
            onClick={handleCopyText}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
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

      {/* Device Compatibility Notice */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900 no-print">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Tips Unduh Nilai:</strong> File Word (<strong>.doc</strong>) tersimpan di folder Unduhan / Download dan dapat langsung dibuka di aplikasi Microsoft Word, Google Docs, atau WPS Office pada <strong>Handphone (Android/iOS)</strong> maupun <strong>Komputer/Laptop</strong>.
          </span>
        </div>
      </div>

      {/* Printable Official Document / Report Slip */}
      <div className="print-card bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 p-6 sm:p-10">
        {/* Official Letterhead */}
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

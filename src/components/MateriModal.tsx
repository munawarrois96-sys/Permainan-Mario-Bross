import React from 'react';
import { BookOpen, X, CheckCircle2, ShieldCheck, FileText, Scale } from 'lucide-react';

interface MateriModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MateriModal: React.FC<MateriModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl border-4 border-sky-500 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-sky-500 text-white">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-yellow-300" />
            <div>
              <h2 className="text-lg font-bold font-retro tracking-wide">RINGKASAN MATERI BAB 2</h2>
              <p className="text-xs text-sky-100">Pendidikan Pancasila Kelas XI - UUD NRI Tahun 1945 & Peraturan Perundang-Undangan</p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800 text-sm leading-relaxed">
          {/* Sub-Bab 1 */}
          <div className="bg-sky-50 rounded-xl p-5 border border-sky-200">
            <div className="flex items-center gap-2 mb-2 text-sky-900 font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-sky-600" />
              <span>1. Perumusan dan Periodesasi UUD NRI Tahun 1945</span>
            </div>
            <ul className="space-y-2 text-slate-700 pl-4 list-disc">
              <li>
                <strong>Perumusan Konstitusi:</strong> Dirumuskan oleh BPUPK pada Sidang Kedua (10–17 Juli 1945) dan disahkan secara resmi oleh PPKI pada tanggal <strong>18 Agustus 1945</strong>.
              </li>
              <li>
                <strong>Kedudukan UUD 1945:</strong> Sebagai hukum dasar tertulis tertinggi (<em>supreme law of the land</em>) dan menjadi tolok ukur (batu uji) bagi seluruh peraturan di bawahnya.
              </li>
              <li>
                <strong>Pembukaan UUD 1945:</strong> Memuat <em>Staatsfundamentalnorm</em> (dasar filosofis bangsa, tujuan negara, kedaulatan rakyat, dan dasar negara Pancasila di Alinea IV) yang tidak boleh diubah.
              </li>
              <li>
                <strong>Periodesasi Konstitusi:</strong> UUD 1945 (1945-1949) → Konstitusi RIS (1949-1950) → UUDS 1950 (1950-1959) → Dekrit Presiden 5 Juli 1959 (Kembali ke UUD 1945) → Amandemen UUD 1945 (1999–2002).
              </li>
            </ul>
          </div>

          {/* Sub-Bab 2 */}
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
            <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-base">
              <Scale className="w-5 h-5 text-amber-700" />
              <span>2. Hierarki Peraturan Perundang-Undangan (UU 12/2011 jo UU 13/2022)</span>
            </div>
            <p className="mb-2 font-medium text-slate-700">Urutan tata peraturan dari yang tertinggi hingga terendah (Pasal 7 ayat 1):</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-700">
              <li><strong>UUD Negara Republik Indonesia Tahun 1945</strong></li>
              <li><strong>Ketetapan Majelis Permusyawaratan Rakyat (TAP MPR)</strong> (yang dinyatakan masih berlaku menurut Tap MPR I/MPR/2003)</li>
              <li><strong>Undang-Undang (UU) / Peraturan Pemerintah Pengganti Undang-Undang (Perppu)</strong></li>
              <li><strong>Peraturan Pemerintah (PP)</strong> (ditetapkan Presiden untuk menjalankan UU)</li>
              <li><strong>Peraturan Presiden (Perpres)</strong></li>
              <li><strong>Peraturan Daerah Provinsi (Perda Prov)</strong> (DPRD Prov bersama Gubernur)</li>
              <li><strong>Peraturan Daerah Kabupaten/Kota (Perda Kab/Kota)</strong> (DPRD Kab/Kota bersama Bupati/Walikota)</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-amber-200 text-xs text-amber-950 space-y-1">
              <p><strong>Asas Hukum Utama:</strong></p>
              <p>• <em>Lex Superior derogat legi inferiori:</em> Peraturan yang lebih tinggi mengesampingkan peraturan yang lebih rendah.</p>
              <p>• <em>Lex Specialis derogat legi generali:</em> Peraturan khusus mengesampingkan peraturan umum.</p>
              <p>• <em>Lex Posterior derogat legi priori:</em> Peraturan baru mengesampingkan peraturan lama yang setingkat.</p>
              <p>• <strong>Judicial Review:</strong> Pengujian UU terhadap UUD dilakukan oleh <strong>Mahkamah Konstitusi (MK)</strong>; pengujian peraturan di bawah UU terhadap UU dilakukan oleh <strong>Mahkamah Agung (MA)</strong>.</p>
            </div>
          </div>

          {/* Sub-Bab 3 */}
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2 text-emerald-900 font-bold text-base">
              <FileText className="w-5 h-5 text-emerald-700" />
              <span>3. Asas Pembentukan Peraturan & Partisipasi Publik</span>
            </div>
            <ul className="space-y-2 text-slate-700 pl-4 list-disc">
              <li>
                <strong>Asas Pembentukan (Pasal 5 UU 12/2011):</strong> Kejelasan tujuan, kelembagaan/pejabat pembentuk yang tepat, kesesuaian antara jenis, hierarki, dan materi muatan, dapat dilaksanakan, kedayagunaan dan kehasilgunaan, kejelasan rumusan, serta keterbukaan.
              </li>
              <li>
                <strong>Meaningful Participation (Partisipasi Bermakna):</strong> Masyarakat berhak atas 3 hal: <em>Right to be heard</em> (didengar), <em>Right to be considered</em> (dipertimbangkan), dan <em>Right to be explained</em> (dijelaskan alasan persetujuan/penolakannya).
              </li>
              <li>
                <strong>Budaya Taat Hukum:</strong> Kepatuhan hukum diwujudkan dalam kesadaran internal warga negara (termasuk pelajar) untuk tertib norma sosial, hukum positif, dan peraturan sekolah demi kemaslahatan bersama.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
          >
            Tutup & Lanjutkan Game
          </button>
        </div>
      </div>
    </div>
  );
};

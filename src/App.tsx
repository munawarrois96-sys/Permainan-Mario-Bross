import React, { useState, useEffect, useCallback } from 'react';
import { QUESTIONS } from './data/questions';
import { Question, StudentProfile, GameResult, AnswerRecord } from './types/game';
import { soundManager } from './utils/audio';
import { MarioGameCanvas } from './components/MarioGameCanvas';
import { QuestionModal } from './components/QuestionModal';
import { AntiCheatModal } from './components/AntiCheatModal';
import { ResultReportCard } from './components/ResultReportCard';
import { MateriModal } from './components/MateriModal';
import { PetunjukModal } from './components/PetunjukModal';
import {
  Gamepad2,
  BookOpen,
  HelpCircle,
  Award,
  Volume2,
  VolumeX,
  Play,
  User,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ListOrdered,
  Layers
} from 'lucide-react';

export default function App() {
  // Navigation / Game Screen State
  const [screen, setScreen] = useState<'START' | 'PLAYING' | 'RESULT'>('START');

  // Mode: Platformer Mario vs Direct Quiz Mode
  const [playMode, setPlayMode] = useState<'PLATFORMER' | 'DIRECT_QUIZ'>('PLATFORMER');

  // Student Profile
  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('smande_mario_student');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      nama: '',
      kelas: 'XI-1',
      startedAt: Date.now(),
    };
  });

  // Current World (1, 2, or 3)
  const [currentWorld, setCurrentWorld] = useState<number>(1);

  // Score & Coins
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);

  // Question tracking
  const [answeredMap, setAnsweredMap] = useState<Map<number, { isCorrect: boolean; selected: number }>>(
    new Map()
  );
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

  // Anti-cheat tracking
  const [tabSwitchCount, setTabSwitchCount] = useState<number>(0);
  const [showAntiCheatModal, setShowAntiCheatModal] = useState<boolean>(false);

  // Modals
  const [showMateriModal, setShowMateriModal] = useState<boolean>(false);
  const [showPetunjukModal, setShowPetunjukModal] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(soundManager.isMuted());

  // Final evaluation result
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  // Save student to local storage
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseName = e.target.value.toUpperCase();
    setStudent((prev) => {
      const next = { ...prev, nama: uppercaseName };
      localStorage.setItem('smande_mario_student', JSON.stringify(next));
      return next;
    });
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStudent((prev) => {
      const next = { ...prev, kelas: val };
      localStorage.setItem('smande_mario_student', JSON.stringify(next));
      return next;
    });
  };

  // Anti-cheat tab switch listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && screen === 'PLAYING') {
        setTabSwitchCount((prev) => {
          const next = prev + 1;
          setShowAntiCheatModal(true);
          return next;
        });
      }
    };

    const handleWindowBlur = () => {
      if (screen === 'PLAYING') {
        setTabSwitchCount((prev) => {
          const next = prev + 1;
          setShowAntiCheatModal(true);
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [screen]);

  // Audio Toggle
  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsAudioMuted(muted);
    if (!muted && screen === 'PLAYING') {
      soundManager.startBgm();
    } else {
      soundManager.stopBgm();
    }
  };

  // Start Playing
  const handleStartGame = () => {
    if (!student.nama.trim()) {
      alert('Silakan masukkan Nama Lengkap Siswa terlebih dahulu.');
      return;
    }
    setStudent((prev) => ({ ...prev, startedAt: Date.now() }));
    setScreen('PLAYING');
    soundManager.playPowerup();
    if (!isAudioMuted) {
      soundManager.startBgm();
    }
  };

  // Handle Question Trigger from Canvas or Button
  const handleTriggerQuestion = useCallback((q: Question) => {
    setActiveQuestion(q);
  }, []);

  // Handle Question Answer Submission
  const handleAnswerSubmit = (isCorrect: boolean, selectedIdx: number) => {
    if (!activeQuestion) return;

    setAnsweredMap((prev) => {
      const next = new Map(prev);
      next.set(activeQuestion.id, { isCorrect, selected: selectedIdx });
      return next;
    });

    if (isCorrect) {
      setScore((s) => s + 200);
      setCoins((c) => c + 100);
    } else {
      setScore((s) => Math.max(0, s + 20));
    }

    setActiveQuestion(null);
  };

  // Calculate final grade & evaluation based on Modul Ajar Kelas XI
  const calculateResult = useCallback((): GameResult => {
    let correctCount = 0;
    const answerRecords: AnswerRecord[] = [];

    QUESTIONS.forEach((q) => {
      const rec = answeredMap.get(q.id);
      if (rec && rec.isCorrect) {
        correctCount++;
        answerRecords.push({
          questionId: q.id,
          selected: rec.selected,
          isCorrect: true,
          topic: q.topic,
        });
      } else {
        answerRecords.push({
          questionId: q.id,
          selected: rec ? rec.selected : -1,
          isCorrect: false,
          topic: q.topic,
        });
      }
    });

    const finalGrade = Math.round((correctCount / QUESTIONS.length) * 100);

    let predicate: 'Sangat Mahir' | 'Mahir' | 'Cakap' | 'Perlu Bimbingan' = 'Perlu Bimbingan';
    let description = '';

    if (finalGrade >= 90) {
      predicate = 'Sangat Mahir';
      description = `Peserta didik menunjukkan penguasaan materi yang sangat istimewa (kategori Sangat Mahir). Mampu menganalisis sejarah dan kedudukan UUD NRI 1945 sebagai hukum dasar tertinggi, menguasai hierarki perundang-undangan (UU 12/2011 jo UU 13/2022), memahami asas perundang-undangan (Lex Superior, Lex Specialis, Lex Posterior), kewenangan pengujian norma (Judicial Review MK & MA), serta menginternalisasi budaya sadar hukum Profil Pelajar Pancasila secara prima.`;
    } else if (finalGrade >= 80) {
      predicate = 'Mahir';
      description = `Peserta didik mencapai kriteria ketercapaian tujuan pembelajaran dengan sangat baik (kategori Mahir). Memiliki pemahaman yang kokoh tentang hakikat konstitusi UUD 1945, tata urutan peraturan perundang-undangan, dan proses pembentukan produk hukum di Indonesia. Disarankan untuk terus memperluas studi kasus terkait partisipasi bermakna (meaningful participation) dalam perumusan undang-undang.`;
    } else if (finalGrade >= 70) {
      predicate = 'Cakap';
      description = `Peserta didik telah memenuhi kriteria ketuntasan minimal tujuan pembelajaran modul ajar (kategori Cakap). Mampu mengidentifikasi hierarki peraturan perundang-undangan dan kedudukan UUD 1945, namun masih memerlukan penguatan pada materi muatan peraturan perundang-undangan di tingkat daerah serta pembedaan ranah uji materil di Mahkamah Konstitusi vs Mahkamah Agung.`;
    } else {
      predicate = 'Perlu Bimbingan';
      description = `Peserta didik belum mencapai kriteria ketuntasan tujuan pembelajaran secara optimal (kategori Perlu Bimbingan). Disarankan untuk mengikuti sesi remedial bersama Guru Munawar Rois, S.Pd., dengan fokus penguatan pada sejarah perumusan UUD 1945, tata urutan hierarki 7 jenis peraturan perundang-undangan, serta asas-asas hukum nasional.`;
    }

    const timeSpent = Math.max(10, Math.floor((Date.now() - student.startedAt) / 1000));
    const nowStr = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      student,
      score,
      coins,
      correctAnswers: correctCount,
      totalQuestions: QUESTIONS.length,
      finalGrade,
      predicate,
      description,
      tabSwitchCount,
      completedAt: nowStr,
      timeSpentSeconds: timeSpent,
      answers: answerRecords,
    };
  }, [answeredMap, score, coins, student, tabSwitchCount]);

  // Finish Game
  const handleFinishGame = () => {
    soundManager.stopBgm();
    const res = calculateResult();
    setGameResult(res);
    setScreen('RESULT');
  };

  // Restart
  const handleRestart = () => {
    setAnsweredMap(new Map());
    setScore(0);
    setCoins(0);
    setCurrentWorld(1);
    setTabSwitchCount(0);
    setGameResult(null);
    setScreen('PLAYING');
    soundManager.startBgm();
  };

  const answeredQuestionIds = new Set(Array.from(answeredMap.keys()));

  // Active World Questions
  const currentWorldQuestions = QUESTIONS.filter((q) => q.world === currentWorld);

  // Find next unanswered question
  const nextUnanswered = currentWorldQuestions.find((q) => !answeredQuestionIds.has(q.id)) || currentWorldQuestions[0];

  return (
    <div className="min-h-screen bg-sky-400 text-slate-900 flex flex-col justify-between selection:bg-yellow-400 selection:text-slate-950 font-sans">
      {/* 1. RUNNING TEXT MARQUEE BANNER */}
      <div className="w-full bg-slate-950 text-yellow-300 py-2 px-4 overflow-hidden border-b-2 border-yellow-400 no-print shadow-md">
        <div className="flex items-center">
          <span className="font-retro text-[10px] sm:text-xs bg-yellow-400 text-slate-950 px-2 py-0.5 rounded mr-3 shrink-0 uppercase font-bold tracking-wider">
            INFO SMANDE
          </span>
          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="animate-marquee font-retro text-[11px] sm:text-xs text-yellow-300 tracking-wide font-medium">
              SELAMAT DATANG PARA PEMBELAJAR SMANDE HEBAT BERMARTABAT DARI GURU MUNAWAR ROIS, S.Pd. &nbsp;&nbsp;&nbsp;★&nbsp;&nbsp;&nbsp; SELAMAT DATANG PARA PEMBELAJAR SMANDE HEBAT BERMARTABAT DARI GURU MUNAWAR ROIS, S.Pd.
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOP NAVIGATION HEADER */}
      <header className="bg-sky-500/95 backdrop-blur-md text-white border-b-4 border-sky-600 px-4 sm:px-8 py-3 no-print shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-white p-1 shadow-md border-2 border-yellow-300 shrink-0">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-07-14_at_09.41.14__3__e6c1caac.jpeg"
                alt="Logo SMA Negeri 1 Mande"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-retro text-xs sm:text-sm text-yellow-300 tracking-wider">
                  SUPER MARIO PANCASILA
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-sky-100 font-medium">
                SMA Negeri 1 Mande · Guru Munawar Rois, S.Pd.
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowMateriModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden sm:inline">Daftar Materi</span>
            </button>
            <button
              onClick={() => setShowPetunjukModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden sm:inline">Petunjuk</span>
            </button>

            {screen === 'PLAYING' && (
              <button
                onClick={handleFinishGame}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-lg text-xs font-retro shadow-xs transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Lihat Nilai</span>
              </button>
            )}

            <button
              onClick={toggleMute}
              className="p-2 bg-sky-700/80 hover:bg-sky-800 text-white rounded-lg transition-colors cursor-pointer"
              title={isAudioMuted ? 'Nyalakan Audio' : 'Matikan Audio'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4 text-yellow-300" />}
            </button>
          </nav>
        </div>
      </header>

      {/* 3. MAIN CONTENT BODY */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-6xl mx-auto">
        {/* ========================================================= */}
        {/* VIEW 1: START SCREEN / IDENTITY FORM */}
        {/* ========================================================= */}
        {screen === 'START' && (
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-yellow-400 p-6 sm:p-10 text-slate-900 animate-in fade-in duration-300 my-4">
            <div className="text-center space-y-3 mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-sky-100 rounded-3xl border-4 border-sky-400 shadow-inner p-2 mb-2">
                <svg viewBox="0 0 16 16" className="w-full h-full drop-shadow-sm">
                  <rect x="3" y="1" width="10" height="2" fill="#dc2626" />
                  <rect x="2" y="2" width="12" height="2" fill="#dc2626" />
                  <rect x="2" y="4" width="3" height="3" fill="#78350f" />
                  <rect x="5" y="4" width="7" height="4" fill="#fed7aa" />
                  <rect x="12" y="4" width="2" height="3" fill="#fed7aa" />
                  <rect x="9" y="5" width="1" height="2" fill="#000000" />
                  <rect x="7" y="7" width="6" height="2" fill="#000000" />
                  <rect x="3" y="9" width="10" height="3" fill="#dc2626" />
                  <rect x="4" y="11" width="8" height="4" fill="#2563eb" />
                  <rect x="5" y="12" width="2" height="1" fill="#facc15" />
                  <rect x="9" y="12" width="2" height="1" fill="#facc15" />
                </svg>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold font-retro text-sky-900 leading-snug tracking-tight">
                SUPER MARIO PANCASILA
              </h1>
              <p className="text-sm sm:text-base font-bold text-sky-600 font-retro tracking-wide">
                JELAJAH HUKUM INDONESIA
              </p>
              <p className="text-xs text-slate-600 max-w-lg mx-auto">
                Asesmen Interaktif Pendidikan Pancasila SMA/MA Kelas XI Bab 2: <em>UUD NRI Tahun 1945 dan Peraturan Perundang-Undangan</em>.
              </p>
            </div>

            {/* Student Registration Form */}
            <div className="bg-sky-50 rounded-2xl p-6 border-2 border-sky-200 space-y-4 mb-8">
              <h3 className="font-bold text-sky-900 text-sm flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-sky-600" />
                <span>Form Identitas Siswa Peserta Asesmen</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NAMA LENGKAP SISWA (OTOMATIS KAPITAL):
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={student.nama}
                    onChange={handleNameChange}
                    placeholder="CONTOH: AHMAD FAUZAN"
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 focus:border-sky-500 rounded-xl font-mono text-sm tracking-wide font-bold uppercase outline-hidden shadow-inner transition-colors"
                    required
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  *Nama akan otomatis disesuaikan menjadi huruf kapital sesuai format resmi.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  KELAS (DROPDOWN XI-1 S.D XI-10):
                </label>
                <select
                  value={student.kelas}
                  onChange={handleClassChange}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-300 focus:border-sky-500 rounded-xl text-sm font-bold text-slate-800 outline-hidden shadow-inner transition-colors cursor-pointer"
                >
                  <option value="XI-1">XI-1</option>
                  <option value="XI-2">XI-2</option>
                  <option value="XI-3">XI-3</option>
                  <option value="XI-4">XI-4</option>
                  <option value="XI-5">XI-5</option>
                  <option value="XI-6">XI-6</option>
                  <option value="XI-7">XI-7</option>
                  <option value="XI-8">XI-8</option>
                  <option value="XI-9">XI-9</option>
                  <option value="XI-10">XI-10</option>
                </select>
              </div>

              <div className="pt-2 border-t border-sky-200/60 flex items-center justify-between text-xs text-sky-800">
                <span className="font-semibold">Guru Pengampu:</span>
                <span className="font-bold">Munawar Rois, S.Pd.</span>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartGame}
              disabled={!student.nama.trim()}
              className="w-full py-4 px-6 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-slate-950 font-retro text-sm font-bold rounded-2xl shadow-xl transition-all transform active:scale-98 flex items-center justify-center gap-3 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>MULAI BERMAIN & JELAJAH</span>
            </button>

            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-600 font-medium">
              <button
                onClick={() => setShowPetunjukModal(true)}
                className="hover:text-sky-700 underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Petunjuk Game</span>
              </button>
              <span>·</span>
              <button
                onClick={() => setShowMateriModal(true)}
                className="hover:text-sky-700 underline flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ringkasan Materi Bab 2</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: ACTIVE GAME PLATFORMER & QUESTIONS */}
        {/* ========================================================= */}
        {screen === 'PLAYING' && (
          <div className="w-full flex flex-col items-center gap-4">
            {/* World Switcher & Info Bar */}
            <div className="w-full max-w-5xl flex flex-wrap items-center justify-between bg-white/95 backdrop-blur-xs p-3 rounded-2xl border-2 border-sky-600 shadow-md gap-3">
              <div className="flex items-center gap-2">
                <span className="font-retro text-[10px] sm:text-xs text-sky-900 px-2.5 py-1 bg-sky-100 rounded font-bold">
                  TAHAPAN:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentWorld(1)}
                    className={`px-3 py-1.5 rounded-xl font-retro text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                      currentWorld === 1
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    WORLD 1 (Soal 1-10)
                  </button>
                  <button
                    onClick={() => setCurrentWorld(2)}
                    className={`px-3 py-1.5 rounded-xl font-retro text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                      currentWorld === 2
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    WORLD 2 (Soal 11-20)
                  </button>
                  <button
                    onClick={() => setCurrentWorld(3)}
                    className={`px-3 py-1.5 rounded-xl font-retro text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                      currentWorld === 3
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    WORLD 3 (Soal 21-30)
                  </button>
                </div>
              </div>

              {/* Direct Quiz Trigger Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTriggerQuestion(nextUnanswered)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-xl text-xs font-retro shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>BUKA SOAL KUIS SEKARANG</span>
                </button>
              </div>
            </div>

            {/* Bilah Akses Cepat 10 Blok Soal (Direct Question Blocks Bar) */}
            <div className="w-full max-w-5xl bg-slate-900/90 text-white p-3 rounded-2xl border-2 border-yellow-400 shadow-md">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="font-retro text-[10px] text-yellow-300 flex items-center gap-1.5">
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>DAFTAR 10 SOAL WORLD {currentWorld} (KLIK UNTUK BUKA SOAL LANGSUNG):</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {currentWorldQuestions.filter((q) => answeredQuestionIds.has(q.id)).length}/10 Terjawab
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {currentWorldQuestions.map((q) => {
                  const isDone = answeredQuestionIds.has(q.id);
                  const isCorrect = answeredMap.get(q.id)?.isCorrect;

                  let blockClass = 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 border-yellow-300 shadow-xs';
                  let symbol = '?';

                  if (isDone) {
                    if (isCorrect) {
                      blockClass = 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400';
                      symbol = '✓';
                    } else {
                      blockClass = 'bg-red-600 hover:bg-red-500 text-white border-red-400';
                      symbol = '!';
                    }
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleTriggerQuestion(q)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 font-retro transition-transform active:scale-90 cursor-pointer ${blockClass}`}
                      title={`Soal No. ${q.id}: ${q.topic}`}
                    >
                      <span className="text-sm font-bold">{symbol}</span>
                      <span className="text-[9px] font-mono mt-0.5 font-bold">No.{q.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2D Canvas Side-Scroller Engine */}
            <MarioGameCanvas
              currentWorld={currentWorld}
              questions={QUESTIONS}
              answeredQuestions={answeredQuestionIds}
              onTriggerQuestion={handleTriggerQuestion}
              onFinishGame={handleFinishGame}
              score={score}
              coins={coins}
              onAddScore={(pts, coinPts) => {
                setScore((s) => s + pts);
                setCoins((c) => c + coinPts);
              }}
              isPaused={Boolean(activeQuestion)}
            />

            {/* Interactive World Navigation Tip */}
            <div className="w-full max-w-5xl flex flex-wrap items-center justify-between text-xs text-sky-950 font-medium px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span>
                <span>
                  World {currentWorld}: {currentWorld === 1 ? 'Perumusan UUD 1945 & Produk Hukum' : currentWorld === 2 ? 'Hierarki Perundang-Undangan' : 'Materi Muatan & Ketaatan Hukum'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {currentWorld < 3 ? (
                  <button
                    onClick={() => setCurrentWorld((w) => w + 1)}
                    className="flex items-center gap-1 font-bold text-sky-900 hover:underline cursor-pointer"
                  >
                    <span>Lanjut ke World {currentWorld + 1}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishGame}
                    className="flex items-center gap-1 font-bold text-amber-950 bg-yellow-400 px-3 py-1 rounded-lg hover:bg-yellow-300 cursor-pointer"
                  >
                    <span>Selesaikan & Terbitkan Laporan Nilai →</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: OFFICIAL RESULT / REPORT CARD & DOWNLOAD */}
        {/* ========================================================= */}
        {screen === 'RESULT' && gameResult && (
          <ResultReportCard result={gameResult} onRestart={handleRestart} />
        )}
      </main>

      {/* 4. MODALS & POP-UPS */}
      {/* Question Modal for Block '?' */}
      <QuestionModal
        question={activeQuestion}
        questionNumber={activeQuestion ? activeQuestion.id : 1}
        totalQuestions={QUESTIONS.length}
        onAnswer={handleAnswerSubmit}
        onClose={() => setActiveQuestion(null)}
      />

      {/* Anti-Cheat Warning Modal */}
      <AntiCheatModal
        isOpen={showAntiCheatModal}
        onDismiss={() => setShowAntiCheatModal(false)}
        count={tabSwitchCount}
      />

      {/* Educational Material Summary Modal */}
      <MateriModal isOpen={showMateriModal} onClose={() => setShowMateriModal(false)} />

      {/* Game Guides & Controls Modal */}
      <PetunjukModal isOpen={showPetunjukModal} onClose={() => setShowPetunjukModal(false)} />

      {/* 5. FOOTER */}
      <footer className="w-full bg-sky-600/90 text-white text-center py-3 px-4 text-xs no-print border-t border-sky-500">
        <p className="font-medium">
          © {new Date().getFullYear()} Super Mario Pancasila · SMA Negeri 1 Mande · Didesain oleh <strong>Guru Munawar Rois, S.Pd.</strong>
        </p>
      </footer>
    </div>
  );
}

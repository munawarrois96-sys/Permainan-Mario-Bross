import React, { useState, useEffect } from 'react';
import { Question } from '../types/game';
import { soundManager } from '../utils/audio';
import { CheckCircle2, XCircle, Sparkles, BookOpen, X } from 'lucide-react';

interface QuestionModalProps {
  question: Question | null;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean, selectedIdx: number) => void;
  onClose?: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Hook 1: Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setIsCorrect(false);
  }, [question]);

  const handleSelect = (idx: number) => {
    if (!question || hasSubmitted) return;
    setSelectedOption(idx);
    const correct = idx === question.correctIndex;
    setIsCorrect(correct);
    setHasSubmitted(true);

    if (correct) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  const handleContinue = () => {
    if (selectedOption !== null) {
      onAnswer(isCorrect, selectedOption);
    } else if (onClose) {
      onClose();
    }
  };

  // Hook 2: Keyboard shortcut support (MUST BE UNCONDITIONAL)
  useEffect(() => {
    if (!question) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasSubmitted) {
        if (['1', 'a', 'A'].includes(e.key)) handleSelect(0);
        else if (['2', 'b', 'B'].includes(e.key)) handleSelect(1);
        else if (['3', 'c', 'C'].includes(e.key)) handleSelect(2);
        else if (['4', 'd', 'D'].includes(e.key)) handleSelect(3);
        else if (['5', 'e', 'E'].includes(e.key)) handleSelect(4);
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          handleContinue();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, hasSubmitted, selectedOption, isCorrect]);

  // Early return AFTER ALL HOOKS
  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border-4 border-yellow-400 rounded-2xl shadow-[0_0_35px_rgba(250,204,21,0.5)] overflow-hidden flex flex-col text-white">
        {/* Retro Header Bar */}
        <div className="bg-sky-600 px-4 py-3 border-b-4 border-yellow-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 text-slate-950 font-retro font-bold text-xs flex items-center justify-center rounded-sm shadow-xs">
              ?
            </div>
            <div>
              <span className="font-retro text-xs sm:text-sm text-yellow-300">
                WORLD {question.world} · SOAL {questionNumber}/{totalQuestions}
              </span>
              <p className="text-[11px] text-sky-100 font-medium">{question.topic}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-retro text-yellow-200 bg-sky-800/80 px-2.5 py-1 rounded-sm border border-yellow-400/50 hidden sm:inline">
              BAB 2 KELAS XI
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-sky-700 text-sky-100 transition-colors cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Question Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Question Text */}
          <div className="bg-slate-800/95 p-4 sm:p-5 rounded-xl border border-slate-700 shadow-inner">
            <span className="text-[11px] font-mono text-yellow-400 uppercase tracking-wider block mb-1">
              Pertanyaan Pendidikan Pancasila:
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {question.options.map((opt, idx) => {
              let btnStyle = 'bg-slate-800 hover:bg-slate-700/90 border-slate-600 text-slate-200 hover:border-yellow-400/60';

              if (hasSubmitted) {
                if (idx === question.correctIndex) {
                  btnStyle = 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]';
                } else if (idx === selectedOption) {
                  btnStyle = 'bg-red-600 border-red-400 text-white';
                } else {
                  btnStyle = 'bg-slate-800/50 border-slate-700 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={hasSubmitted}
                  className={`w-full text-left p-3 sm:p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <span className="font-retro text-xs mt-0.5 shrink-0 px-2 py-1 rounded bg-black/40 border border-white/20 font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-xs sm:text-sm font-medium leading-snug">{opt.substring(3)}</span>
                  {hasSubmitted && idx === question.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-300 ml-auto shrink-0" />
                  )}
                  {hasSubmitted && idx === selectedOption && idx !== question.correctIndex && (
                    <XCircle className="w-5 h-5 text-red-300 ml-auto shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Card */}
          {hasSubmitted && (
            <div
              className={`p-4 rounded-xl border-2 animate-in fade-in zoom-in-95 duration-200 ${
                isCorrect ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100' : 'bg-red-950/80 border-amber-500 text-amber-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                {isCorrect ? (
                  <>
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="text-emerald-300 font-retro text-xs">JAWABAN BENAR! (+200 Skor, +100 Koin)</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5 text-amber-300" />
                    <span className="text-amber-300 font-retro text-xs">PEMBAHASAN RINGKAS EDUKASI:</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t-2 border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            {!hasSubmitted ? 'Pilih salah satu jawaban (A, B, C, D, atau E)' : 'Tekan Spasi / Enter untuk lanjut'}
          </span>
          {hasSubmitted ? (
            <button
              onClick={handleContinue}
              className="ml-auto px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-retro text-xs font-bold rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
            >
              LANJUTKAN JELAJAH →
            </button>
          ) : (
            <span className="text-xs text-yellow-300/80 font-mono">Ketuk salah satu pilihan di atas</span>
          )}
        </div>
      </div>
    </div>
  );
};

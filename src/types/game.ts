/**
 * Types and Interfaces for Super Mario Pancasila Game
 */

export interface StudentProfile {
  nama: string;
  kelas: string;
  startedAt: number;
}

export interface Question {
  id: number;
  world: number;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AnswerRecord {
  questionId: number;
  selected: number;
  isCorrect: boolean;
  topic: string;
}

export interface GameResult {
  student: StudentProfile;
  score: number;
  coins: number;
  correctAnswers: number;
  totalQuestions: number;
  finalGrade: number; // 0 - 100
  predicate: 'Sangat Mahir' | 'Mahir' | 'Cakap' | 'Perlu Bimbingan';
  description: string;
  tabSwitchCount: number;
  completedAt: string;
  timeSpentSeconds: number;
  answers: AnswerRecord[];
}

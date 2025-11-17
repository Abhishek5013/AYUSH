'use client';

import { Quiz, UserAnswers, QuizResult } from '@/types';

const QUIZ_STORAGE_PREFIX = 'quizwise_quiz_';
const ANSWERS_STORAGE_PREFIX = 'quizwise_answers_';
const RESULTS_STORAGE_KEY = 'quizwise_results';

const isClient = typeof window !== 'undefined';

// --- Quiz Data ---
export function saveQuiz(quiz: Quiz) {
  if (!isClient) return;
  localStorage.setItem(`${QUIZ_STORAGE_PREFIX}${quiz.quizId}`, JSON.stringify(quiz));
}

export function getQuiz(quizId: string): Quiz | null {
  if (!isClient) return null;
  const quizData = localStorage.getItem(`${QUIZ_STORAGE_PREFIX}${quizId}`);
  return quizData ? JSON.parse(quizData) : null;
}

// --- User Answers ---
export function saveUserAnswers(quizId: string, answers: UserAnswers) {
  if (!isClient) return;
  localStorage.setItem(`${ANSWERS_STORAGE_PREFIX}${quizId}`, JSON.stringify(answers));
}

export function getUserAnswers(quizId: string): UserAnswers | null {
  if (!isClient) return null;
  const answersData = localStorage.getItem(`${ANSWERS_STORAGE_PREFIX}${quizId}`);
  return answersData ? JSON.parse(answersData) : null;
}

// --- Quiz Results for Progress Tracking ---
export function saveQuizResult(result: QuizResult) {
  if (!isClient) return;
  const results = getQuizResults();
  // Avoid duplicate entries for the same quiz attempt
  const existingIndex = results.findIndex((r) => r.quizId === result.quizId);
  if (existingIndex > -1) {
    results[existingIndex] = result;
  } else {
    results.push(result);
  }
  localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
}

export function getQuizResults(): QuizResult[] {
  if (!isClient) return [];
  const resultsData = localStorage.getItem(RESULTS_STORAGE_KEY);
  return resultsData ? JSON.parse(resultsData) : [];
}

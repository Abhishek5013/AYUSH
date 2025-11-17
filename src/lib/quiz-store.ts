'use client';

import { Quiz, UserAnswers, QuizResult } from '@/types';

// Use a dynamic key for user-specific data, fallback for anonymous users
const getQuizStorageKey = (quizId: string, userId?: string) => 
  userId ? `quizwise_quiz_${userId}_${quizId}` : `quizwise_quiz_${quizId}`;

const getAnswersStorageKey = (quizId: string, userId?: string) => 
  userId ? `quizwise_answers_${userId}_${quizId}` : `quizwise_answers_${quizId}`;

const getResultsStorageKey = (userId?: string) => 
  userId ? `quizwise_results_${userId}` : 'quizwise_results';

const isClient = typeof window !== 'undefined';

// --- Quiz Data ---
export function saveQuiz(quiz: Quiz, userId?: string) {
  if (!isClient) return;
  const key = getQuizStorageKey(quiz.quizId, userId);
  localStorage.setItem(key, JSON.stringify(quiz));
}

export function getQuiz(quizId: string, userId?: string): Quiz | null {
  if (!isClient) return null;
  // Try user-specific key first, then fallback to generic key
  let key = getQuizStorageKey(quizId, userId);
  let quizData = localStorage.getItem(key);
  if (!quizData) {
    key = getQuizStorageKey(quizId); // Fallback for quizzes created before login
    quizData = localStorage.getItem(key);
  }
  return quizData ? JSON.parse(quizData) : null;
}

// --- User Answers ---
export function saveUserAnswers(quizId: string, answers: UserAnswers, userId?: string) {
  if (!isClient) return;
  const key = getAnswersStorageKey(quizId, userId);
  localStorage.setItem(key, JSON.stringify(answers));
}

export function getUserAnswers(quizId: string, userId?: string): UserAnswers | null {
  if (!isClient) return null;
  let key = getAnswersStorageKey(quizId, userId);
  let answersData = localStorage.getItem(key);
  if (!answersData) {
    key = getAnswersStorageKey(quizId);
    answersData = localStorage.getItem(key);
  }
  return answersData ? JSON.parse(answersData) : null;
}

// --- Quiz Results for Progress Tracking ---
export function saveQuizResult(result: QuizResult) {
  if (!isClient) return;
  const key = getResultsStorageKey(result.userId);
  const results = getQuizResults(result.userId);
  const existingIndex = results.findIndex((r) => r.quizId === result.quizId);
  if (existingIndex > -1) {
    results[existingIndex] = result;
  } else {
    results.push(result);
  }
  localStorage.setItem(key, JSON.stringify(results));
}

export function getQuizResults(userId?: string): QuizResult[] {
  if (!isClient) return [];
  // For "All Users", we need to scan local storage, otherwise get user-specific
  if (!userId) {
    const allResults: QuizResult[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('quizwise_results')) {
            const data = localStorage.getItem(key);
            if (data) {
                allResults.push(...JSON.parse(data));
            }
        }
    }
    // De-duplicate results in case of data migration
    const uniqueResults = allResults.reduce((acc, current) => {
        if (!acc.find((item) => item.quizId === current.quizId)) {
            acc.push(current);
        }
        return acc;
    }, [] as QuizResult[]);
    return uniqueResults;
  }

  const key = getResultsStorageKey(userId);
  const resultsData = localStorage.getItem(key);
  return resultsData ? JSON.parse(resultsData) : [];
}

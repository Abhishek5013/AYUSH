export interface Question {
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-the-blanks';
  answers: string[];
  correctAnswer: string;
}

export interface Quiz {
  quizId: string;
  topic: string;
  questions: Question[];
}

export interface UserAnswers {
  [questionIndex: number]: string;
}

export interface QuizResult {
  quizId: string;
  topic: string;
  score: number;
  totalQuestions: number;
  date: string;
  correctAnswers: Record<number, string>;
  userAnswers: UserAnswers;
}

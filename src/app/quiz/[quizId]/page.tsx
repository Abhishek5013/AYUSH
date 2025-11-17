import { QuizTaker } from '@/components/quiz/quiz-taker';

type QuizPageProps = {
  params: {
    quizId: string;
  };
};

export default function QuizPage({ params }: QuizPageProps) {
  return <QuizTaker quizId={params.quizId} />;
}

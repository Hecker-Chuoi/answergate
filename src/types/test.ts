
export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: AnswerOption[];
  correctOptionId: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  questions: Question[];
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string | null;
  isMarked: boolean;
}

export interface TestAttempt {
  test: Test;
  userAnswers: UserAnswer[];
  currentQuestionIndex: number;
  startTime: Date;
  endTime: Date | null;
  remainingTime: number; // in seconds
}

export interface TestResult {
  test: Test;
  userAnswers: UserAnswer[];
  score: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  completed: boolean;
}

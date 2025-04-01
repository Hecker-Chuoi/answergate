
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Question } from '@/services/testService';
import { CheckCircle2, BookmarkIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TestQuestionListProps {
  questions: Question[];
  userAnswers: Record<number, string>;
  markedQuestions: Set<number>;
  onAnswerChange: (questionId: number, answer: string) => void;
  onMarkQuestion: (questionId: number) => void;
  currentTest: { testName: string; subject: string };
}

const TestQuestionList: React.FC<TestQuestionListProps> = ({
  questions,
  userAnswers,
  markedQuestions,
  onAnswerChange,
  onMarkQuestion,
  currentTest
}) => {

  const handleAnswerSelect = (questionId: number, answerIndex: number, questionType: string) => {
    const question = questions.find(q => q.questionId === questionId);
    if (!question) return;

    const totalAnswers = question.answers.length;
    let currentAnswer = userAnswers[questionId] || '0'.repeat(totalAnswers);

    if (questionType === 'SINGLE_CHOICE') {
      // Single choice: chỉ lưu duy nhất answerIndex, chuyển đổi thành chuỗi nhị phân
      const updatedAnswer = '0'.repeat(totalAnswers).split('');
      updatedAnswer[answerIndex] = '1';
      onAnswerChange(questionId, updatedAnswer.join(''));
    } else {
      // Multiple choice: toggle đáp án
      const updatedAnswer = currentAnswer.split('');
      updatedAnswer[answerIndex] = updatedAnswer[answerIndex] === '1' ? '0' : '1';
      onAnswerChange(questionId, updatedAnswer.join(''));
    }
  };

  const isAnswerSelected = (questionId: number, answerIndex: number): boolean => {
    const answer = userAnswers[questionId] || '';
    return answer[answerIndex] === '1';
  };

  return (
    <div className="flex-1 overflow-y-auto pb-16">
      <div className="px-4 py-6 bg-gray-50 border-b sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center">
          {currentTest.testName} - {currentTest.subject}
        </h1>
      </div>

      <div className="container max-w-4xl mx-auto py-8 space-y-8">
        {questions.map((question, qIndex) => (
          <Card key={question.questionId} className="overflow-hidden" id={`question-${question.questionId}`}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium">Câu {qIndex + 1}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onMarkQuestion(question.questionId)}
                  className={cn(
                    "h-8 w-8",
                    markedQuestions.has(question.questionId) ? "text-yellow-500" : "text-gray-400"
                  )}
                >
                  <BookmarkIcon className="h-5 w-5" />
                </Button>
              </div>

              <div className="bg-gray-50 rounded-md p-4">
                {question.questionText}
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-2">
                  {question.questionType === 'SINGLE_CHOICE'
                    ? 'Chọn một đáp án đúng'
                    : 'Chọn một hoặc nhiều đáp án đúng'}
                </p>
                <div className="space-y-2">
                  {question.answers.map((answer, aIndex) => (
                    <div
                      key={answer.answerId}
                      className={cn(
                        "flex items-center p-3 rounded-md border cursor-pointer transition",
                        "hover:bg-gray-50",
                        isAnswerSelected(question.questionId, aIndex) ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      )}
                      onClick={() => handleAnswerSelect(question.questionId, aIndex, question.questionType)}
                    >
                      <div className={cn(
                        "mr-3 flex-shrink-0 h-5 w-5 flex items-center justify-center border",
                        question.questionType === 'SINGLE_CHOICE' ? "rounded-full" : "rounded-md",
                        isAnswerSelected(question.questionId, aIndex) 
                          ? "border-blue-500 bg-blue-500 text-white" 
                          : "border-gray-300"
                      )}>
                        {isAnswerSelected(question.questionId, aIndex) && 
                          <Check className={cn("h-3.5 w-3.5 text-white",
                            question.questionType === 'SINGLE_CHOICE' ? "scale-90" : ""
                          )} />
                        }
                      </div>
                      <span>{answer.answerText}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestQuestionList;

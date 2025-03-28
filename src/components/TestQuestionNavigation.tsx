
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { Question } from '@/services/testService';

interface TestQuestionNavigationProps {
  questions: Question[];
  currentQuestionIndex: number;
  onQuestionChange: (index: number) => void;
}

const TestQuestionNavigation: React.FC<TestQuestionNavigationProps> = ({
  questions,
  currentQuestionIndex,
  onQuestionChange
}) => {
  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 p-4">
      <h3 className="text-lg font-medium mb-4">Câu hỏi</h3>
      <div className="flex flex-col gap-4 overflow-y-auto">
        {questions.map((question, index) => {
          const hasCorrectAnswer = question.answers.some(answer => answer.isCorrect);
          const isCurrent = index === currentQuestionIndex;
          
          return (
            <Button
              key={index}
              variant={isCurrent ? "default" : "outline"}
              className={cn(
                "justify-start text-left h-auto py-2 px-3",
                hasCorrectAnswer && "border-green-500"
              )}
              onClick={() => onQuestionChange(index)}
            >
              <div className="flex items-start gap-2">
                <div className="min-w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 truncate">
                  <div className="text-sm truncate max-w-[200px]">{question.questionText}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    {question.questionType === 'SINGLE_CHOICE' ? 'Một đáp án' : 'Nhiều đáp án'}
                    {hasCorrectAnswer && (
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TestQuestionNavigation;

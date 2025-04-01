
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Question } from '@/services/testService';

interface TestNavigationSidebarProps {
  questions: Question[];
  userAnswers: Record<number, string>;
  markedQuestions: Set<number>;
  onNavigateToQuestion: (questionId: number) => void;
}

const TestNavigationSidebar: React.FC<TestNavigationSidebarProps> = ({
  questions,
  userAnswers,
  markedQuestions,
  onNavigateToQuestion,
}) => {
  const getQuestionStatus = (questionId: number) => {
    if (markedQuestions.has(questionId)) return 'marked';
    if (userAnswers[questionId]) return 'answered';
    return 'unanswered';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-auto p-4">
      <div className="mb-4">
        <h3 className="font-medium text-lg mb-2">Câu hỏi</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
            <span className="text-xs">Đã làm</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
            <span className="text-xs">Đánh dấu</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-gray-200 mr-1"></span>
            <span className="text-xs">Chưa làm</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => {
          const status = getQuestionStatus(question.questionId!);
          return (
            <Button
              key={question.questionId}
              size="sm"
              variant="outline"
              className={cn(
                "h-8 w-8 p-0",
                status === 'answered' && "bg-green-100 border-green-500 text-green-700 hover:bg-green-200",
                status === 'marked' && "bg-yellow-100 border-yellow-500 text-yellow-700 hover:bg-yellow-200",
                status === 'unanswered' && "bg-gray-100"
              )}
              onClick={() => onNavigateToQuestion(question.questionId!)}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TestNavigationSidebar;

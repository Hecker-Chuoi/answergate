
import React from 'react';
import { useTest } from '@/context/TestContext';
import { cn } from '@/lib/utils';
import { Bookmark } from 'lucide-react';

const QuestionNavigation = () => {
  const { currentTest, navigateToQuestion } = useTest();
  
  if (!currentTest) return null;
  
  const { userAnswers, currentQuestionIndex } = currentTest;
  const totalQuestions = currentTest.test.questions.length;
  
  // Calculate statistics
  const answeredCount = userAnswers.filter(a => a.selectedOptionId !== null).length;
  const markedCount = userAnswers.filter(a => a.isMarked).length;
  const remainingCount = totalQuestions - answeredCount;
  
  return (
    <div className="h-full flex flex-col bg-white/90 backdrop-blur-md border-l border-border/50 p-4 shadow-soft">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Question Navigator</h3>
        <div className="grid grid-cols-3 gap-4 text-sm mb-2">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold text-primary">{answeredCount}</span>
            <span className="text-muted-foreground text-xs">Answered</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold text-test-marked">{markedCount}</span>
            <span className="text-muted-foreground text-xs">Marked</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold text-test-unanswered">{remainingCount}</span>
            <span className="text-muted-foreground text-xs">Remaining</span>
          </div>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-5 gap-2">
          {userAnswers.map((answer, index) => {
            const isAnswered = answer.selectedOptionId !== null;
            const isMarked = answer.isMarked;
            const isCurrent = index === currentQuestionIndex;
            
            return (
              <div key={answer.questionId} className="relative">
                <button
                  className={cn(
                    "question-number",
                    isAnswered && "answered",
                    isCurrent && "current"
                  )}
                  onClick={() => navigateToQuestion(index)}
                  aria-label={`Go to question ${index + 1}`}
                >
                  {index + 1}
                </button>
                {isMarked && (
                  <Bookmark 
                    className="absolute -top-1 -right-1 w-3 h-3 text-test-marked fill-test-marked" 
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigation;


import React from 'react';
import { useTest } from '@/context/TestContext';
import AnswerOption from './AnswerOption';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Question, UserAnswer } from '@/types/test';
import MathJax from './MathJax';
import { Card } from '@/components/ui/card';

interface QuestionCardProps {
  questionNumber: number;
  question: Question;
  userAnswer: UserAnswer | undefined;
  onSelectOption: (optionId: string) => void;
}

const QuestionCard = ({ 
  questionNumber, 
  question, 
  userAnswer,
  onSelectOption 
}: QuestionCardProps) => {
  const { markQuestion } = useTest();
  
  if (!question || !userAnswer) return null;
  
  const isMarked = userAnswer.isMarked || false;
  
  const handleToggleMark = () => {
    markQuestion(question.id, !isMarked);
  };
  
  const handleSelectOption = (optionId: string) => {
    onSelectOption(optionId);
  };
  
  const letterMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
  const mathFormula = `Câu ${questionNumber}
    <div style="margin-top: 10px;">
      ${question.text}
    </div>`;

  return (
    <Card className="p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-gray-800">
          Câu {questionNumber}
        </h2>
        <button
          onClick={handleToggleMark}
          className={`p-2 rounded-full transition-colors duration-300 ${
            isMarked ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'
          }`}
          aria-label={isMarked ? "Bỏ đánh dấu câu hỏi" : "Đánh dấu câu hỏi để xem lại"}
        >
          {isMarked ? (
            <BookmarkCheck className="w-5 h-5" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <MathJax formula={mathFormula} />
      </div>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <AnswerOption
            key={option.id}
            id={option.id}
            text={option.text}
            isSelected={userAnswer?.selectedOptionId === option.id}
            onSelect={handleSelectOption}
            optionLetter={letterMap[index]}
          />
        ))}
      </div>
    </Card>
  );
};

export default QuestionCard;

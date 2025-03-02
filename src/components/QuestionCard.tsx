
import React from 'react';
import { useTest } from '@/context/TestContext';
import AnswerOption from './AnswerOption';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface QuestionCardProps {
  questionNumber: number;
}

const QuestionCard = ({ questionNumber }: QuestionCardProps) => {
  const { currentQuestion, answerQuestion, markQuestion, currentTest } = useTest();
  
  if (!currentQuestion || !currentTest) return null;
  
  const currentAnswer = currentTest.userAnswers.find(
    answer => answer.questionId === currentQuestion.id
  );
  
  const isMarked = currentAnswer?.isMarked || false;
  
  const handleToggleMark = () => {
    markQuestion(currentQuestion.id, !isMarked);
  };
  
  const handleSelectOption = (optionId: string) => {
    answerQuestion(currentQuestion.id, optionId);
  };
  
  const letterMap = ['A', 'B', 'C', 'D'];
  
  return (
    <div className="animate-slide-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-foreground">
          Question {questionNumber}
        </h2>
        <button
          onClick={handleToggleMark}
          className={`p-2 rounded-full transition-colors duration-300 ${
            isMarked ? 'text-test-marked' : 'text-muted-foreground hover:text-test-marked'
          }`}
          aria-label={isMarked ? "Unmark question" : "Mark question for review"}
        >
          {isMarked ? (
            <BookmarkCheck className="w-5 h-5" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>
      
      <div className="glass-panel rounded-xl p-6 mb-6">
        <p className="text-lg font-medium text-foreground mb-2">
          {currentQuestion.text}
        </p>
      </div>
      
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <AnswerOption
            key={option.id}
            id={option.id}
            text={option.text}
            isSelected={currentAnswer?.selectedOptionId === option.id}
            onSelect={handleSelectOption}
            optionLetter={letterMap[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;

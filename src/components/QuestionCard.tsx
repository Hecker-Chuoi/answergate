
import React from 'react';
import { useTest } from '@/context/TestContext';
import AnswerOption from './AnswerOption';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import MathJax from './MathJax';

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
  
  // Sample math formula for the first question
  const mathFormula = questionNumber === 1 ? 
    `Câu ${questionNumber}
    <div style="margin-top: 10px;">
      Cho hàm số $y = \\frac{x^2 - 2m(m+1)x + 2m^3 + m^2 + 1}{x-m}$ có đồ thị $(C_m)$ (m là tham số thực). Gọi A là điểm thỏa mãn vừa là điểm cực đại của $(C_m)$ ứng với một giá trị m vừa là điểm cực tiểu của $(C_m)$ ứng với giá trị khác của m. Giá trị của a để khoảng cách từ A đến đường thẳng $(d) : x - (a + 1)y + a = 0$ đạt giá trị lớn nhất là
    </div>` : 
    `Câu ${questionNumber}
    <div style="margin-top: 10px;">
      ${currentQuestion.text}
    </div>`;

  return (
    <div className="animate-slide-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-foreground">
          Câu {questionNumber}
        </h2>
        <button
          onClick={handleToggleMark}
          className={`p-2 rounded-full transition-colors duration-300 ${
            isMarked ? 'text-test-marked' : 'text-muted-foreground hover:text-test-marked'
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
      
      <div className="glass-panel rounded-xl p-6 mb-6">
        <MathJax formula={mathFormula} />
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

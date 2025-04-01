
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Question } from '@/services/testService';
import { CheckCircle, CheckCircle2, X, BookmarkIcon } from 'lucide-react';
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
    const answerId = questions.find(q => q.questionId === questionId)?.answers[answerIndex].answerId;
    if (!answerId) return;
    
    if (questionType === 'SINGLE_CHOICE') {
      // Single choice - just select this option
      onAnswerChange(questionId, String(answerId));
    } else {
      // Multiple choice - toggle the selection
      const currentAnswer = userAnswers[questionId] || '';
      const answerBinary = currentAnswer.split('');
      
      // Ensure the binary string is long enough
      while (answerBinary.length < questions.find(q => q.questionId === questionId)?.answers.length!) {
        answerBinary.push('0');
      }
      
      // Toggle the selected answer
      answerBinary[answerIndex] = answerBinary[answerIndex] === '1' ? '0' : '1';
      onAnswerChange(questionId, answerBinary.join(''));
    }
  };

  const isAnswerSelected = (questionId: number, answerIndex: number): boolean => {
    const answer = userAnswers[questionId];
    if (!answer) return false;
    
    const question = questions.find(q => q.questionId === questionId);
    if (!question) return false;
    
    if (question.questionType === 'SINGLE_CHOICE') {
      // For single choice, check if this answer's ID matches the selected one
      return String(question.answers[answerIndex].answerId) === answer;
    } else {
      // For multiple choice, check the binary representation
      return answer[answerIndex] === '1';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-16">
      <div className="px-4 py-6 bg-gray-50 border-b sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center">{currentTest.testName} - {currentTest.subject}</h1>
      </div>
      
      <div className="container max-w-4xl mx-auto py-8 space-y-8">
        {questions.map((question, qIndex) => (
          <Card key={question.questionId} className="overflow-hidden" id={`question-${question.questionId}`}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium">
                  Câu {qIndex + 1}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onMarkQuestion(question.questionId!)}
                  className={cn(
                    "h-8 w-8",
                    markedQuestions.has(question.questionId!) ? "text-yellow-500" : "text-gray-400"
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
                        "flex items-center p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50",
                        isAnswerSelected(question.questionId!, aIndex) && "border-primary bg-primary/5"
                      )}
                      onClick={() => handleAnswerSelect(question.questionId!, aIndex, question.questionType)}
                    >
                      <div className={cn(
                        "mr-3 flex-shrink-0 h-5 w-5 rounded-sm border",
                        question.questionType === 'SINGLE_CHOICE' ? "rounded-full" : "rounded-sm",
                        isAnswerSelected(question.questionId!, aIndex) 
                          ? "border-primary bg-primary text-white" 
                          : "border-gray-300"
                      )}>
                        {isAnswerSelected(question.questionId!, aIndex) && (
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        )}
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

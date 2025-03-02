
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Test, Question, UserAnswer, TestAttempt, TestResult } from '@/types/test';

interface TestContextType {
  currentTest: TestAttempt | null;
  testResult: TestResult | null;
  startTest: (test: Test) => void;
  endTest: () => void;
  answerQuestion: (questionId: string, optionId: string) => void;
  markQuestion: (questionId: string, isMarked: boolean) => void;
  navigateToQuestion: (index: number) => void;
  currentQuestion: Question | null;
  remainingTime: number;
  isTimeUp: boolean;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTest, setCurrentTest] = useState<TestAttempt | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
  
  // Timer effect to update remaining time
  useEffect(() => {
    if (!currentTest) return;
    
    const timer = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(timer);
        setIsTimeUp(true);
        endTest();
        return;
      }
      
      setRemainingTime(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentTest, remainingTime]);
  
  const startTest = (test: Test) => {
    const userAnswers: UserAnswer[] = test.questions.map(q => ({
      questionId: q.id,
      selectedOptionId: null,
      isMarked: false,
    }));
    
    const newTestAttempt: TestAttempt = {
      test,
      userAnswers,
      currentQuestionIndex: 0,
      startTime: new Date(),
      endTime: null,
      remainingTime: test.timeLimit * 60, // Convert minutes to seconds
    };
    
    setCurrentTest(newTestAttempt);
    setRemainingTime(test.timeLimit * 60);
    setIsTimeUp(false);
    setTestResult(null);
  };
  
  const endTest = () => {
    if (!currentTest) return;
    
    const { test, userAnswers, startTime } = currentTest;
    const endTime = new Date();
    
    // Calculate score
    let score = 0;
    test.questions.forEach((question) => {
      const userAnswer = userAnswers.find(a => a.questionId === question.id);
      if (userAnswer && userAnswer.selectedOptionId === question.correctOptionId) {
        score++;
      }
    });
    
    const timeTaken = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    const result: TestResult = {
      test,
      userAnswers,
      score,
      totalQuestions: test.questions.length,
      timeTaken,
      completed: true,
    };
    
    setTestResult(result);
    setCurrentTest(prev => prev ? { ...prev, endTime } : null);
  };
  
  const answerQuestion = (questionId: string, optionId: string) => {
    if (!currentTest) return;
    
    const updatedAnswers = currentTest.userAnswers.map(answer => 
      answer.questionId === questionId 
        ? { ...answer, selectedOptionId: optionId } 
        : answer
    );
    
    setCurrentTest({
      ...currentTest,
      userAnswers: updatedAnswers,
    });
  };
  
  const markQuestion = (questionId: string, isMarked: boolean) => {
    if (!currentTest) return;
    
    const updatedAnswers = currentTest.userAnswers.map(answer => 
      answer.questionId === questionId 
        ? { ...answer, isMarked } 
        : answer
    );
    
    setCurrentTest({
      ...currentTest,
      userAnswers: updatedAnswers,
    });
  };
  
  const navigateToQuestion = (index: number) => {
    if (!currentTest) return;
    
    setCurrentTest({
      ...currentTest,
      currentQuestionIndex: index,
    });
  };
  
  const currentQuestion = currentTest 
    ? currentTest.test.questions[currentTest.currentQuestionIndex] 
    : null;
  
  const value = {
    currentTest,
    testResult,
    startTest,
    endTest,
    answerQuestion,
    markQuestion,
    navigateToQuestion,
    currentQuestion,
    remainingTime,
    isTimeUp,
  };
  
  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  );
};

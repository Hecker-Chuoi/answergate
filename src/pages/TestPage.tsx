
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '@/context/TestContext';
import QuestionCard from '@/components/QuestionCard';
import QuestionNavigation from '@/components/QuestionNavigation';
import TestTimer from '@/components/TestTimer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

const TestPage = () => {
  const navigate = useNavigate();
  const { currentTest, navigateToQuestion, endTest, isTimeUp } = useTest();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  useEffect(() => {
    // Redirect to homepage if no test is in progress
    if (!currentTest) {
      navigate('/');
    }
  }, [currentTest, navigate]);
  
  if (!currentTest) {
    return null;
  }
  
  const { currentQuestionIndex } = currentTest;
  const totalQuestions = currentTest.test.questions.length;
  const questionNumber = currentQuestionIndex + 1;
  
  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  };
  
  const goToNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  };
  
  const handleEndTest = () => {
    endTest();
    navigate('/results');
  };
  
  const confirmEndTest = () => {
    setShowConfirmDialog(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-medium text-foreground">
            {currentTest.test.title}
          </h1>
          <TestTimer />
        </div>
      </header>
      
      <div className="flex-grow flex">
        <main className="flex-grow p-6">
          <div className="max-w-3xl mx-auto">
            <QuestionCard questionNumber={questionNumber} />
            
            <div className="mt-8 flex items-center justify-between">
              <Button
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0}
                className="btn-nav btn-secondary"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              
              <Button
                onClick={confirmEndTest}
                variant="outline"
                className="btn-nav"
              >
                Submit Test
              </Button>
              
              <Button
                onClick={goToNext}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="btn-nav btn-primary"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </main>
        
        <aside className="hidden lg:block w-80 h-[calc(100vh-64px)] sticky top-16">
          <QuestionNavigation />
        </aside>
      </div>
      
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="glass-panel">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Submit Test?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit the test? You won't be able to change any answers after submission.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  You've answered {currentTest.userAnswers.filter(a => a.selectedOptionId !== null).length} out of {totalQuestions} questions.
                </p>
                {currentTest.userAnswers.filter(a => a.isMarked).length > 0 && (
                  <p className="text-sm text-amber-700 mt-1">
                    You have {currentTest.userAnswers.filter(a => a.isMarked).length} marked questions.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Continue Test
            </Button>
            <Button onClick={handleEndTest} className="btn-primary">
              Submit Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isTimeUp} onOpenChange={() => {}}>
        <DialogContent className="glass-panel">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Time's Up!</DialogTitle>
            <DialogDescription>
              Your time for this test has ended. Your answers have been automatically submitted.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button onClick={handleEndTest} className="btn-primary">
              View Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestPage;

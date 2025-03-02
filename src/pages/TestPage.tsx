
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '@/context/TestContext';
import QuestionCard from '@/components/QuestionCard';
import QuestionNavigation from '@/components/QuestionNavigation';
import TestTimer from '@/components/TestTimer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, AlertTriangle, ArrowLeft, Maximize, Search, ZoomIn, ZoomOut, List } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const TestPage = () => {
  const navigate = useNavigate();
  const { currentTest, navigateToQuestion, endTest, isTimeUp } = useTest();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [studentName, setStudentName] = useState('Nguyễn Hữu Tiến');
  
  useEffect(() => {
    // Redirect to homepage if no test is in progress
    if (!currentTest) {
      navigate('/');
    }
    
    // Get user info from session storage
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.username === 'student') {
          setStudentName('Nguyễn Hữu Tiến');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
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
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="ml-1">Quay lại</span>
            </Button>
            <h1 className="text-lg font-medium">
              Thí sinh: {studentName}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <TestTimer />
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ZoomIn className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ZoomOut className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <List className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
            
            <Button 
              onClick={confirmEndTest}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Nộp bài
            </Button>
          </div>
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
                Câu trước
              </Button>
              
              <Button
                onClick={goToNext}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="btn-nav btn-primary"
              >
                Câu sau
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </main>
        
        <aside className="w-80 h-[calc(100vh-64px)] sticky top-16 border-l border-gray-200">
          <QuestionNavigation />
        </aside>
      </div>
      
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="glass-panel">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Nộp bài?</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn nộp bài? Bạn sẽ không thể thay đổi câu trả lời sau khi nộp.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Bạn đã trả lời {currentTest.userAnswers.filter(a => a.selectedOptionId !== null).length} trên tổng số {totalQuestions} câu hỏi.
                </p>
                {currentTest.userAnswers.filter(a => a.isMarked).length > 0 && (
                  <p className="text-sm text-amber-700 mt-1">
                    Bạn có {currentTest.userAnswers.filter(a => a.isMarked).length} câu hỏi đã đánh dấu.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Tiếp tục làm bài
            </Button>
            <Button onClick={handleEndTest} className="btn-primary">
              Nộp bài
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isTimeUp} onOpenChange={() => {}}>
        <DialogContent className="glass-panel">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Hết giờ!</DialogTitle>
            <DialogDescription>
              Thời gian làm bài của bạn đã kết thúc. Bài làm của bạn đã được nộp tự động.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button onClick={handleEndTest} className="btn-primary">
              Xem kết quả
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestPage;

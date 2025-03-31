
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTest } from '@/context/TestContext';
import QuestionCard from '@/components/QuestionCard';
import TestTimer from '@/components/TestTimer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, ChevronRight, AlertTriangle, 
  ArrowLeft, X, Send
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const TestPage = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { 
    currentTest, navigateToQuestion, endTest, 
    isTimeUp, currentQuestion, answerQuestion
  } = useTest();
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
        if (user.username) {
          setStudentName(user.fullName || user.username);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [currentTest, navigate]);
  
  if (!currentTest) {
    return null;
  }
  
  const handleEndTest = () => {
    endTest();
    navigate(`/results/${sessionId}`);
  };
  
  const confirmEndTest = () => {
    setShowConfirmDialog(true);
  };
  
  const { totalQuestions, userAnswers } = currentTest;
  const answeredCount = userAnswers.filter(a => a.selectedOptionId !== null).length;
  const markedCount = userAnswers.filter(a => a.isMarked).length;
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header with test name and navigation */}
      <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Quay lại</span>
            </Button>
            <h1 className="text-lg font-medium truncate">
              {currentTest.test.title} - {currentTest.test.description}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <TestTimer />
            <Button 
              onClick={confirmEndTest}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Nộp bài
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content area with sidebar and question list */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question navigation sidebar */}
        <aside className="w-64 border-r border-gray-200 bg-white hidden md:block">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-700">Thí sinh: {studentName}</h2>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-blue-600">{answeredCount}</span>
                <span className="text-gray-500 text-xs">Đã trả lời</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-amber-500">{markedCount}</span>
                <span className="text-gray-500 text-xs">Đánh dấu</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-gray-600">{totalQuestions - answeredCount}</span>
                <span className="text-gray-500 text-xs">Còn lại</span>
              </div>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="p-4">
              <h3 className="font-medium mb-3 text-gray-700">Danh sách câu hỏi</h3>
              <div className="grid grid-cols-4 gap-2">
                {currentTest.userAnswers.map((answer, index) => {
                  const isAnswered = answer.selectedOptionId !== null;
                  const isMarked = answer.isMarked;
                  const isCurrent = currentQuestion?.id === currentTest.test.questions[index].id;
                  
                  return (
                    <Button
                      key={index}
                      size="sm"
                      variant={isCurrent ? "default" : isAnswered ? "outline" : "ghost"} 
                      className={`relative p-0 h-10 w-10 ${
                        isCurrent ? 'bg-blue-600' : isAnswered ? 'border-blue-300 text-blue-600' : ''
                      } ${isMarked ? 'ring-2 ring-amber-400' : ''}`}
                      onClick={() => navigateToQuestion(index)}
                    >
                      <span>{index + 1}</span>
                      {isMarked && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </aside>
        
        {/* Question display area */}
        <main className="flex-1 overflow-auto">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="container mx-auto px-4 py-6 max-w-4xl space-y-8">
              {currentTest.test.questions.map((question, index) => (
                <QuestionCard 
                  key={question.id}
                  questionNumber={index + 1} 
                  question={question}
                  userAnswer={currentTest.userAnswers.find(a => a.questionId === question.id)}
                  onSelectOption={(optionId) => answerQuestion(question.id, optionId)}
                />
              ))}
              
              <div className="flex justify-center py-6">
                <Button 
                  onClick={confirmEndTest}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Nộp bài
                </Button>
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>

      {/* Confirmation dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nộp bài?</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn nộp bài? Bạn sẽ không thể thay đổi câu trả lời sau khi nộp.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Bạn đã trả lời {answeredCount} trên tổng số {totalQuestions} câu hỏi.
                </p>
                {markedCount > 0 && (
                  <p className="text-sm text-amber-700 mt-1">
                    Bạn có {markedCount} câu hỏi đã đánh dấu.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              <X className="w-4 h-4 mr-2" />
              Tiếp tục làm bài
            </Button>
            <Button onClick={handleEndTest} className="bg-blue-600">
              <Send className="w-4 h-4 mr-2" />
              Nộp bài
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Time's up dialog */}
      <Dialog open={isTimeUp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hết giờ!</DialogTitle>
            <DialogDescription>
              Thời gian làm bài của bạn đã kết thúc. Bài làm của bạn đã được nộp tự động.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button onClick={handleEndTest} className="bg-blue-600">
              Xem kết quả
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestPage;

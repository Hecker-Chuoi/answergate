import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { takingTestService } from '@/services/takingTestService';
import { Question } from '@/services/testService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Send } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TestQuestionList from '@/components/TestQuestionList';
import TestNavigationSidebar from '@/components/TestNavigationSidebar';
import ExamTimer from '@/components/ExamTimer';

const TestPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set());
  const [testInfo, setTestInfo] = useState<{ testName: string; subject: string }>({ testName: '', subject: '' });
  const [endTime, setEndTime] = useState<Date | null>(null);

  const calculateEndTimeAndRemaining = (startTimeStr: string, timeLimit: string) => {
    const [datePart, timePart] = startTimeStr.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
  
    const startDate = new Date(year, month - 1, day, hour, minute);
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + Number(timeLimit));
  
    const now = new Date();
    const remainingTimeMs = endDate.getTime() - now.getTime();
    
    if (remainingTimeMs <= 0) {
      return {
        endTime: endDate, 
        remaining: [0, 0],
      };
    }
  
    const remainingMinutes = Math.floor(remainingTimeMs / (1000 * 60));
    const remainingHours = Math.floor(remainingMinutes / 60);
  
    return {
      endTime: endDate,
      remainings: [remainingHours, remainingMinutes % 60]
    };
  };

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const questionsData = await takingTestService.getQuestions(token, Number(sessionId));
        setQuestions(questionsData);

        const testData = await takingTestService.getTest(token, Number(sessionId));
        setTestInfo({
          testName: testData.testName,
          subject: testData.subject
        });

        const sessionData = await takingTestService.getSession(token, Number(sessionId));
        const timeLimit = sessionData.timeLimit;
        
        const {endTime, remainings} = calculateEndTimeAndRemaining(sessionData.startTime, timeLimit);
        setEndTime(endTime);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching test data:', error);
        toast.error('Không thể tải dữ liệu bài thi');
        navigate('/student-home');
      }
    };

    fetchTestData();
  }, [sessionId, navigate]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleMarkQuestion = (questionId: number) => {
    setMarkedQuestions(prev => {
      const newMarked = new Set(prev);
      if (newMarked.has(questionId)) {
        newMarked.delete(questionId);
      } else {
        newMarked.add(questionId);
      }
      return newMarked;
    });
  };

  const navigateToQuestion = (questionId: number) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const convertToCandidateAnswerRequests = () => {
    return Object.entries(userAnswers).map(([questionId, answer]) => ({
      questionId: parseInt(questionId, 10),
      answerChosen: answer
    }));
  };

  const saveProgress = async () => {
    if (saving) return;
  
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      const answers = convertToCandidateAnswerRequests();
  
      const response = await takingTestService.saveAnswers(token, Number(sessionId), answers);
  
      if (response.statusCode === 0) {
        toast.success('Đã lưu tiến trình làm bài');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Không thể lưu tiến trình làm bài');
    } finally {
      setSaving(false);
    }
  };  

  const handleSubmit = async () => {
    if (submitting) return;
  
    try {
      setSubmitting(true);
  
      await saveProgress();
  
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      const response = await takingTestService.submitTest(token, Number(sessionId));
  
      if (response.statusCode === 0) {
        toast.success('Nộp bài thành công');
        navigate('/student-home');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Không thể nộp bài');
    } finally {
      setSubmitting(false);
    }
  };
  

  const handleTimeUp = async () => {
    toast.warning('Hết thời gian làm bài!');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const answers = convertToCandidateAnswerRequests();
      await takingTestService.saveAnswers(token, Number(sessionId), answers);
      
      await takingTestService.submitTest(token, Number(sessionId));
      
      toast.success('Bài thi đã được nộp tự động');
      navigate('/student-home');
    } catch (error) {
      console.error('Error with auto-submit:', error);
      toast.error('Có lỗi khi nộp bài tự động');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 mr-2" />
        <span>Đang tải bài thi...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <TestNavigationSidebar
        questions={questions}
        userAnswers={userAnswers}
        markedQuestions={markedQuestions}
        onNavigateToQuestion={navigateToQuestion}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TestQuestionList
          questions={questions}
          userAnswers={userAnswers}
          markedQuestions={markedQuestions}
          onAnswerChange={handleAnswerChange}
          onMarkQuestion={handleMarkQuestion}
          currentTest={testInfo}
        />

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-3 px-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={saveProgress}
              disabled={saving}
              className="flex items-center"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {saving ? 'Đang lưu...' : 'Lưu tiến trình'}
            </Button>
            <Button
              onClick={() => setSubmitDialogOpen(true)}
              disabled={submitting}
              className="flex items-center"
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {submitting ? 'Đang nộp...' : 'Nộp bài'}
            </Button>
          </div>

          {endTime && (
            <ExamTimer
              endTime={endTime}
              onTimeUp={handleTimeUp}
            />
          )}
        </div>
      </div>

      <AlertDialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận nộp bài</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn nộp bài? Sau khi nộp bài, bạn sẽ không thể chỉnh sửa câu trả lời.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Nộp bài</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestPage;

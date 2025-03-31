
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { sessionService, Session } from '@/services/sessionService';
import { testService, Test } from '@/services/testService';

const TestConfirmation = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      navigate('/student-home');
      return;
    }

    const fetchSessionDetails = async () => {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const sessionData = await sessionService.getSession(token, parseInt(sessionId));
        
        if (sessionData) {
          setSession(sessionData);
          
          // Fetch test details
          const testData = await sessionService.getSessionTest(token, parseInt(sessionId));
          setTest(testData);
          
          // Check if session has started
          const startTime = new Date(sessionData.startTime).getTime();
          const now = new Date().getTime();
          const diff = startTime - now;
          
          if (diff <= 0) {
            // Session has started
            setCanStart(true);
            setTimeRemaining(0);
          } else {
            // Session hasn't started yet
            setCanStart(false);
            setTimeRemaining(Math.floor(diff / 1000)); // Convert to seconds
          }
        } else {
          toast.error('Không tìm thấy thông tin phiên thi');
          navigate('/student-home');
        }
      } catch (error) {
        console.error('Error fetching session details:', error);
        toast.error('Lỗi khi tải thông tin phiên thi');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId, navigate]);

  // Countdown timer effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setCanStart(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return dateTimeStr;
    }
  };

  const formatTimeLimit = (timeLimit: string) => {
    try {
      let hours = 0;
      let minutes = 0;
      
      const hoursMatch = timeLimit.match(/(\d+)H/);
      const minutesMatch = timeLimit.match(/(\d+)M/);
      
      if (hoursMatch) hours = parseInt(hoursMatch[1], 10);
      if (minutesMatch) minutes = parseInt(minutesMatch[1], 10);
      
      let result = '';
      if (hours > 0) result += `${hours} giờ `;
      if (minutes > 0) result += `${minutes} phút`;
      
      return result.trim() || 'Không giới hạn';
    } catch (error) {
      return timeLimit;
    }
  };

  const startTest = async () => {
    if (!sessionId) return;
    
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const success = await sessionService.startTest(token, parseInt(sessionId));
      if (success) {
        navigate(`/test/${sessionId}`);
      }
    } catch (error) {
      console.error('Error starting test:', error);
      toast.error('Không thể bắt đầu làm bài');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="flex items-center gap-2 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/student-home')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Thông tin bài thi</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">{test?.testName || 'Bài kiểm tra'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {test?.subject && (
            <div className="flex justify-between">
              <span className="text-gray-500">Môn học:</span>
              <span className="font-medium">{test.subject}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-500">Số câu hỏi:</span>
            <span className="font-medium">{test?.questionCount || 'Đang tải...'}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Thời gian bắt đầu:</span>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{session ? formatDateTime(session.startTime) : 'Đang tải...'}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Thời gian làm bài:</span>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{session ? formatTimeLimit(session.timeLimit) : 'Đang tải...'}</span>
            </div>
          </div>
          
          {!canStart && timeRemaining !== null && timeRemaining > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-center text-gray-700 mb-2">Bài thi sẽ bắt đầu sau:</div>
              <div className="text-center font-bold text-2xl text-blue-700">
                {formatTimeRemaining(timeRemaining)}
              </div>
            </div>
          )}
          
          {canStart && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center text-gray-700 mb-2">Bài thi đã sẵn sàng!</div>
              <div className="text-center font-bold text-lg text-green-700">
                Bạn có thể bắt đầu làm bài ngay bây giờ
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            disabled={!canStart}
            onClick={startTest}
          >
            Bắt đầu làm bài
          </Button>
        </CardFooter>
      </Card>
      
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-bold mb-2">Lưu ý:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
          <li>Vui lòng không rời khỏi trang khi đang làm bài kiểm tra.</li>
          <li>Hệ thống sẽ tự động lưu câu trả lời của bạn khi bạn chọn đáp án.</li>
          <li>Bạn có thể nộp bài bất kỳ lúc nào hoặc chờ đến khi hết thời gian.</li>
          <li>Nếu gặp sự cố kỹ thuật, vui lòng liên hệ giám thị ngay lập tức.</li>
        </ul>
      </div>
    </div>
  );
};

export default TestConfirmation;

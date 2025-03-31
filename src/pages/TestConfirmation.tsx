
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { sessionService, SessionResponse } from '@/services/sessionService';
import { toast } from 'sonner';
import { format, differenceInSeconds } from 'date-fns';
import { Play, Clock, AlertTriangle } from 'lucide-react';

const TestConfirmation = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [test, setTest] = useState<any | null>(null);
  const [timeUntilStart, setTimeUntilStart] = useState<number | null>(null);
  const [countdown, setCountdown] = useState('');
  
  const token = localStorage.getItem('token') || '';
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await sessionService.getSession(token, Number(sessionId));
        setSession(sessionData);
        
        const testData = await sessionService.getStudentTest(token, Number(sessionId));
        setTest(testData);
        
        const startTime = new Date(sessionData.startTime);
        const now = new Date();
        const secondsDiff = differenceInSeconds(startTime, now);
        setTimeUntilStart(secondsDiff > 0 ? secondsDiff : null);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Không thể tải thông tin bài kiểm tra');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [sessionId, token]);
  
  // Countdown timer
  useEffect(() => {
    if (timeUntilStart === null || timeUntilStart <= 0) return;
    
    const timer = setInterval(() => {
      setTimeUntilStart(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeUntilStart]);
  
  // Format countdown
  useEffect(() => {
    if (timeUntilStart === null) {
      setCountdown('');
      return;
    }
    
    const hours = Math.floor(timeUntilStart / 3600);
    const minutes = Math.floor((timeUntilStart % 3600) / 60);
    const seconds = timeUntilStart % 60;
    
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    setCountdown(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
  }, [timeUntilStart]);
  
  const handleStartTest = async () => {
    setStarting(true);
    try {
      await sessionService.startTest(token, Number(sessionId));
      navigate(`/test/${sessionId}`);
    } catch (error) {
      console.error('Error starting test:', error);
      toast.error('Không thể bắt đầu bài kiểm tra');
      setStarting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Đang tải...</p>
      </div>
    );
  }
  
  if (!session || !test) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-xl font-bold mb-4">Không tìm thấy thông tin bài kiểm tra</h2>
        <Button onClick={() => navigate('/student-home')}>
          Quay lại trang chủ
        </Button>
      </div>
    );
  }
  
  const isAvailable = timeUntilStart === null || timeUntilStart <= 0;
  
  const formatTimeLimit = (timeLimit: string) => {
    // Convert PT2H30M to 2h 30m
    const hours = timeLimit.match(/(\d+)H/);
    const minutes = timeLimit.match(/(\d+)M/);
    
    let result = '';
    if (hours) result += `${hours[1]} giờ `;
    if (minutes) result += `${minutes[1]} phút`;
    
    return result.trim() || 'Không xác định';
  };
  
  return (
    <div className="container mx-auto max-w-xl py-8">
      <Card className="shadow-lg border-t-4 border-t-blue-500">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Bắt đầu bài kiểm tra</CardTitle>
          <CardDescription>
            {test.testName} - {test.subject}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Thông tin bài kiểm tra:</span>
            </div>
            <p className="text-sm text-blue-800">Tổng số câu hỏi: {test.questionCount}</p>
            <p className="text-sm text-blue-800">Thời gian làm bài: {formatTimeLimit(session.timeLimit)}</p>
          </div>
          
          {!isAvailable && (
            <div className="bg-amber-50 p-4 rounded-lg flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Chưa đến thời gian làm bài</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Bài kiểm tra sẽ bắt đầu vào:{' '}
                  {format(new Date(session.startTime), 'dd/MM/yyyy HH:mm')}
                </p>
                <div className="mt-3 text-center">
                  <p className="text-xs text-amber-600 uppercase">Còn lại</p>
                  <div className="text-2xl font-bold text-amber-700 tabular-nums">
                    {countdown}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Hướng dẫn làm bài:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Hãy đọc kỹ từng câu hỏi trước khi trả lời.</li>
              <li>Bạn có thể đánh dấu câu hỏi để xem lại sau.</li>
              <li>Nên kiểm tra lại tất cả các câu trả lời trước khi nộp bài.</li>
              <li>Bài thi sẽ tự động nộp khi hết thời gian.</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            disabled={!isAvailable || starting}
            onClick={handleStartTest}
          >
            {starting ? (
              'Đang bắt đầu...'
            ) : !isAvailable ? (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Chờ đến giờ làm bài
              </div>
            ) : (
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                Bắt đầu làm bài
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestConfirmation;

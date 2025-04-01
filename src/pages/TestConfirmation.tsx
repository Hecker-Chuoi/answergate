import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sessionService } from '@/services/sessionService';
import { takingTestService } from '@/services/takingTestService';
import { toast } from 'sonner';
import { Test } from '@/services/testService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, Clock, FileText, CalendarIcon } from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import LogoutButton from '@/components/LogoutButton';

const TestConfirmation = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeToStart, setTimeToStart] = useState<number | null>(null);
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Gọi API lấy thông tin bài thi và phiên thi
        const testData = await takingTestService.getTest(token, Number(sessionId));
        const session = await takingTestService.getSession(token, Number(sessionId));

        setTest(testData);
        setSessionData(session);

        // Xử lý thời gian bắt đầu
        const startTime = new Date(session.startTime);
        const now = new Date();

        if (startTime > now) {
          setTimeToStart(differenceInSeconds(startTime, now));
          setCanStart(false);
        } else {
          setTimeToStart(0);
          setCanStart(true);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching test data:', error);
        toast.error('Không thể tải thông tin bài thi');
        navigate('/student-home');
      }
    };

    fetchTestData();

    // Cập nhật thời gian còn lại để bắt đầu
    const timer = setInterval(() => {
      if (!sessionData) return;

      const startTime = new Date(sessionData.startTime);
      const now = new Date();

      if (startTime <= now) {
        setTimeToStart(0);
        setCanStart(true);
        clearInterval(timer);
      } else {
        setTimeToStart(differenceInSeconds(startTime, now));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, navigate]);

  const handleStartTest = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Gọi API start test
      const response = await takingTestService.startTest(token, Number(sessionId));

      if (response?.statusCode == 0 || response?.statusCode == 405) {
        navigate(`/test/${sessionId}`);
      } else {
        throw new Error(response?.message || 'Không thể bắt đầu bài thi');
      }
    } catch (error: any) {
      console.error('Error starting test:', error);
      toast.error(error.response?.data?.message || 'Không thể bắt đầu bài thi');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Đang tải thông tin bài thi...</span>
      </div>
    );
  }

  if (!test || !sessionData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Không tìm thấy bài thi</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Bài thi không tồn tại hoặc không khả dụng.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/student-home')}>
              Quay lại trang chủ
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <CardTitle className="text-2xl font-bold">Thông tin bài thi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">{test.testName}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start space-x-2">
                <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Môn học</p>
                  <p>{test.subject}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Thời gian làm bài</p>
                  <p>{sessionData.timeLimit} phút</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Số câu hỏi</p>
                  <p>{test.questionCount} câu</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Thời gian bắt đầu</p>
                  <p>{format(new Date(sessionData.startTime), 'dd/MM/yyyy HH:mm')}</p>
                </div>
              </div>
            </div>
          </div>

          {!canStart && timeToStart !== null && (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-center">
              <p className="text-blue-700 font-medium mb-2">Thời gian còn lại trước khi bắt đầu</p>
              <div className="text-2xl font-mono font-bold text-blue-800">
                {new Date(timeToStart * 1000).toISOString().substr(11, 8)}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/student-home')}>
            Quay lại
          </Button>
          <Button onClick={handleStartTest} disabled={!canStart}>
            {canStart ? 'Bắt đầu làm bài' : 'Chưa đến thời gian'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestConfirmation;

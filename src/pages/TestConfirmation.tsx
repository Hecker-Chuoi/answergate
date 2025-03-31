import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sessionService } from '@/services/sessionService';
import { toast } from 'sonner';
import { Test } from '@/services/testService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';

const TestConfirmation = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const sessionData = await sessionService.getTakingTest(token, Number(sessionId));
        setTest(sessionData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching test:', error);
        toast.error('Không thể tải thông tin bài thi');
        navigate('/student-home');
      }
    };
    
    fetchTest();
  }, [sessionId, navigate]);

  const handleStartTest = () => {
    navigate(`/test/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Không tìm thấy bài thi</CardTitle>
            <CardDescription>
              Bài thi không tồn tại hoặc không khả dụng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/student-home')}>
              Quay lại trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader className="flex flex-col items-center space-y-2">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <CardTitle className="text-2xl font-bold">
            Xác nhận tham gia bài thi
          </CardTitle>
          <CardDescription>
            Bạn đã sẵn sàng tham gia bài thi <b>{test.testName}</b>?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p>
              <b>Môn học:</b> {test.subject}
            </p>
            <p>
              <b>Số lượng câu hỏi:</b> {test.questionCount}
            </p>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/student-home')}>
              Hủy bỏ
            </Button>
            <Button onClick={handleStartTest}>Bắt đầu làm bài</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestConfirmation;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Session, sessionService } from '@/services/sessionService';
import { Test, testService } from '@/services/testService';
import { User, userService } from '@/services/userService';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SessionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [candidates, setCandidates] = useState<User[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token || !id) {
      navigate('/login');
      return;
    }

    const fetchSessionDetails = async () => {
      setLoading(true);
      try {
        const sessionId = parseInt(id);
        const sessionData = await sessionService.getSession(token, sessionId);
        
        if (sessionData) {
          setSession(sessionData);
          
          // Fetch test associated with this session
          const testData = await sessionService.getSessionTest(token, sessionId);
          if (testData) {
            setTest(testData);
          }
          
          // Fetch candidates assigned to this session
          const candidatesData = await sessionService.getSessionCandidates(token, sessionId);
          setCandidates(candidatesData);
        } else {
          navigate('/session-list');
        }
      } catch (error) {
        console.error('Error fetching session details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Phiên thi không tồn tại</h2>
          <Button className="mt-4" onClick={() => navigate('/session-list')}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chi tiết phiên thi #{session.sessionId}</h1>
        <Button variant="outline" onClick={() => navigate('/session-list')}>
          Quay lại
        </Button>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="details">Thông tin chung</TabsTrigger>
          <TabsTrigger value="test">Đề thi</TabsTrigger>
          <TabsTrigger value="candidates">Thí sinh</TabsTrigger>
          <TabsTrigger value="results">Kết quả</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Thông tin phiên thi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">ID phiên thi</p>
              <p className="font-medium">{session.sessionId}</p>
            </div>
            <div>
              <p className="text-gray-500">Thời gian bắt đầu</p>
              <p className="font-medium">{session.startTime}</p>
            </div>
            <div>
              <p className="text-gray-500">Thời gian làm bài</p>
              <p className="font-medium">{session.timeLimit}</p>
            </div>
            <div>
              <p className="text-gray-500">Số lượng thí sinh</p>
              <p className="font-medium">{session.candidateCount || 0}</p>
            </div>
            <div>
              <p className="text-gray-500">Lần chỉnh sửa cuối</p>
              <p className="font-medium">{session.lastEditTime || 'N/A'}</p>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <Button>Chỉnh sửa thông tin</Button>
            <Button variant="destructive">Xóa phiên thi</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="test" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Bài thi</h2>
          {test ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">ID bài thi</p>
                  <p className="font-medium">{test.testId}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tên bài thi</p>
                  <p className="font-medium">{test.testName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Môn học</p>
                  <p className="font-medium">{test.subject || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Số lượng câu hỏi</p>
                  <p className="font-medium">{test.questionCount || 0}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button onClick={() => navigate(`/test-details/${test.testId}`)}>
                  Xem chi tiết bài thi
                </Button>
                <Button>Đổi bài thi khác</Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Không có bài thi được gán cho phiên thi này</p>
              <Button className="mt-4">Thêm bài thi</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="candidates" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Danh sách thí sinh</h2>
          {candidates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Username</th>
                    <th className="border p-2 text-left">Họ và tên</th>
                    <th className="border p-2 text-left">Loại</th>
                    <th className="border p-2 text-left">Giới tính</th>
                    <th className="border p-2 text-left">Ngày sinh</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.userId} className="hover:bg-gray-50">
                      <td className="border p-2">{candidate.username}</td>
                      <td className="border p-2">{candidate.fullName}</td>
                      <td className="border p-2">{candidate.type || 'N/A'}</td>
                      <td className="border p-2">{candidate.gender || 'N/A'}</td>
                      <td className="border p-2">{candidate.dob || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Không có thí sinh nào được gán cho phiên thi này</p>
            </div>
          )}
          <div className="mt-6">
            <Button>Thay đổi thí sinh</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Kết quả</h2>
          <div className="text-center py-8">
            <p>Chưa có kết quả nào cho phiên thi này</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionDetailsPage;

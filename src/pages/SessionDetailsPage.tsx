
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, ClipboardList, Check, Clock, Calendar, CalendarClock } from 'lucide-react';
import { sessionService, SessionResponse } from '@/services/sessionService';
import { testService } from '@/services/testService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const SessionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [test, setTest] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

  const token = localStorage.getItem('token') || '';
  
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const fetchedSession = await sessionService.getSession(token, Number(id));
        setSession(fetchedSession);
        
        // Fetch associated test
        const fetchedTest = await testService.getTestById(token, fetchedSession.testId);
        setTest(fetchedTest);
        
        // Fetch candidates
        const fetchedCandidates = await sessionService.getCandidates(token, Number(id));
        setCandidates(fetchedCandidates);
        
        // Fetch results
        const fetchedResults = await sessionService.getCandidateResults(token, Number(id));
        setResults(fetchedResults);
      } catch (error) {
        console.error('Error fetching session data:', error);
        toast.error('Không thể tải thông tin buổi thi');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessionData();
  }, [id, token]);

  const formatDuration = (duration: string) => {
    // Parse ISO 8601 duration like PT2H30M
    const hourMatch = duration.match(/(\d+)H/);
    const minuteMatch = duration.match(/(\d+)M/);
    
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
    
    if (hours > 0 && minutes > 0) {
      return `${hours} giờ ${minutes} phút`;
    } else if (hours > 0) {
      return `${hours} giờ`;
    } else if (minutes > 0) {
      return `${minutes} phút`;
    }
    
    return duration;
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
        <p>Không tìm thấy buổi thi</p>
        <Button onClick={() => navigate('/session-list')} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết buổi thi</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/edit-session/${session.sessionId}`)}
          >
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Thông tin chung</TabsTrigger>
          <TabsTrigger value="candidates">Thí sinh</TabsTrigger>
          <TabsTrigger value="results">Kết quả</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Thông tin buổi thi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center text-gray-500 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">Thời gian bắt đầu</span>
                    </div>
                    <p className="font-medium">
                      {format(new Date(session.startTime), 'PPpp', { locale: vi })}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-500 mb-1">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">Thời gian làm bài</span>
                    </div>
                    <p className="font-medium">{formatDuration(session.timeLimit)}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-500 mb-1">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">Số thí sinh</span>
                    </div>
                    <p className="font-medium">{session.candidateCount} thí sinh</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-500 mb-1">
                      <CalendarClock className="w-4 h-4 mr-2" />
                      <span className="text-sm">Cập nhật lần cuối</span>
                    </div>
                    <p className="font-medium">
                      {format(new Date(session.lastEditTime), 'Pp', { locale: vi })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bài kiểm tra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Tên bài kiểm tra</div>
                    <p className="font-medium">{test.testName}</p>
                  </div>
                  
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Môn học</div>
                    <p className="font-medium">{test.subject}</p>
                  </div>
                  
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Số lượng câu hỏi</div>
                    <p className="font-medium">{test.questionCount} câu</p>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/test-details/${test.testId}`)}
                      className="w-full"
                    >
                      Xem chi tiết bài kiểm tra
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách thí sinh ({candidates.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {candidates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có thí sinh nào được thêm vào buổi thi này</p>
                  <Button className="mt-4">Thêm thí sinh</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Họ và tên</th>
                        <th className="text-left py-3 px-4 font-medium">Tên đăng nhập</th>
                        <th className="text-left py-3 px-4 font-medium">Loại</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Số điện thoại</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((candidate) => (
                        <tr key={candidate.userId} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{candidate.fullName}</td>
                          <td className="py-3 px-4">{candidate.username}</td>
                          <td className="py-3 px-4">{candidate.type}</td>
                          <td className="py-3 px-4">{candidate.mail || '-'}</td>
                          <td className="py-3 px-4">{candidate.phoneNumber || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Kết quả thi ({results.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có kết quả thi nào</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">ID</th>
                        <th className="text-left py-3 px-4 font-medium">Trạng thái</th>
                        <th className="text-left py-3 px-4 font-medium">Điểm</th>
                        <th className="text-left py-3 px-4 font-medium">Thời gian làm</th>
                        <th className="text-left py-3 px-4 font-medium">Thời gian nộp bài</th>
                        <th className="text-right py-3 px-4 font-medium">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result) => (
                        <tr key={result.testResultId} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{result.testResultId}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <span
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  result.status === 'COMPLETED'
                                    ? 'bg-green-500'
                                    : result.status === 'IN_PROGRESS'
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-500'
                                }`}
                              ></span>
                              {result.status === 'COMPLETED'
                                ? 'Đã hoàn thành'
                                : result.status === 'IN_PROGRESS'
                                ? 'Đang làm bài'
                                : 'Chưa bắt đầu'}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {result.score.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            {result.timeTaken ? `${Math.floor(result.timeTaken / 60)} phút` : '-'}
                          </td>
                          <td className="py-3 px-4">
                            {result.submitAt
                              ? format(new Date(result.submitAt), 'Pp', { locale: vi })
                              : '-'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/result-details/${result.testResultId}`)}
                            >
                              Chi tiết
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionDetailsPage;

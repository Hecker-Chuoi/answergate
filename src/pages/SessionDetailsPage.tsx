
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, Users, ClipboardList, Check, Clock, 
  Calendar, CalendarClock, PenSquare, FileText, UserPlus 
} from 'lucide-react';
import { sessionService, SessionResponse } from '@/services/sessionService';
import { testService } from '@/services/testService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SessionEditForm from '@/components/SessionEditForm';
import SessionTestChange from '@/components/SessionTestChange';
import SessionCandidateManage from '@/components/SessionCandidateManage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SessionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [test, setTest] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  
  // Dialog states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showTestChangeDialog, setShowTestChangeDialog] = useState(false);
  const [showCandidateDialog, setShowCandidateDialog] = useState(false);

  const token = localStorage.getItem('token') || '';
  
  const fetchSessionData = async () => {
    try {
      setLoading(true);
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
  
  useEffect(() => {
    fetchSessionData();
  }, [id, token]);

  const formatDuration = (duration: string) => {
    // Parse ISO 8601 duration like PT2H30M
    let minutes = Number.parseInt(duration);
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours} giờ ${minutes} phút`;
    } else if (hours > 0) {
      return `${hours} giờ`;
    } else if (minutes > 0) {
      return `${minutes} phút`;
    }
    
    return duration;
  };

  const handleSessionUpdate = (updatedSession: SessionResponse) => {
    setSession(updatedSession);
    setShowEditDialog(false);
    fetchSessionData();
  };

  const handleTestChanged = () => {
    setShowTestChangeDialog(false);
    fetchSessionData();
  };

  const handleCandidatesChanged = () => {
    setShowCandidateDialog(false);
    fetchSessionData();
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
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PenSquare className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Chỉnh sửa buổi thi</DialogTitle>
                <DialogDescription>
                  Thay đổi thời gian và thời lượng của buổi thi.
                </DialogDescription>
              </DialogHeader>
              <SessionEditForm 
                session={session}
                onUpdate={handleSessionUpdate}
                onCancel={() => setShowEditDialog(false)}
              />
            </DialogContent>
          </Dialog>
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
                      {session.startTime}
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
                      {session.lastEditTime}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Thông tin bài kiểm tra</CardTitle>
                <Dialog open={showTestChangeDialog} onOpenChange={setShowTestChangeDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Đổi đề thi
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Chọn đề thi</DialogTitle>
                      <DialogDescription>
                        Chọn một đề thi để thay thế cho đề thi hiện tại.
                      </DialogDescription>
                    </DialogHeader>
                    <SessionTestChange
                      sessionId={session.sessionId}
                      currentTestId={session.testId}
                      onTestChanged={handleTestChanged}
                      onCancel={() => setShowTestChangeDialog(false)}
                    />
                  </DialogContent>
                </Dialog>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Danh sách thí sinh ({candidates.length})</CardTitle>
              <Dialog open={showCandidateDialog} onOpenChange={setShowCandidateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Thêm thí sinh
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Thêm thí sinh</DialogTitle>
                    <DialogDescription>
                      Thêm thí sinh theo loại hoặc tùy chỉnh.
                    </DialogDescription>
                  </DialogHeader>
                  <SessionCandidateManage
                    sessionId={session.sessionId}
                    onCandidatesChanged={handleCandidatesChanged}
                    onCancel={() => setShowCandidateDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {candidates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có thí sinh nào được thêm vào buổi thi này</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Họ và tên</TableHead>
                        <TableHead>Tên đăng nhập</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Số điện thoại</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidates.map((candidate) => (
                        <TableRow key={candidate.userId}>
                          <TableCell>{candidate.fullName}</TableCell>
                          <TableCell>{candidate.username}</TableCell>
                          <TableCell>{candidate.type}</TableCell>
                          <TableCell>{candidate.mail || '-'}</TableCell>
                          <TableCell>{candidate.phoneNumber || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Điểm</TableHead>
                        <TableHead>Thời gian làm</TableHead>
                        <TableHead>Thời gian nộp bài</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result.testResultId}>
                          <TableCell>{result.testResultId}</TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell className="font-medium">
                            {result.score}
                          </TableCell>
                          <TableCell>
                            {result.timeTaken}
                          </TableCell>
                          <TableCell>
                            {result.submitAt}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/detailed-results/${result.testResultId}`)}
                            >
                              Chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { sessionService, SessionResponse } from '@/services/sessionService';
import { testService, Test } from '@/services/testService';
import { format, parseISO } from 'date-fns';
import { toast } from "sonner";
import { ArrowLeft, Trash2, Edit, Clock, Users, BarChart4 } from "lucide-react";

const SessionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showChangeTestDialog, setShowChangeTestDialog] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState({
    startTime: '',
    timeLimit: ''
  });
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const fetchedSession = await sessionService.getSession(token, Number(id));
        setSession(fetchedSession);
        
        if (fetchedSession) {
          // Format startTime for the form
          const startDate = parseISO(fetchedSession.startTime);
          setEditFormData({
            startTime: format(startDate, "yyyy-MM-dd'T'HH:mm"),
            timeLimit: fetchedSession.timeLimit
          });
          
          // Get test details
          const fetchedTest = await sessionService.getSessionTest(token, fetchedSession.sessionId);
          setTest(fetchedTest);
        }
      } catch (error) {
        console.error('Error fetching session details:', error);
        toast.error('Không thể tải thông tin phiên thi');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [id, token]);

  const fetchAvailableTests = async () => {
    try {
      const tests = await testService.getValidTests(token);
      setAvailableTests(tests);
    } catch (error) {
      console.error('Error fetching available tests:', error);
      toast.error('Không thể tải danh sách bài kiểm tra');
    }
  };

  const handleEditSession = async () => {
    if (!session) return;
    
    try {
      const updatedSession = await sessionService.updateSession(
        token, 
        session.sessionId, 
        {
          startTime: editFormData.startTime,
          timeLimit: editFormData.timeLimit
        }
      );
      
      if (updatedSession) {
        setSession(updatedSession);
        setShowEditDialog(false);
      }
    } catch (error) {
      console.error('Error updating session:', error);
      toast.error('Không thể cập nhật phiên thi');
    }
  };

  const handleChangeTest = async () => {
    if (!session || !selectedTestId) return;
    
    try {
      const updatedSession = await sessionService.changeSessionTest(
        token, 
        session.sessionId, 
        selectedTestId
      );
      
      if (updatedSession) {
        // Refresh test details
        const fetchedTest = await sessionService.getSessionTest(token, session.sessionId);
        setTest(fetchedTest);
        setShowChangeTestDialog(false);
        setSelectedTestId(null);
      }
    } catch (error) {
      console.error('Error changing test:', error);
      toast.error('Không thể thay đổi bài kiểm tra');
    }
  };

  const handleDeleteSession = async () => {
    if (!session) return;
    
    try {
      const success = await sessionService.deleteSession(token, session.sessionId);
      if (success) {
        toast.success('Xóa phiên thi thành công');
        navigate('/session-list');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Không thể xóa phiên thi');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Đang tải thông tin phiên thi...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Không tìm thấy thông tin phiên thi</p>
        <Button onClick={() => navigate('/session-list')} className="mt-4">Quay lại danh sách</Button>
      </div>
    );
  }

  const formattedStartTime = format(new Date(session.startTime), 'dd/MM/yyyy HH:mm');
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/session-list')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              Phiên thi {session.sessionId}
            </h1>
            <div className="flex items-center mt-1 space-x-2">
              <Badge>{formattedStartTime}</Badge>
              <Badge variant="outline">
                <Clock className="h-4 w-4 mr-1" />
                {session.timeLimit}
              </Badge>
              {session.isDeleted && (
                <Badge variant="destructive">Đã xóa</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chỉnh sửa phiên thi</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="startTime">Thời gian bắt đầu</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="datetime-local"
                    value={editFormData.startTime}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="timeLimit">Thời gian làm bài (định dạng ISO 8601, ví dụ: PT2H30M)</Label>
                  <Input
                    id="timeLimit"
                    name="timeLimit"
                    value={editFormData.timeLimit}
                    onChange={handleInputChange}
                    placeholder="PT2H30M"
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    PT2H30M nghĩa là 2 giờ 30 phút
                  </p>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={handleEditSession}>
                  Lưu
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
              </AlertDialogHeader>
              <p>Hành động này không thể hoàn tác. Phiên thi sẽ bị xóa vĩnh viễn.</p>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSession}>Xóa</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="details">Thông tin</TabsTrigger>
          <TabsTrigger value="test">Bài kiểm tra</TabsTrigger>
          <TabsTrigger value="candidates">Thí sinh</TabsTrigger>
          <TabsTrigger value="results">Kết quả</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin phiên thi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">ID Phiên thi</h4>
                  <p>{session.sessionId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Thời gian bắt đầu</h4>
                  <p>{formattedStartTime}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Thời gian làm bài</h4>
                  <p>{session.timeLimit}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Số thí sinh</h4>
                  <p>{session.candidateCount}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Trạng thái</h4>
                  <p>{session.isDeleted ? 'Đã xóa' : 'Đang hoạt động'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Thời gian chỉnh sửa cuối</h4>
                  <p>{session.lastEditTime ? format(new Date(session.lastEditTime), 'dd/MM/yyyy HH:mm') : 'Chưa có'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Bài kiểm tra</CardTitle>
                <Dialog open={showChangeTestDialog} onOpenChange={(open) => {
                  setShowChangeTestDialog(open);
                  if (open) fetchAvailableTests();
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Đổi bài kiểm tra</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Chọn bài kiểm tra</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[400px] overflow-y-auto my-4">
                      {availableTests.length > 0 ? (
                        availableTests.map(test => (
                          <div
                            key={test.testId}
                            className={`border p-4 rounded-md mb-2 cursor-pointer ${
                              selectedTestId === test.testId ? 'border-primary bg-primary/10' : ''
                            }`}
                            onClick={() => setSelectedTestId(test.testId)}
                          >
                            <div className="font-medium">{test.testName}</div>
                            <div className="text-sm text-muted-foreground">
                              {test.subject} • {test.questionCount} câu hỏi
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4">Đang tải danh sách bài kiểm tra...</p>
                      )}
                      {availableTests.length === 0 && !loading && (
                        <p className="text-center py-4">Không có bài kiểm tra nào khả dụng</p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowChangeTestDialog(false)}>
                        Hủy
                      </Button>
                      <Button onClick={handleChangeTest} disabled={!selectedTestId}>
                        Xác nhận
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {test ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium">{test.testName}</h3>
                      <p className="text-muted-foreground">{test.subject}</p>
                    </div>
                    <Badge>{test.questionCount} câu hỏi</Badge>
                  </div>
                  
                  <div className="pt-4">
                    <Button asChild>
                      <Link to={`/test-details/${test.testId}`}>
                        Xem chi tiết bài kiểm tra
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>Chưa có bài kiểm tra nào được chọn</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Danh sách thí sinh</CardTitle>
                <Button asChild>
                  <Link to={`/candidate-list/${session.sessionId}`}>
                    <Users className="mr-2 h-4 w-4" />
                    Quản lý thí sinh
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4">
                Nhấn vào nút "Quản lý thí sinh" để xem và thêm thí sinh cho phiên thi
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Kết quả</CardTitle>
                <Button asChild>
                  <Link to={`/detailed-results/${session.sessionId}`}>
                    <BarChart4 className="mr-2 h-4 w-4" />
                    Xem chi tiết kết quả
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4">
                Nhấn vào nút "Xem chi tiết kết quả" để xem kết quả của tất cả thí sinh
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionDetailsPage;

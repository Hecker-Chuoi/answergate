
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Users, Book, PieChart } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sessionService, SessionResponse, SessionUpdateRequest } from '@/services/sessionService';
import { testService } from '@/services/testService';
import { userService } from '@/services/userService';
import { format } from 'date-fns';

const SessionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [test, setTest] = useState<any | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  
  const [editing, setEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showChangeTestDialog, setShowChangeTestDialog] = useState(false);
  const [showAddCandidatesDialog, setShowAddCandidatesDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [sessionForm, setSessionForm] = useState<SessionUpdateRequest>({
    startTime: '',
    timeLimit: ''
  });
  
  const [availableTests, setAvailableTests] = useState<any[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number>(0);
  
  const token = localStorage.getItem('token') || '';
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedSession = await sessionService.getSession(token, Number(id));
        setSession(fetchedSession);
        
        setSessionForm({
          startTime: fetchedSession.startTime,
          timeLimit: fetchedSession.timeLimit
        });
        
        const fetchedTest = await sessionService.getTest(token, Number(id));
        setTest(fetchedTest);
        
        const fetchedCandidates = await sessionService.getCandidates(token, Number(id));
        setCandidates(fetchedCandidates);
        
        const fetchedResults = await sessionService.getCandidateResults(token, Number(id));
        setResults(fetchedResults);
        
        const tests = await testService.getValidTests(token);
        setAvailableTests(tests);
      } catch (error) {
        console.error('Error fetching session data:', error);
        toast.error('Không thể tải thông tin phiên thi');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, token]);
  
  const handleUpdate = async () => {
    if (!session) return;
    
    setIsSaving(true);
    try {
      const updatedSession = await sessionService.updateSession(
        token,
        session.sessionId,
        sessionForm
      );
      
      setSession(updatedSession);
      setEditing(false);
      toast.success('Cập nhật phiên thi thành công');
    } catch (error) {
      console.error('Error updating session:', error);
      toast.error('Không thể cập nhật phiên thi');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!session) return;
    
    setIsDeleting(true);
    try {
      await sessionService.deleteSession(token, session.sessionId);
      toast.success('Xóa phiên thi thành công');
      navigate('/session-list');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Không thể xóa phiên thi');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleChangeTest = async () => {
    if (!session || !selectedTestId) return;
    
    setIsSaving(true);
    try {
      await sessionService.changeTest(token, session.sessionId, selectedTestId);
      
      const updatedSession = await sessionService.getSession(token, session.sessionId);
      setSession(updatedSession);
      
      const updatedTest = await sessionService.getTest(token, session.sessionId);
      setTest(updatedTest);
      
      setShowChangeTestDialog(false);
      setSelectedTestId(0);
      
      toast.success('Thay đổi bài kiểm tra thành công');
    } catch (error) {
      console.error('Error changing test:', error);
      toast.error('Không thể thay đổi bài kiểm tra');
    } finally {
      setIsSaving(false);
    }
  };
  
  const formatDateTime = (dateTimeStr: string) => {
    try {
      return format(new Date(dateTimeStr), 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Không hợp lệ';
    }
  };
  
  const formatTimeLimit = (timeLimit: string) => {
    // Convert PT2H30M to 2h 30m
    const hours = timeLimit.match(/(\d+)H/);
    const minutes = timeLimit.match(/(\d+)M/);
    
    let result = '';
    if (hours) result += `${hours[1]} giờ `;
    if (minutes) result += `${minutes[1]} phút`;
    
    return result.trim() || 'Không xác định';
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Đang tải...</p>
      </div>
    );
  }
  
  if (!session) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Không tìm thấy phiên thi</p>
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
          <h1 className="text-2xl font-bold">Chi tiết phiên thi #{session.sessionId}</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Thông tin chung</TabsTrigger>
          <TabsTrigger value="test">Bài kiểm tra</TabsTrigger>
          <TabsTrigger value="candidates">Thí sinh</TabsTrigger>
          <TabsTrigger value="results">Kết quả</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          {editing ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Chỉnh sửa thông tin
                  <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Hủy</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right">
                      Thời gian bắt đầu
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="startTime"
                        type="datetime-local"
                        value={sessionForm.startTime}
                        onChange={(e) => setSessionForm(prev => ({
                          ...prev,
                          startTime: e.target.value
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="timeLimit" className="text-right">
                      Thời gian làm bài
                    </Label>
                    <div className="col-span-3">
                      <Select 
                        value={sessionForm.timeLimit}
                        onValueChange={(value) => setSessionForm(prev => ({
                          ...prev,
                          timeLimit: value
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thời gian" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PT0H30M">30 phút</SelectItem>
                          <SelectItem value="PT1H00M">1 giờ</SelectItem>
                          <SelectItem value="PT1H30M">1 giờ 30 phút</SelectItem>
                          <SelectItem value="PT2H00M">2 giờ</SelectItem>
                          <SelectItem value="PT2H30M">2 giờ 30 phút</SelectItem>
                          <SelectItem value="PT3H00M">3 giờ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleUpdate} disabled={isSaving}>
                      {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin phiên thi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-500">Thời gian bắt đầu</span>
                      </div>
                      <p className="mt-1 text-lg">{formatDateTime(session.startTime)}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-500">Thời gian làm bài</span>
                      </div>
                      <p className="mt-1 text-lg">{formatTimeLimit(session.timeLimit)}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-500">Số thí sinh</span>
                      </div>
                      <p className="mt-1 text-lg">{session.candidateCount}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-500">Lần chỉnh sửa cuối</span>
                      </div>
                      <p className="mt-1 text-lg">{formatDateTime(session.lastEditTime)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="test">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Bài kiểm tra</CardTitle>
              <Button 
                variant="outline" 
                onClick={() => setShowChangeTestDialog(true)}
              >
                Thay đổi bài kiểm tra
              </Button>
            </CardHeader>
            <CardContent>
              {!test ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có bài kiểm tra được chọn</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <h3 className="text-lg font-semibold">{test.testName}</h3>
                      <p className="text-gray-500">{test.subject}</p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/test-details/${test.testId}`)}
                    >
                      <Book className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium">ID</p>
                      <p className="text-lg">{test.testId}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium">Số câu hỏi</p>
                      <p className="text-lg">{test.questionCount}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium">Trạng thái</p>
                      <div className="flex items-center mt-1">
                        <span className={`w-2 h-2 rounded-full mr-2 ${test.isDeleted ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        <span className="text-lg">{test.isDeleted ? 'Đã xóa' : 'Hoạt động'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="candidates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Danh sách thí sinh</CardTitle>
              <Button 
                variant="outline" 
                onClick={() => setShowAddCandidatesDialog(true)}
              >
                Thêm thí sinh
              </Button>
            </CardHeader>
            <CardContent>
              {candidates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có thí sinh nào</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {candidates.map((candidate) => (
                        <tr key={candidate.userId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{candidate.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{candidate.fullName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{candidate.type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {candidate.gender === 'MALE' ? 'Nam' : 
                               candidate.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                            </div>
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
        
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-blue-500" />
                Kết quả kiểm tra
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có kết quả nào</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã kết quả</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm số</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian nộp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian làm</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.map((result) => (
                        <tr key={result.testResultId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{result.testResultId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">
                              <span className={
                                result.score >= 8 ? 'text-green-600' : 
                                result.score >= 5 ? 'text-blue-600' : 
                                'text-red-600'
                              }>
                                {result.score}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              result.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              result.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {result.status === 'COMPLETED' ? 'Hoàn thành' :
                               result.status === 'IN_PROGRESS' ? 'Đang làm' :
                               'Chưa bắt đầu'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {result.submitAt ? formatDateTime(result.submitAt) : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {result.timeTaken ? `${Math.floor(result.timeTaken / 60)} phút` : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              onClick={() => navigate(`/detailed-results/${result.testResultId}`)}
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

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa phiên thi</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa phiên thi này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa phiên thi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change test dialog */}
      <Dialog open={showChangeTestDialog} onOpenChange={setShowChangeTestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thay đổi bài kiểm tra</DialogTitle>
            <DialogDescription>
              Chọn bài kiểm tra mới cho phiên thi này.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select 
              onValueChange={(value) => setSelectedTestId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn bài kiểm tra" />
              </SelectTrigger>
              <SelectContent>
                {availableTests.map((test) => (
                  <SelectItem key={test.testId} value={test.testId.toString()}>
                    {test.testName} - {test.subject} ({test.questionCount} câu)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangeTestDialog(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleChangeTest}
              disabled={!selectedTestId || isSaving}
            >
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add candidates dialog - simplified, can be expanded later */}
      <Dialog open={showAddCandidatesDialog} onOpenChange={setShowAddCandidatesDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm thí sinh</DialogTitle>
            <DialogDescription>
              Bạn có thể thêm thí sinh theo loại hoặc chọn từng người.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex flex-col space-y-4">
              <Button variant="outline" className="justify-start">
                <Users className="h-4 w-4 mr-2" />
                Thêm thí sinh theo loại
              </Button>
              <Button variant="outline" className="justify-start">
                <Users className="h-4 w-4 mr-2" />
                Thêm thí sinh theo người dùng
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tính năng này đang được phát triển.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCandidatesDialog(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionDetailsPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionService, SessionResponse, SessionCreationRequest } from '@/services/sessionService';
import { testService } from '@/services/testService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const SessionListPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [availableTests, setAvailableTests] = useState<any[]>([]);
  
  // Hàm lấy thời gian mặc định (thời điểm hiện tại + 5 phút, format dd/MM/yyyy HH:mm)
  const getDefaultStartTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return format(now, 'dd/MM/yyyy HH:mm');
  };

  const [newSession, setNewSession] = useState<SessionCreationRequest>({
    testId: 0,
    startTime: getDefaultStartTime(),
    timeLimit: '90'
  });
  
  const token = localStorage.getItem('token') || '';
  
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const fetchedSessions = await sessionService.getAllSessions(token);
        setSessions(fetchedSessions);
        
        const tests = await testService.getValidTests(token);
        setAvailableTests(tests);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast.error('Không thể tải danh sách phiên thi');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [token]);
  
  const handleCreateSession = async () => {
    if (!newSession.testId || !newSession.startTime || !newSession.timeLimit) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    setIsCreating(true);
    try {
      const createdSession = await sessionService.createSession(token, newSession);
      setSessions(prev => [...prev, createdSession]);
      toast.success('Tạo phiên thi thành công');
      setShowCreateDialog(false);
      resetNewSession();
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Không thể tạo phiên thi');
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleDeleteSession = async () => {
    if (!selectedSessionId) return;
    
    setIsDeleting(true);
    try {
      await sessionService.deleteSession(token, selectedSessionId);
      setSessions(prev => prev.filter(session => session.sessionId !== selectedSessionId));
      toast.success('Xóa phiên thi thành công');
      setShowDeleteDialog(false);
    } catch (error) {
      console.error(`Error deleting session ${selectedSessionId}:`, error);
      toast.error('Không thể xóa phiên thi');
    } finally {
      setIsDeleting(false);
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
    if (hours) result += `${hours[1]}h `;
    if (minutes) result += `${minutes[1]}m`;
    
    return result.trim() || 'Không hợp lệ';
  };
  
  const resetNewSession = () => {
    setNewSession({
      testId: 0,
      startTime: '',
      timeLimit: 'PT2H00M'
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách phiên thi</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo phiên thi mới
        </Button>
      </div>
      
      {loading ? (
        <p className="text-center py-10">Đang tải...</p>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Chưa có phiên thi nào</h3>
          <p className="text-gray-500 mb-6">Hãy tạo phiên thi mới để bắt đầu</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo phiên thi
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời lượng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số thí sinh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.sessionId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.sessionId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {session.startTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {session.timeLimit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.candidateCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      session.isDeleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {session.isDeleted ? 'Đã xóa' : 'Hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2"
                      onClick={() => navigate(`/session-details/${session.sessionId}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Chi tiết
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => {
                        setSelectedSessionId(session.sessionId);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo phiên thi mới</DialogTitle>
            <DialogDescription>
              Điền các thông tin cần thiết để tạo phiên thi mới.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="testId" className="text-right">
                Bài kiểm tra
              </Label>
              <div className="col-span-3">
                <Select 
                  onValueChange={(value) => setNewSession(prev => ({ ...prev, testId: Number(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn bài kiểm tra" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTests.map((test) => (
                      <SelectItem key={test.testId} value={test.testId.toString()}>
                        {test.testName} - {test.subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Thời gian bắt đầu
              </Label>
              <div className="col-span-3">
                <Input
                  id="startTime"
                  type="datetime-local"
                  onChange={(e) => setNewSession(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeLimit" className="text-right">
                Thời gian làm bài
              </Label>
              <div className="col-span-3">
                <Select 
                  defaultValue="PT2H00M"
                  onValueChange={(value) => setNewSession(prev => ({ ...prev, timeLimit: value }))}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              resetNewSession();
            }}>
              Hủy
            </Button>
            <Button onClick={handleCreateSession} disabled={isCreating}>
              {isCreating ? 'Đang tạo...' : 'Tạo phiên thi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
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
              onClick={handleDeleteSession}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa phiên thi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      {/* Dialog Create Session */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo phiên thi mới</DialogTitle>
            <DialogDescription>
              Điền các thông tin cần thiết để tạo phiên thi mới.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="testId" className="text-right">
                Bài kiểm tra
              </Label>
              <div className="col-span-3">
                <select
                  className="border rounded px-2 py-1 w-full"
                  onChange={(e) => setNewSession(prev => ({ ...prev, testId: Number(e.target.value) }))}
                >
                  <option value="">Chọn bài kiểm tra</option>
                  {availableTests.map((test) => (
                    <option key={test.testId} value={test.testId}>
                      {test.testName} - {test.subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Thời gian bắt đầu
              </Label>
              <div className="col-span-3">
                <Input
                  id="startTime"
                  type="text"
                  placeholder="dd/MM/yyyy HH:mm"
                  value={newSession.startTime}
                  onChange={(e) => setNewSession(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeLimit" className="text-right">
                Thời gian làm bài (phút)
              </Label>
              <div className="col-span-3">
                <Input
                  id="timeLimit"
                  type="number"
                  placeholder="Nhập số phút"
                  value={newSession.timeLimit}
                  onChange={(e) => setNewSession(prev => ({ ...prev, timeLimit: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              resetNewSession();
            }}>
              Hủy
            </Button>
            <Button onClick={handleCreateSession}>
              Tạo phiên thi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionListPage;

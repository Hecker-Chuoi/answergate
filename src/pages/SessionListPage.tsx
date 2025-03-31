
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Eye, Trash, Plus, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { sessionService, Session, SessionCreationRequest } from '@/services/sessionService';
import { testService, Test } from '@/services/testService';

const SessionListPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  
  // Form state
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState('');
  const [hours, setHours] = useState('2');
  const [minutes, setMinutes] = useState('0');

  useEffect(() => {
    fetchSessions();
    fetchTests();
  }, []);

  const fetchSessions = async () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const data = await sessionService.getAllSessions(token);
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Không thể tải danh sách phiên thi');
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) return;

    try {
      const data = await testService.getValidTests(token);
      setTests(data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
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

  const handleCreateSession = async () => {
    if (!selectedTestId) {
      toast.error('Vui lòng chọn đề thi');
      return;
    }

    const timeLimitStr = `PT${hours}H${minutes}M`;
    
    const token = sessionStorage.getItem('authToken');
    if (!token) return;

    try {
      const sessionData: SessionCreationRequest = {
        testId: selectedTestId,
        timeLimit: timeLimitStr,
      };
      
      if (startTime) {
        sessionData.startTime = new Date(startTime).toISOString();
      }

      const result = await sessionService.createSession(token, sessionData);
      if (result) {
        setShowCreateDialog(false);
        resetForm();
        fetchSessions();
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Không thể tạo phiên thi');
    }
  };

  const handleDeleteSession = async () => {
    if (!selectedSessionId) return;
    
    const token = sessionStorage.getItem('authToken');
    if (!token) return;

    try {
      const success = await sessionService.deleteSession(token, selectedSessionId);
      if (success) {
        fetchSessions();
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const resetForm = () => {
    setSelectedTestId(null);
    setStartTime('');
    setHours('2');
    setMinutes('0');
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/admin-home')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Quản lý phiên thi</h1>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo phiên thi mới
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Không có phiên thi nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Thời gian bắt đầu</TableHead>
                <TableHead>Thời gian làm bài</TableHead>
                <TableHead>Số thí sinh</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.sessionId}>
                  <TableCell className="font-medium">{session.sessionId}</TableCell>
                  <TableCell>{formatDateTime(session.startTime)}</TableCell>
                  <TableCell>{formatTimeLimit(session.timeLimit)}</TableCell>
                  <TableCell>{session.candidateCount || 0}</TableCell>
                  <TableCell>{session.isDeleted ? 'Đã xóa' : 'Đang hoạt động'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/session-details/${session.sessionId}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                        onClick={() => {
                          setSelectedSessionId(session.sessionId!);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Session Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo phiên thi mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin để tạo phiên thi mới
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="test">Chọn đề thi</Label>
              <Select 
                value={selectedTestId?.toString() || ''} 
                onValueChange={(value) => setSelectedTestId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đề thi" />
                </SelectTrigger>
                <SelectContent>
                  {tests.map((test) => (
                    <SelectItem key={test.testId} value={test.testId?.toString() || ''}>
                      {test.testName} {test.subject && `(${test.subject})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Thời gian bắt đầu</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Thời gian làm bài</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div className="grid grid-cols-2 gap-2 w-full">
                  <div>
                    <Input
                      id="hours"
                      type="number"
                      min="0"
                      placeholder="Giờ"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      id="minutes"
                      type="number"
                      min="0"
                      max="59"
                      placeholder="Phút"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateSession}>Tạo phiên thi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa phiên thi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phiên thi này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSession} className="bg-red-500 hover:bg-red-600">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SessionListPage;

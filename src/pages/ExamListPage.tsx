
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Search, FileText, Clock, Users, Trash, RefreshCw } from 'lucide-react';
import { testService, Test } from '@/services/testService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ExamListPage = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  useEffect(() => {
    // Get user info from session storage
    const userStr = sessionStorage.getItem('currentUser');
    const tokenStr = sessionStorage.getItem('authToken');
    
    if (userStr && tokenStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        fetchTests(tokenStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchTests = async (token: string) => {
    setLoading(true);
    try {
      const fetchedTests = await testService.getAllTests(token);
      setTests(fetchedTests);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      fetchTests(token);
    }
  };

  const handleDeleteTest = async () => {
    if (!selectedTestId) return;
    
    const token = sessionStorage.getItem('authToken');
    if (token) {
      const success = await testService.deleteTest(token, selectedTestId);
      if (success) {
        fetchTests(token);
      }
    }
    setShowDeleteDialog(false);
  };

  const handleRestoreTest = async () => {
    if (!selectedTestId) return;
    
    const token = sessionStorage.getItem('authToken');
    if (token) {
      const success = await testService.restoreTest(token, selectedTestId);
      if (success) {
        fetchTests(token);
      }
    }
    setShowRestoreDialog(false);
  };

  const filteredTests = tests.filter(test => {
    if (!test || !test.testName) return false;
    
    return (
      test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (test.subject && test.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'DELETED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang hoạt động';
      case 'INACTIVE':
        return 'Không hoạt động';
      case 'DELETED':
        return 'Đã xóa';
      default:
        return 'Không xác định';
    }
  };

  if (!currentUser) return <div>Đang tải...</div>;
  
  if (currentUser.role !== 'ADMIN' && currentUser.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách đề thi</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Button className="flex items-center gap-2" onClick={() => navigate('/create-test')}>
            <FileText size={16} />
            Tạo đề thi mới
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm đề thi..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCw size={16} />
            Làm mới
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Tên đề thi</TableHead>
                  <TableHead>Môn học</TableHead>
                  <TableHead className="text-center">Số câu hỏi</TableHead>
                  <TableHead className="text-center">Thời gian (phút)</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Không tìm thấy đề thi nào</TableCell>
                  </TableRow>
                ) : (
                  filteredTests.map((test) => (
                    <TableRow key={test.testId}>
                      <TableCell className="font-medium">{test.testId}</TableCell>
                      <TableCell>{test.testName}</TableCell>
                      <TableCell>{test.subject || 'Chưa phân loại'}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FileText size={14} />
                          {test.totalQuestion || 0}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock size={14} />
                          {test.totalTime || 0}
                        </div>
                      </TableCell>
                      <TableCell>{test.createdAt ? new Date(test.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(test.status)}`}>
                          {getStatusText(test.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/test-details/${test.testId}`)}
                          >
                            Chi tiết
                          </Button>
                          {test.status !== 'DELETED' ? (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => {
                                setSelectedTestId(test.testId || null);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash size={16} />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-green-500 hover:text-green-700"
                              onClick={() => {
                                setSelectedTestId(test.testId || null);
                                setShowRestoreDialog(true);
                              }}
                            >
                              <RefreshCw size={16} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đề thi này không? Hành động này có thể được hoàn tác sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteTest}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Dialog */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận khôi phục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn khôi phục đề thi này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction className="bg-green-500 hover:bg-green-600" onClick={handleRestoreTest}>
              Khôi phục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExamListPage;

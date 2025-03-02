
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Search, FileText, Clock, Users } from 'lucide-react';

const ExamListPage = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([
    { 
      id: 1, 
      title: 'Kiểm tra Toán học lớp 12', 
      subject: 'Toán học', 
      questions: 40, 
      time: 60, 
      createdAt: '2023-05-15', 
      status: 'Đang diễn ra' 
    },
    { 
      id: 2, 
      title: 'Kiểm tra Vật lý lớp 11', 
      subject: 'Vật lý', 
      questions: 30, 
      time: 45, 
      createdAt: '2023-05-10', 
      status: 'Đã kết thúc' 
    },
    { 
      id: 3, 
      title: 'Kiểm tra Hóa học lớp 10', 
      subject: 'Hóa học', 
      questions: 35, 
      time: 50, 
      createdAt: '2023-05-20', 
      status: 'Sắp diễn ra' 
    },
    { 
      id: 4, 
      title: 'Kiểm tra Tiếng Anh lớp 12', 
      subject: 'Tiếng Anh', 
      questions: 50, 
      time: 60, 
      createdAt: '2023-05-18', 
      status: 'Đang diễn ra' 
    },
    { 
      id: 5, 
      title: 'Kiểm tra Ngữ văn lớp 11', 
      subject: 'Ngữ văn', 
      questions: 25, 
      time: 90, 
      createdAt: '2023-05-05', 
      status: 'Đã kết thúc' 
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    // Get user info from session storage
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Đang diễn ra':
        return 'bg-green-100 text-green-800';
      case 'Đã kết thúc':
        return 'bg-gray-100 text-gray-800';
      case 'Sắp diễn ra':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentUser) return <div>Đang tải...</div>;
  
  if (currentUser.role !== 'admin' && currentUser.role !== 'teacher') {
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
          <Button className="flex items-center gap-2">
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
        </div>

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
              {filteredExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.id}</TableCell>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <FileText size={14} />
                      {exam.questions}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock size={14} />
                      {exam.time}
                    </div>
                  </TableCell>
                  <TableCell>{exam.createdAt}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(exam.status)}`}>
                      {exam.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/exam-details/${exam.id}`)}
                      >
                        Chi tiết
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/exam-results/${exam.id}`)}
                      >
                        Kết quả
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ExamListPage;

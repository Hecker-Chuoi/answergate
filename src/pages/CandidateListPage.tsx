
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Search, Download, UserPlus } from 'lucide-react';

const CandidateListPage = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0123456789', status: 'Đã thi' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0987654321', status: 'Chưa thi' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', phone: '0369852147', status: 'Đã thi' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', phone: '0741852963', status: 'Chưa thi' },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@example.com', phone: '0852963741', status: 'Đã thi' },
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

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.phone.includes(searchTerm)
  );

  if (!currentUser) return <div>Đang tải...</div>;
  
  if (currentUser.role !== 'admin' && currentUser.role !== 'teacher') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <header className="bg-military-red shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Danh sách thí sinh</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-white text-military-red hover:bg-gray-100">
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </header>
    
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </div>
          <Button className="flex items-center gap-2 bg-military-red hover:bg-military-dark-red">
            <UserPlus size={16} />
            Thêm thí sinh
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm thí sinh..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Xuất danh sách (Excel)
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-military-red bg-opacity-10">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.id}</TableCell>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.phone}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        candidate.status === 'Đã thi' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {candidate.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-military-red hover:bg-military-red hover:bg-opacity-10"
                        onClick={() => navigate(`/candidate-details/${candidate.id}`)}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

const handleLogout = () => {
  sessionStorage.removeItem('currentUser');
  sessionStorage.removeItem('authToken');
  window.location.href = '/login';
};

export default CandidateListPage;

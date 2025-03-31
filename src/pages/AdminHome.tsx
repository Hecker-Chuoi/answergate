
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Users, BookOpen, ClipboardList, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const AdminHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is authenticated and has ADMIN role
    const userStr = sessionStorage.getItem('currentUser');
    const token = sessionStorage.getItem('authToken');
    
    if (!userStr || !token) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role !== 'ADMIN') {
        navigate('/login');
        return;
      }
      
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');
    toast.success('Đăng xuất thành công');
    navigate('/login');
  };

  const menuItems: MenuItem[] = [
    {
      title: 'Quản lý người dùng',
      description: 'Xem, thêm, sửa, xóa thông tin người dùng',
      icon: <Users className="h-10 w-10 text-blue-600" />,
      path: '/user-management'
    },
    {
      title: 'Quản lý đề thi',
      description: 'Tạo và quản lý các đề thi, câu hỏi',
      icon: <BookOpen className="h-10 w-10 text-green-600" />,
      path: '/exam-list'
    },
    {
      title: 'Quản lý phiên thi',
      description: 'Lên lịch và quản lý các phiên thi',
      icon: <ClipboardList className="h-10 w-10 text-purple-600" />,
      path: '/session-list'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-blue-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Trang quản trị</h1>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-white hidden md:block">
                Xin chào, <span className="font-semibold">{user.fullName || user.username}</span>
              </span>
            )}
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-white text-blue-700 hover:bg-gray-100">
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-semibold mb-8">Chức năng quản trị</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <CardTitle className="text-center">{item.title}</CardTitle>
                <CardDescription className="text-center">{item.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => navigate(item.path)}
                >
                  Truy cập
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminHome;

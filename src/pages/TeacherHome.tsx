
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, FileText, Users, Plus } from 'lucide-react';
import { toast } from 'sonner';

const TeacherHome = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');
    toast.success('Đăng xuất thành công');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <header className="bg-military-red shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Trang quản lý giáo viên</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-white text-military-red hover:bg-gray-100">
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-military-red p-3 rounded-md">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng số bài kiểm tra</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">12</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Button 
                  variant="ghost" 
                  className="font-medium text-military-red hover:bg-military-red hover:bg-opacity-10"
                  onClick={() => navigate('/exam-list')}
                >
                  Xem tất cả
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-military-red p-3 rounded-md">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng số học sinh</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">45</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Button 
                  variant="ghost" 
                  className="font-medium text-military-red hover:bg-military-red hover:bg-opacity-10"
                  onClick={() => navigate('/candidate-list')}
                >
                  Xem danh sách
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-military-red p-3 rounded-md">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tạo bài kiểm tra mới</dt>
                    <dd className="flex items-baseline">
                      <div className="text-sm text-gray-700 mt-2">Tạo bài kiểm tra và gán cho học sinh</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Button variant="ghost" className="font-medium text-military-red hover:bg-military-red hover:bg-opacity-10">
                  Tạo mới
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherHome;

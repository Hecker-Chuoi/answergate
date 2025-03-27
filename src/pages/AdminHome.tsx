
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Users, FileText, Settings } from 'lucide-react';
import { toast } from 'sonner';

const AdminHome = () => {
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
          <h1 className="text-2xl font-bold text-white">Trang quản trị hệ thống</h1>
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
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Quản lý người dùng</dt>
                    <dd className="flex items-baseline">
                      <div className="text-sm text-gray-700 mt-2">Thêm, xóa, sửa thông tin người dùng</div>
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
                  onClick={() => navigate('/user-management')}
                >
                  Truy cập
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Quản lý thí sinh</dt>
                    <dd className="flex items-baseline">
                      <div className="text-sm text-gray-700 mt-2">Theo dõi thí sinh và kết quả thi</div>
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
                  Truy cập
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-military-red p-3 rounded-md">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Quản lý bài kiểm tra</dt>
                    <dd className="flex items-baseline">
                      <div className="text-sm text-gray-700 mt-2">Tạo, phân công, theo dõi bài kiểm tra</div>
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
                  Truy cập
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-military-red p-3 rounded-md">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Cấu hình hệ thống</dt>
                    <dd className="flex items-baseline">
                      <div className="text-sm text-gray-700 mt-2">Thiết lập cấu hình và tùy chọn hệ thống</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Button variant="ghost" className="font-medium text-military-red hover:bg-military-red hover:bg-opacity-10">
                  Truy cập
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;

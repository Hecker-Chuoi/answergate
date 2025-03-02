
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const StudentHome = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    toast.success('Đăng xuất thành công');
    navigate('/login');
  };
  
  const startTest = () => {
    navigate('/test-confirmation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Trang chủ thí sinh</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Bài kiểm tra sắp tới</h2>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Tên bài kiểm tra</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Kiểm tra Toán học</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Thời gian</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">90 phút</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Số câu hỏi</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">50 câu</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Sẵn sàng
                  </span>
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-5 sm:px-6 flex justify-end">
            <Button onClick={startTest} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Bắt đầu làm bài
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentHome;

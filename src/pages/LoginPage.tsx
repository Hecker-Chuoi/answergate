
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Gọi API đăng nhập
      const response = await authService.login(username, password);
      
      if (response.statusCode === 100 && response.result.authenticated) {
        // Lưu token vào sessionStorage
        sessionStorage.setItem('authToken', response.result.token);
        
        // Lấy thông tin người dùng
        const userInfo = await authService.getUserInfo(response.result.token);
        
        if (userInfo) {
          // Lưu thông tin người dùng vào sessionStorage
          sessionStorage.setItem('currentUser', JSON.stringify(userInfo));
          
          toast.success(`Đăng nhập thành công`);
          
          // Chuyển hướng dựa trên vai trò
          if (userInfo.role === 'USER') {
            navigate('/student-home');
          } else if (userInfo.role === 'ADMIN') {
            navigate('/admin-home');
          } else {
            navigate('/');
          }
        } else {
          toast.error('Không thể lấy thông tin người dùng');
        }
      } else {
        toast.error(response.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      toast.error('Lỗi kết nối đến máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-military-light-red to-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-military-dark-red">Đăng nhập</h1>
          <p className="mt-2 text-gray-600">Đăng nhập để truy cập hệ thống</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Tên đăng nhập
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-red focus:border-military-red"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-military-red focus:border-military-red"
              />
            </div>
          </div>

          <div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 bg-military-red hover:bg-military-dark-red text-white transition-colors"
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// This would typically come from an API, but we'll mock it for now
const MOCK_USERS = [
  { username: 'student', password: 'password', role: 'student' },
  { username: 'teacher', password: 'password', role: 'teacher' },
  { username: 'admin', password: 'password', role: 'admin' }
];

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = MOCK_USERS.find(
      user => user.username === username && user.password === password
    );
    
    if (user) {
      // Store user info in sessionStorage (would use proper auth in a real app)
      sessionStorage.setItem('currentUser', JSON.stringify({
        username: user.username,
        role: user.role
      }));
      
      toast.success(`Đăng nhập thành công với quyền ${user.role}`);
      
      // Redirect based on role
      switch(user.role) {
        case 'student':
          navigate('/student-home');
          break;
        case 'teacher':
          navigate('/teacher-home');
          break;
        case 'admin':
          navigate('/admin-home');
          break;
        default:
          navigate('/');
      }
    } else {
      toast.error('Sai tên đăng nhập hoặc mật khẩu');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Đăng nhập</h1>
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
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
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
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full flex justify-center py-2 px-4">
              Đăng nhập
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>Để demo: sử dụng</p>
            <p>Tên đăng nhập: student, teacher, hoặc admin</p>
            <p>Mật khẩu: password</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

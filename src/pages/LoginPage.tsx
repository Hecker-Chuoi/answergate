
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authService } from '@/services/authService';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('currentUser');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // Validate token before redirecting
        authService.validateToken(token).then(isValid => {
          if (isValid) {
            // Redirect based on role
            if (user.role === 'ADMIN') {
              navigate('/admin-home');
            } else if (user.role === 'USER') {
              navigate('/student-home');
            }
          } else {
            // Token is invalid, clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
          }
          setCheckingAuth(false);
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        setCheckingAuth(false);
      }
    } else {
      setCheckingAuth(false);
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authService.login(username, password);
      
      if (response.statusCode === 0 && response.result?.authenticated) {
        // Login successful
        const token = response.result.token;
        localStorage.setItem('token', token);
        
        // Get user info
        const userInfo = await authService.getUserInfo(token);
        
        if (userInfo) {
          localStorage.setItem('currentUser', JSON.stringify(userInfo));
          toast.success('Đăng nhập thành công');
          
          // Redirect based on role
          if (userInfo.role === 'ADMIN') {
            navigate('/admin-home');
          } else {
            navigate('/student-home');
          }
        } else {
          toast.error('Không thể lấy thông tin người dùng');
          localStorage.removeItem('token');
        }
      } else {
        // Login failed
        toast.error(response.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Lỗi kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Đăng nhập</CardTitle>
          <CardDescription className="text-center">
            Vui lòng đăng nhập để tiếp tục
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;

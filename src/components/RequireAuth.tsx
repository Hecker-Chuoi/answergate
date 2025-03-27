
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/authService';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const validateAuth = async () => {
      const token = sessionStorage.getItem('authToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Kiểm tra token có hợp lệ không
        const isValid = await authService.validateToken(token);
        
        if (isValid) {
          // Lấy thông tin người dùng
          const userInfo = await authService.getUserInfo(token);
          
          if (userInfo) {
            setUserRole(userInfo.role);
            setIsAuthenticated(true);
            
            // Cập nhật thông tin người dùng trong sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify(userInfo));
          } else {
            // Token hợp lệ nhưng không lấy được thông tin người dùng
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('currentUser');
            setIsAuthenticated(false);
          }
        } else {
          // Token không hợp lệ, đăng xuất người dùng
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('currentUser');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Lỗi xác thực:', error);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };
    
    validateAuth();
  }, []);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-military-red"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Map backend roles to frontend roles
  const hasRequiredRole = allowedRoles.some(role => {
    if (userRole === 'ADMIN' && (role === 'admin' || role === 'teacher')) return true;
    if (userRole === 'USER' && role === 'student') return true;
    return role === userRole;
  });

  if (hasRequiredRole) {
    return <>{children}</>;
  }

  return <Navigate to="/" replace />;
};

export default RequireAuth;

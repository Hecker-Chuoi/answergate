
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
      const userStr = sessionStorage.getItem('currentUser');
      const token = sessionStorage.getItem('authToken');
      
      if (!userStr || !token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Kiểm tra token có hợp lệ không
        const isValid = await authService.validateToken(token);
        
        if (isValid) {
          const user = JSON.parse(userStr);
          setUserRole(user.role);
          setIsAuthenticated(true);
        } else {
          // Token không hợp lệ, đăng xuất người dùng
          sessionStorage.removeItem('currentUser');
          sessionStorage.removeItem('authToken');
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

  if (userRole && allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  return <Navigate to="/" replace />;
};

export default RequireAuth;

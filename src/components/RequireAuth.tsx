
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Loader2 } from 'lucide-react';

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
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Validate token
        const isValid = await authService.validateToken(token);
        
        if (isValid) {
          // Get user info
          const userInfo = await authService.getUserInfo(token);
          
          if (userInfo) {
            setUserRole(userInfo.role);
            setIsAuthenticated(true);
            
            // Store user info in localStorage
            localStorage.setItem('currentUser', JSON.stringify(userInfo));
          } else {
            // Token is valid but can't get user info
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            setIsAuthenticated(false);
          }
        } else {
          // Token is invalid, logout user
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };
    
    validateAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has allowed role
  const hasRequiredRole = allowedRoles.some(role => {
    // Map backend roles to frontend roles
    if (userRole === 'ADMIN' && (role === 'admin' || role === 'ADMIN')) return true;
    if (userRole === 'USER' && (role === 'user' || role === 'USER')) return true;
    return role === userRole;
  });

  if (hasRequiredRole) {
    return <>{children}</>;
  }

  // If user doesn't have the required role, redirect to appropriate home page
  if (userRole === 'ADMIN') {
    return <Navigate to="/admin-home" replace />;
  }
  
  if (userRole === 'USER') {
    return <Navigate to="/student-home" replace />;
  }

  // Fallback to login
  return <Navigate to="/login" replace />;
};

export default RequireAuth;


import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

const RequireAuth = ({ children, allowedRoles }: Props) => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<{ username: string, role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!currentUser) {
    // Redirect to login if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate home page if role doesn't match
    switch (currentUser.role) {
      case 'student':
        return <Navigate to="/student-home" replace />;
      case 'teacher':
        return <Navigate to="/teacher-home" replace />;
      case 'admin':
        return <Navigate to="/admin-home" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default RequireAuth;

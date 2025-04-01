
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

const AdminLogoutButton: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    authService.logout();
    toast.success('Đã đăng xuất thành công');
    navigate('/login');
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className="ml-auto"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Đăng xuất
    </Button>
  );
};

export default AdminLogoutButton;

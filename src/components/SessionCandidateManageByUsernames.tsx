
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { sessionService } from '@/services/sessionService';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

interface User {
  userId: number;
  username: string;
  fullName: string;
  type: string;
  role: string;
}

interface SessionCandidateManageByUsernamesProps {
  sessionId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const SessionCandidateManageByUsernames: React.FC<SessionCandidateManageByUsernamesProps> = ({
  sessionId,
  onSuccess,
  onCancel
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);
  const [filter, setFilter] = useState('');

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');
        
        const usersData = await userService.getAllUsers(token);
        // Filter out admin users
        const filteredUsers = usersData.filter(user => user.role !== 'ADMIN');
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Không thể tải danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleToggleUser = (username: string) => {
    setSelectedUsernames(prev => {
      if (prev.includes(username)) {
        return prev.filter(u => u !== username);
      } else {
        return [...prev, username];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsernames.length === 0) {
      toast.error('Vui lòng chọn ít nhất một người dùng');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      await sessionService.assignCandidatesByUsernames(token, sessionId, selectedUsernames);
      toast.success('Đã gán thí sinh thành công');
      onSuccess();
    } catch (error) {
      console.error('Error assigning candidates by usernames:', error);
      toast.error('Không thể gán thí sinh');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(filter.toLowerCase()) || 
    user.fullName.toLowerCase().includes(filter.toLowerCase()) ||
    user.type.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin h-6 w-6 mr-2" />
        <span>Đang tải danh sách người dùng...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="filter">Tìm kiếm</Label>
        <Input 
          id="filter"
          placeholder="Tìm theo tên đăng nhập, họ tên hoặc loại" 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="border rounded-md overflow-hidden max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Tên đăng nhập</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Loại</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Không tìm thấy người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow 
                  key={user.userId}
                  className="cursor-pointer"
                  onClick={() => handleToggleUser(user.username)}
                >
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={selectedUsernames.includes(user.username)}
                      onCheckedChange={() => handleToggleUser(user.username)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.type}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-gray-500">
          Đã chọn {selectedUsernames.length} người dùng
        </div>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={submitting || selectedUsernames.length === 0}>
            {submitting ? 'Đang xử lý...' : 'Xác nhận'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SessionCandidateManageByUsernames;

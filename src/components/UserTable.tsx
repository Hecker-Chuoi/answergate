
import React from 'react';
import { User } from '@/services/userService';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from '@/components/ui/checkbox';

interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  toggleUserSelection: (username: string) => void;
  onViewDetails: (user: User) => void;
  loading: boolean;
}

const UserTable = ({ 
  users, 
  selectedUsers, 
  toggleUserSelection, 
  onViewDetails,
  loading
}: UserTableProps) => {
  if (loading) {
    return <p className="text-center py-10">Đang tải...</p>;
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-2">Không có người dùng</h3>
        <p className="text-gray-500 mb-6">Hãy thêm người dùng mới để bắt đầu</p>
      </div>
    );
  }

  return (
    <ScrollArea>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Họ và tên</TableHead>
            <TableHead>Tên đăng nhập</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>Ngày sinh</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.userId}>
              <TableCell className="p-2">
                <Checkbox 
                  checked={selectedUsers.includes(user.username)}
                  onCheckedChange={() => toggleUserSelection(user.username)}
                />
              </TableCell>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.type}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>{user.dob}</TableCell>
              <TableCell>{user.mail || '-'}</TableCell>
              <TableCell>{user.phoneNumber || '-'}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(user)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default UserTable;

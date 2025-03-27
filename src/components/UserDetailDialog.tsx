
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User, UserUpdateRequest, userService } from '@/services/userService';
import { toast } from 'sonner';

interface UserDetailDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
  token: string;
}

const UserDetailDialog = ({ user, isOpen, onClose, onUserUpdated, token }: UserDetailDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userUpdateData, setUserUpdateData] = useState<UserUpdateRequest>({
    dob: '',
    gender: '',
    phoneNumber: '',
    mail: '',
    unit: '',
    hometown: ''
  });

  React.useEffect(() => {
    if (user) {
      setUserUpdateData({
        dob: user.dob || '',
        gender: user.gender || '',
        phoneNumber: user.phoneNumber || '',
        mail: user.mail || '',
        unit: user.unit || '',
        hometown: user.hometown || ''
      });
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user || !token) return;
    
    // Validate date format (DD/MM/YYYY)
    if (userUpdateData.dob && !/^(\d{2})\/(\d{2})\/(\d{4})$/.test(userUpdateData.dob)) {
      toast.error('Ngày sinh phải có định dạng DD/MM/YYYY');
      return;
    }

    try {
      const result = await userService.updateUser(token, user.username, userUpdateData);
      if (result) {
        setIsEditing(false);
        onUserUpdated();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      setIsEditing(false);
      onClose();
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Chỉnh sửa thông tin người dùng' : 'Thông tin chi tiết người dùng'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Cập nhật thông tin của người dùng, những trường để trống sẽ không thay đổi' 
              : 'Xem thông tin chi tiết của người dùng'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">ID:</Label>
            <div className="col-span-3">{user.userId || '-'}</div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Tên đăng nhập:</Label>
            <div className="col-span-3">{user.username}</div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Họ và tên:</Label>
            <div className="col-span-3">{user.fullName}</div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Vai trò:</Label>
            <div className="col-span-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === 'ADMIN' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user.role === 'ADMIN' ? 'Quản trị viên' : 'Thí sinh'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dob" className="text-right font-medium">Ngày sinh:</Label>
            {isEditing ? (
              <Input
                id="dob"
                value={userUpdateData.dob}
                onChange={(e) => setUserUpdateData({...userUpdateData, dob: e.target.value})}
                placeholder="DD/MM/YYYY"
                className="col-span-3"
              />
            ) : (
              <div className="col-span-3">{user.dob || '-'}</div>
            )}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right font-medium">Giới tính:</Label>
            {isEditing ? (
              <Input
                id="gender"
                value={userUpdateData.gender}
                onChange={(e) => setUserUpdateData({...userUpdateData, gender: e.target.value})}
                className="col-span-3"
              />
            ) : (
              <div className="col-span-3">{user.gender || '-'}</div>
            )}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right font-medium">Số điện thoại:</Label>
            {isEditing ? (
              <Input
                id="phoneNumber"
                value={userUpdateData.phoneNumber}
                onChange={(e) => setUserUpdateData({...userUpdateData, phoneNumber: e.target.value})}
                className="col-span-3"
              />
            ) : (
              <div className="col-span-3">{user.phoneNumber || '-'}</div>
            )}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mail" className="text-right font-medium">Email:</Label>
            {isEditing ? (
              <Input
                id="mail"
                type="email"
                value={userUpdateData.mail}
                onChange={(e) => setUserUpdateData({...userUpdateData, mail: e.target.value})}
                className="col-span-3"
              />
            ) : (
              <div className="col-span-3">{user.mail || '-'}</div>
            )}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right font-medium">Đơn vị:</Label>
            {isEditing ? (
              <Input
                id="unit"
                value={userUpdateData.unit}
                onChange={(e) => setUserUpdateData({...userUpdateData, unit: e.target.value})}
                className="col-span-3"
              />
            ) : (
              <div className="col-span-3">{user.unit || '-'}</div>
            )}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hometown" className="text-right font-medium">Quê quán:</Label>
            {isEditing ? (
              <Input
                id="hometown"
                value={userUpdateData.hometown}
                onChange={(e) => setUserUpdateData({...userUpdateData, hometown: e.target.value})}
                className="col-span-3"
              />
            ) : (
              <div className="col-span-3">{user.hometown || '-'}</div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Hủy</Button>
              <Button onClick={handleSaveChanges}>Lưu thay đổi</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>Đóng</Button>
              <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;

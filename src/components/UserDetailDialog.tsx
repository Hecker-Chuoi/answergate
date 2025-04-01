
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    gender: 'MALE', // Default to prevent "" type error
    phoneNumber: '',
    mail: '',
    hometown: '',
    type: 'Chiến sĩ' // Default to prevent "" type error
  });

  React.useEffect(() => {
    if (user) {
      setUserUpdateData({
        dob: user.dob || '',
        gender: user.gender as 'MALE' | 'FEMALE' | 'OTHER' || 'MALE',
        phoneNumber: user.phoneNumber || '',
        mail: user.mail || '',
        hometown: user.hometown || '',
        type: user.type || 'Chiến sĩ'
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
              <div className="col-span-3">
                <Select 
                  value={userUpdateData.gender} 
                  onValueChange={(value: 'MALE' | 'FEMALE' | 'OTHER') => 
                    setUserUpdateData({...userUpdateData, gender: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Nam</SelectItem>
                    <SelectItem value="FEMALE">Nữ</SelectItem>
                    <SelectItem value="OTHER">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="col-span-3">
                {user.gender === 'MALE' ? 'Nam' : 
                 user.gender === 'FEMALE' ? 'Nữ' : 
                 user.gender === 'OTHER' ? 'Khác' : '-'}
              </div>
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
            <Label htmlFor="type" className="text-right font-medium">Loại:</Label>
            {isEditing ? (
              <div className="col-span-3">
                <Select 
                  value={userUpdateData.type} 
                  onValueChange={(value: 'Chiến sĩ' | 'Sĩ quan' | 'Chuyên nghiệp') => 
                    setUserUpdateData({...userUpdateData, type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chiến sĩ">Chiến sĩ</SelectItem>
                    <SelectItem value="Sĩ quan">Sĩ quan</SelectItem>
                    <SelectItem value="Chuyên nghiệp">Chuyên nghiệp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="col-span-3">{user.type || '-'}</div>
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

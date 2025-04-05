
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { UserCreationRequest } from '@/services/userService';

interface UserCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserCreationRequest) => void;
  isSubmitting: boolean;
}

const initialFormState: UserCreationRequest = {
  fullName: '',
  gender: 'MALE',
  dob: '',
  type: 'SOLDIER',
  mail: '',
  phoneNumber: '',
  hometown: '',
};

const UserCreateDialog = ({ isOpen, onClose, onSubmit, isSubmitting }: UserCreateDialogProps) => {
  const [userForm, setUserForm] = useState<UserCreationRequest>(initialFormState);

  const handleSubmit = () => {
    onSubmit(userForm);
  };

  const handleClose = () => {
    setUserForm(initialFormState);
    onClose();
  };

  const handleGenderChange = (gender: string) => {
    setUserForm((prev) => ({
      ...prev,
      gender: gender as "MALE" | "FEMALE" | "OTHER"
    }));
  };

  const handleTypeChange = (type: string) => {
    setUserForm((prev) => ({
      ...prev,
      type
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo người dùng mới</DialogTitle>
          <DialogDescription>
            Điền các thông tin cần thiết để tạo người dùng mới.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">
              Họ và tên
            </Label>
            <div className="col-span-3">
              <Input
                id="fullName"
                value={userForm.fullName}
                onChange={(e) => setUserForm(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Giới tính
            </Label>
            <div className="col-span-3">
              <Select onValueChange={handleGenderChange} defaultValue={userForm.gender}>
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
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dob" className="text-right">
              Ngày sinh
            </Label>
            <div className="col-span-3">
              <Input
                id="dob"
                placeholder="DD/MM/YYYY"
                value={userForm.dob}
                onChange={(e) => setUserForm(prev => ({ ...prev, dob: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Loại
            </Label>
            <div className="col-span-3">
              <Select onValueChange={handleTypeChange} defaultValue={userForm.type}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOLDIER">Chiến sĩ</SelectItem>
                  <SelectItem value="OFFICER">Sĩ quan</SelectItem>
                  <SelectItem value="PROFESSIONAL">Chuyên nghiệp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mail" className="text-right">
              Email
            </Label>
            <div className="col-span-3">
              <Input
                id="mail"
                type="email"
                value={userForm.mail || ''}
                onChange={(e) => setUserForm(prev => ({ ...prev, mail: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">
              Số điện thoại
            </Label>
            <div className="col-span-3">
              <Input
                id="phoneNumber"
                type="tel"
                value={userForm.phoneNumber || ''}
                onChange={(e) => setUserForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hometown" className="text-right">
              Quê quán
            </Label>
            <div className="col-span-3">
              <Input
                id="hometown"
                value={userForm.hometown || ''}
                onChange={(e) => setUserForm(prev => ({ ...prev, hometown: e.target.value }))}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Tạo người dùng'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreateDialog;

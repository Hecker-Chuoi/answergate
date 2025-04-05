
import React, { useState, useEffect, useRef } from 'react';
import { userService, User, UserCreationRequest, UserUpdateRequest } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, User as UserIcon, Eye, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import UserDetailDialog from '@/components/UserDetailDialog';
import { Checkbox } from '@/components/ui/checkbox';

// User type constants for mapping between UI and API values
const USER_TYPES = {
  'Chiến sĩ': 'SOLDIER',
  'Sĩ quan': 'OFFICER',
  'Chuyên nghiệp': 'PROFESSIONAL',
  'SOLDIER': 'Chiến sĩ',
  'OFFICER': 'Sĩ quan',
  'PROFESSIONAL': 'Chuyên nghiệp'
};

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userForm, setUserForm] = useState<UserCreationRequest>({
    fullName: '',
    gender: 'MALE',
    dob: '',
    type: 'SOLDIER',
    mail: '',
    phoneNumber: '',
    hometown: '',
  });

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await userService.getAllUsers(token);
      const transformedUsers: User[] = fetchedUsers.map(user => ({
        userId: user.userId,
        username: user.username,
        fullName: user.fullName || '',
        dob: user.dob,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        mail: user.mail,
        hometown: user.hometown,
        role: user.role,
        type: user.type || 'Không xác định'
      }));
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setIsCreating(true);
    try {
      // Map UI type values to API type values before sending request
      const requestData = {
        ...userForm,
        type: USER_TYPES[userForm.type as keyof typeof USER_TYPES] as string
      };
      
      const createdUser = await userService.createUser(token, requestData);
      const newUser: User = {
        userId: createdUser.userId,
        username: createdUser.username,
        fullName: createdUser.fullName || '',
        dob: createdUser.dob,
        gender: createdUser.gender,
        phoneNumber: createdUser.phoneNumber,
        mail: createdUser.mail,
        hometown: createdUser.hometown,
        role: createdUser.role,
        type: createdUser.type || 'Không xác định'
      };
      setUsers(prev => [...prev, newUser]);
      toast.success('Tạo người dùng thành công');
      setShowCreateDialog(false);
      resetUserForm();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Không thể tạo người dùng');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSelectedUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Hãy chọn ít nhất một người dùng để xóa');
      return;
    }

    try {
      setIsDeleting(true);
      await userService.deleteMultipleUsers(token, selectedUsers);
      toast.success('Xóa người dùng thành công');
      fetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error deleting users:', error);
      toast.error('Không thể xóa người dùng');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetUserForm = () => {
    setUserForm({
      fullName: '',
      gender: 'MALE',
      dob: '',
      type: 'SOLDIER',
      mail: '',
      phoneNumber: '',
      hometown: '',
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8080/exam/user/many', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();

      if (data.statusCode === 0) {
        toast.success(`Đã tải lên ${file.name} thành công`);
        fetchUsers();
      } else {
        toast.error(`Lỗi khi tải lên: ${data.message}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Không thể tải lên file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const toggleUserSelection = (username: string) => {
    setSelectedUsers(prev => 
      prev.includes(username)
        ? prev.filter(u => u !== username)
        : [...prev, username]
    );
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
          <Button variant="outline" onClick={handleUploadClick}>
            <Upload className="h-4 w-4 mr-2" />
            Tải lên
          </Button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload} 
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Tìm kiếm người dùng..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {selectedUsers.length > 0 && (
          <Button variant="destructive" onClick={handleDeleteSelectedUsers} disabled={isDeleting}>
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Đang xóa...' : `Xóa (${selectedUsers.length})`}
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-center py-10">Đang tải...</p>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Không có người dùng</h3>
          <p className="text-gray-500 mb-6">Hãy thêm người dùng mới để bắt đầu</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>
      ) : (
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
              {filteredUsers.map(user => (
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
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDetailDialog(true);
                      }}
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
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
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
                <Select onValueChange={handleGenderChange}>
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
                <Select onValueChange={handleTypeChange}>
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
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              resetUserForm();
            }}>
              Hủy
            </Button>
            <Button onClick={handleCreateUser} disabled={isCreating}>
              {isCreating ? 'Đang tạo...' : 'Tạo người dùng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedUser && (
        <UserDetailDialog
          user={selectedUser}
          isOpen={showDetailDialog}
          onClose={() => setShowDetailDialog(false)}
          onUserUpdated={fetchUsers}
          token={token}
        />
      )}
    </div>
  );
};

export default UserManagementPage;

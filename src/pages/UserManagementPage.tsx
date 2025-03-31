import React, { useState, useEffect } from 'react';
import { userService, User, UserCreationRequest, UserUpdateRequest } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, User as UserIcon, Eye } from 'lucide-react';
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

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userForm, setUserForm] = useState<UserCreationRequest>({
    fullName: '',
    gender: 'MALE',
    dob: '',
    type: 'Chiến sĩ',
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
      setUsers(fetchedUsers);
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
      const createdUser = await userService.createUser(token, userForm);
      setUsers(prev => [...prev, createdUser]);
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

  const handleUpdateUser = async (username: string, userData: UserUpdateRequest) => {
    setIsUpdating(true);
    try {
      const updatedUser = await userService.updateUser(token, username, userData);
      setUsers(prev => prev.map(user => user.username === username ? updatedUser : user));
      toast.success('Cập nhật người dùng thành công');
      setShowEditDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Không thể cập nhật người dùng');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await userService.deleteUser(token, userId.toString());
      toast.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Không thể xóa người dùng');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const resetUserForm = () => {
    setUserForm({
      fullName: '',
      gender: 'MALE',
      dob: '',
      type: 'Chiến sĩ',
      mail: '',
      phoneNumber: '',
      hometown: '',
    });
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
      type: type as "Chiến sĩ" | "Sĩ quan" | "Chuyên nghiệp"
    }));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
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
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{new Date(user.dob).toLocaleDateString()}</TableCell>
                  <TableCell>{user.mail || '-'}</TableCell>
                  <TableCell>{user.phoneNumber || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDetailDialog(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Chi tiết
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
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
                  type="date"
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
                    <SelectItem value="Chiến sĩ">Chiến sĩ</SelectItem>
                    <SelectItem value="Sĩ quan">Sĩ quan</SelectItem>
                    <SelectItem value="Chuyên nghiệp">Chuyên nghiệp</SelectItem>
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
        <EditUserDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          user={selectedUser}
          onUpdate={handleUpdateUser}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedUser(null);
          }}
          isUpdating={isUpdating}
        />
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedUser) {
                  handleDeleteUser(selectedUser.userId);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa người dùng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedUser && (
        <UserDetailDialog
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          user={selectedUser!}
          onClose={() => setShowDetailDialog(false)}
        />
      )}
    </div>
  );
};

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (username: string, userData: UserUpdateRequest) => void;
  onClose: () => void;
  isUpdating: boolean;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, open, onOpenChange, onUpdate, onClose, isUpdating }) => {
  const [editForm, setEditForm] = useState<UserUpdateRequest>({
    gender: user.gender,
    dob: user.dob,
    type: user.type,
    mail: user.mail || '',
    phoneNumber: user.phoneNumber || '',
    hometown: user.hometown || '',
  });

  const handleGenderChange = (gender: string) => {
    setEditForm((prev) => ({
      ...prev,
      gender: gender as "MALE" | "FEMALE" | "OTHER"
    }));
  };

  const handleTypeChange = (type: string) => {
    setEditForm((prev) => ({
      ...prev,
      type: type as "Chiến sĩ" | "Sĩ quan" | "Chuyên nghiệp"
    }));
  };

  const handleSubmit = () => {
    onUpdate(user.username, editForm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin người dùng.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Giới tính
            </Label>
            <div className="col-span-3">
              <Select onValueChange={handleGenderChange} defaultValue={editForm.gender}>
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
                type="date"
                value={editForm.dob}
                onChange={(e) => setEditForm(prev => ({ ...prev, dob: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Loại
            </Label>
            <div className="col-span-3">
              <Select onValueChange={handleTypeChange} defaultValue={editForm.type}>
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
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mail" className="text-right">
              Email
            </Label>
            <div className="col-span-3">
              <Input
                id="mail"
                type="email"
                value={editForm.mail || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, mail: e.target.value }))}
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
                value={editForm.phoneNumber || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
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
                value={editForm.hometown || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, hometown: e.target.value }))}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isUpdating}>
            {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface UserDetailDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

const UserDetailDialog: React.FC<UserDetailDialogProps> = ({ user, open, onOpenChange, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thông tin chi tiết</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về người dùng.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Họ và tên</Label>
            <div className="col-span-3 font-medium">{user.fullName}</div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Tên đăng nhập</Label>
            <div className="col-span-3 font-medium">{user.username}</div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Giới tính</Label>
            <div className="col-span-3 font-medium">{user.gender}</div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Ngày sinh</Label>
            <div className="col-span-3 font-medium">{new Date(user.dob).toLocaleDateString()}</div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Loại</Label>
            <div className="col-span-3 font-medium">{user.type}</div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Email</Label>
            <div className="col-span-3 font-medium">{user.mail || '-'}</div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Số điện thoại</Label>
            <div className="col-span-3 font-medium">{user.phoneNumber || '-'}</div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Quê quán</Label>
            <div className="col-span-3 font-medium">{user.hometown || '-'}</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementPage;

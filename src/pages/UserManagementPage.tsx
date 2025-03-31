import React, { useState, useEffect } from 'react';
import { userService, User, UserCreationRequest } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserDetailDialog from '@/components/UserDetailDialog';

interface UserForm extends UserCreationRequest { }

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [showUserDetailDialog, setShowUserDetailDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newUser, setNewUser] = useState<UserForm>({
    fullName: '',
    dob: '',
    gender: 'MALE',
    type: 'Chiến sĩ',
    phoneNumber: '',
    mail: '',
    hometown: ''
  });

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.getAllUsers(token);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Không thể tải danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleCreateUser = async () => {
    if (!newUser.fullName || !newUser.dob || !newUser.gender || !newUser.type) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    setIsCreating(true);
    try {
      const userData: UserCreationRequest = {
        fullName: newUser.fullName,
        dob: newUser.dob,
        gender: newUser.gender as "MALE" | "FEMALE" | "OTHER",
        type: newUser.type as "Chiến sĩ" | "Sĩ quan" | "Chuyên nghiệp",
        phoneNumber: newUser.phoneNumber,
        mail: newUser.mail,
        hometown: newUser.hometown
      };
      
      const createdUser = await userService.createUser(token, userData);
      setUsers(prev => [...prev, createdUser]);
      toast.success('Tạo người dùng thành công');
      setShowCreateDialog(false);
      resetNewUser();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Không thể tạo người dùng');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;

    setIsDeleting(true);
    try {
      await userService.deleteUser(token, selectedUserId);
      setUsers(prev => prev.filter(user => user.userId !== selectedUserId));
      toast.success('Xóa người dùng thành công');
      setShowDeleteDialog(false);
    } catch (error) {
      console.error(`Error deleting user ${selectedUserId}:`, error);
      toast.error('Không thể xóa người dùng');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowUserDetail = (user: User) => {
    setUserDetail(user);
    setShowUserDetailDialog(true);
  };

  const handleCloseUserDetail = () => {
    setShowUserDetailDialog(false);
    setUserDetail(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const resetNewUser = () => {
    setNewUser({
      fullName: '',
      dob: '',
      gender: 'MALE',
      type: 'Chiến sĩ',
      phoneNumber: '',
      mail: '',
      hometown: ''
    });
  };

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo người dùng mới
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc tên đăng nhập..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center py-10">Đang tải...</p>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Không có người dùng</h3>
          <p className="text-gray-500 mb-6">Không tìm thấy người dùng phù hợp với tìm kiếm của bạn.</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo người dùng mới
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.userId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleShowUserDetail(user)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Chi tiết
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => {
                        setSelectedUserId(user.userId);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                  name="fullName"
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  className="mt-1"
                />
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
                  name="dob"
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Giới tính
              </Label>
              <div className="col-span-3">
                <Select onValueChange={(value) => setNewUser(prev => ({ ...prev, gender: value }))}>
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
              <Label htmlFor="type" className="text-right">
                Loại
              </Label>
              <div className="col-span-3">
                <Select onValueChange={(value) => setNewUser(prev => ({ ...prev, type: value }))}>
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
              <Label htmlFor="phoneNumber" className="text-right">
                Số điện thoại
              </Label>
              <div className="col-span-3">
                <Input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  className="mt-1"
                />
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
                  name="mail"
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ email"
                  className="mt-1"
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
                  name="hometown"
                  onChange={handleInputChange}
                  placeholder="Nhập quê quán"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              resetNewUser();
            }}>
              Hủy
            </Button>
            <Button onClick={handleCreateUser} disabled={isCreating}>
              {isCreating ? 'Đang tạo...' : 'Tạo người dùng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa người dùng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {userDetail && (
        <UserDetailDialog
          open={showUserDetailDialog}
          onOpenChange={setShowUserDetailDialog}
          user={userDetail}
          onClose={handleCloseUserDetail}
        />
      )}
    </div>
  );
};

export default UserManagementPage;

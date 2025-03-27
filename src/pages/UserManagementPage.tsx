
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Search, Download, UserPlus, LogOut, Trash2, Edit, Loader2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { userService, User, UserCreationRequest } from '@/services/userService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import UserDetailDialog from '@/components/UserDetailDialog';

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<UserCreationRequest>({
    fullName: '',
    dob: '',
    gender: '',
    phoneNumber: '',
    mail: '',
    unit: '',
    hometown: ''
  });
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    const token = sessionStorage.getItem('authToken');
    
    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        setAuthToken(token);
        fetchUsers(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchUsers = async (token: string) => {
    setIsLoading(true);
    try {
      const data = await userService.getAllUsers(token);
      // Ensure all user objects have the required properties
      const validatedUsers = data.map(user => ({
        ...user,
        fullName: user.fullName || '',
        username: user.username || '',
        role: user.role || 'USER',
        dob: user.dob || ''
      }));
      setUsers(validatedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!authToken) return;
    
    // Validate required fields
    if (!newUser.fullName || !newUser.dob) {
      toast.error('Họ và tên và ngày sinh là bắt buộc');
      return;
    }
    
    // Validate date format (DD/MM/YYYY)
    if (!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(newUser.dob)) {
      toast.error('Ngày sinh phải có định dạng DD/MM/YYYY');
      return;
    }
    
    try {
      const result = await userService.createUser(authToken, newUser);
      if (result) {
        fetchUsers(authToken);
        setIsAddDialogOpen(false);
        setNewUser({
          fullName: '',
          dob: '',
          gender: '',
          phoneNumber: '',
          mail: '',
          unit: '',
          hometown: ''
        });
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleUserUpdated = () => {
    if (authToken) {
      fetchUsers(authToken);
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (!authToken) return;
    
    try {
      const result = await userService.deleteUser(authToken, username);
      if (result) {
        fetchUsers(authToken);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailDialogOpen(true);
  };

  const handleFileUpload = async () => {
    if (!authToken || !fileUpload) {
      toast.error('Vui lòng chọn file Excel');
      return;
    }
    
    setIsUploading(true);
    try {
      const result = await userService.uploadUsersExcel(authToken, fileUpload);
      if (result) {
        fetchUsers(authToken);
        setFileUpload(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    ((user.dob?.toLowerCase() || '')).includes(searchTerm.toLowerCase())
  );

  if (!currentUser) return <div>Đang tải...</div>;
  
  if (currentUser.role !== 'ADMIN' && currentUser.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <header className="bg-military-red shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Quản lý người dùng</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-white text-military-red hover:bg-gray-100">
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </header>
    
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin-home')}>
              Quay lại
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-military-red hover:bg-military-dark-red">
                  <UserPlus size={16} />
                  Thêm người dùng
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Thêm người dùng mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin để tạo tài khoản người dùng mới.
                    Họ và tên và ngày sinh là bắt buộc.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fullName" className="text-right">
                      Họ và tên *
                    </Label>
                    <Input
                      id="fullName"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dob" className="text-right">
                      Ngày sinh *
                    </Label>
                    <Input
                      id="dob"
                      value={newUser.dob}
                      onChange={(e) => setNewUser({...newUser, dob: e.target.value})}
                      placeholder="DD/MM/YYYY"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gender" className="text-right">
                      Giới tính
                    </Label>
                    <Input
                      id="gender"
                      value={newUser.gender}
                      onChange={(e) => setNewUser({...newUser, gender: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phoneNumber" className="text-right">
                      Số điện thoại
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={newUser.phoneNumber}
                      onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mail" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="mail"
                      type="email"
                      value={newUser.mail}
                      onChange={(e) => setNewUser({...newUser, mail: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="unit" className="text-right">
                      Đơn vị
                    </Label>
                    <Input
                      id="unit"
                      value={newUser.unit}
                      onChange={(e) => setNewUser({...newUser, unit: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="hometown" className="text-right">
                      Quê quán
                    </Label>
                    <Input
                      id="hometown"
                      value={newUser.hometown}
                      onChange={(e) => setNewUser({...newUser, hometown: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Hủy</Button>
                  <Button onClick={handleAddUser}>Thêm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Tải lên</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2">
                  <Label htmlFor="file-upload" className="mb-2 block">Chọn file Excel</Label>
                  <Input 
                    id="file-upload" 
                    type="file" 
                    accept=".xlsx,.xls" 
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setFileUpload(files[0]);
                      }
                    }}
                  />
                  <Button 
                    className="w-full mt-2" 
                    onClick={handleFileUpload}
                    disabled={isUploading || !fileUpload}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tải lên...
                      </>
                    ) : 'Tải lên'}
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Xuất danh sách (Excel)
            </Button>
          </div>

          {isLoading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-military-red" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-military-red bg-opacity-10">
                    <TableHead className="w-[60px]">STT</TableHead>
                    <TableHead>Họ và tên</TableHead>
                    <TableHead>Tên đăng nhập</TableHead>
                    <TableHead>Ngày sinh</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <TableRow 
                        key={user.username}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleViewUserDetails(user)}
                      >
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.dob || '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'ADMIN' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'ADMIN' ? 'Quản trị viên' : 'Thí sinh'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewUserDetails(user);
                              }}
                            >
                              <Eye size={16} />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-600 hover:bg-red-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc muốn xóa người dùng "{user.fullName}"? 
                                    Hành động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDeleteUser(user.username)}
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                        Không tìm thấy người dùng nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* User Detail Dialog */}
      <UserDetailDialog
        user={selectedUser}
        isOpen={isDetailDialogOpen}
        onClose={() => {
          setIsDetailDialogOpen(false);
          setSelectedUser(null);
        }}
        onUserUpdated={handleUserUpdated}
        token={authToken || ''}
      />
    </div>
  );
};

export default UserManagementPage;

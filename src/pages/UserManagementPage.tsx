
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { userService, User, UserCreationRequest } from '@/services/userService';
import { toast } from "sonner";
import { UserDetailDialog } from '@/components/UserDetailDialog';
import { Trash2, Eye, Search, Upload, UserPlus } from "lucide-react";

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newUser, setNewUser] = useState<UserCreationRequest>({
    fullName: '',
    dob: '',
    gender: 'MALE', // Default value to avoid type error
    type: 'Chiến sĩ', // Default value
    phoneNumber: '',
    mail: '',
    hometown: '',
  });
  
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    setLoading(true);
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

  const handleViewUser = async (username: string) => {
    try {
      const user = await userService.getUserByUsername(token, username);
      if (user) {
        setSelectedUser(user);
        setShowDetailDialog(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Không thể tải thông tin người dùng');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const success = await userService.deleteUser(token, userToDelete);
      if (success) {
        setUsers(users.filter(user => user.username !== userToDelete));
        setUserToDelete(null);
        setDeleteConfirmOpen(false);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Không thể xóa người dùng');
    }
  };

  const handleDeleteClick = (username: string) => {
    setUserToDelete(username);
    setDeleteConfirmOpen(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const uploadedUsers = await userService.uploadUsersExcel(token, file);
      if (uploadedUsers && uploadedUsers.length > 0) {
        fetchUsers();  // Refresh the users list
      }
    } catch (error) {
      console.error('Error uploading Excel file:', error);
      toast.error('Không thể tải lên tệp Excel');
    } finally {
      // Reset the input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    // Ensure value is one of the allowed gender types
    const gender = (value === 'MALE' || value === 'FEMALE' || value === 'OTHER') 
      ? value 
      : 'MALE'; // Default to MALE if invalid value
    
    setNewUser(prev => ({ ...prev, gender }));
  };

  const handleTypeChange = (value: string) => {
    setNewUser(prev => ({ ...prev, type: value }));
  };

  const handleCreateUser = async () => {
    try {
      const createdUser = await userService.createUser(token, newUser);
      if (createdUser) {
        setUsers([...users, createdUser]);
        setShowCreateDialog(false);
        // Reset form
        setNewUser({
          fullName: '',
          dob: '',
          gender: 'MALE',
          type: 'Chiến sĩ',
          phoneNumber: '',
          mail: '',
          hometown: '',
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Không thể tạo người dùng');
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        <div className="flex space-x-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Thêm người dùng
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo người dùng mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={newUser.fullName}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Ngày sinh (YYYY-MM-DD)</Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={newUser.dob}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Giới tính</Label>
                  <RadioGroup
                    value={newUser.gender}
                    onValueChange={handleGenderChange}
                    className="flex space-x-4 mt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MALE" id="gender-male" />
                      <Label htmlFor="gender-male">Nam</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="FEMALE" id="gender-female" />
                      <Label htmlFor="gender-female">Nữ</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="OTHER" id="gender-other" />
                      <Label htmlFor="gender-other">Khác</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="type">Loại</Label>
                  <Select value={newUser.type} onValueChange={handleTypeChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chiến sĩ">Chiến sĩ</SelectItem>
                      <SelectItem value="Sĩ quan">Sĩ quan</SelectItem>
                      <SelectItem value="Chuyên nghiệp">Chuyên nghiệp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={newUser.phoneNumber || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="mail">Email</Label>
                  <Input
                    id="mail"
                    name="mail"
                    type="email"
                    value={newUser.mail || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="hometown">Quê quán</Label>
                  <Input
                    id="hometown"
                    name="hometown"
                    value={newUser.hometown || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateUser}>Tạo</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={handleUploadClick}>
            <Upload className="mr-2 h-4 w-4" />
            Tải lên Excel
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xls,.xlsx"
            className="hidden"
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Danh sách người dùng</CardTitle>
            <div className="w-1/3 flex items-center bg-background border rounded-md focus-within:ring-1">
              <Search className="ml-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc tên đăng nhập"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border-0 focus-visible:ring-0"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên đăng nhập</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Ngày sinh</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.username}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.dob ? format(new Date(user.dob), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                      <TableCell>
                        {user.gender === 'MALE' ? 'Nam' : 
                         user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                      </TableCell>
                      <TableCell>{user.type}</TableCell>
                      <TableCell>{user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewUser(user.username)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(user.username)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      {searchTerm ? 'Không tìm thấy người dùng nào' : 'Chưa có người dùng nào'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      {selectedUser && (
        <UserDetailDialog
          user={selectedUser}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          onUserUpdated={(updatedUser) => {
            setUsers(users.map(u => u.username === updatedUser.username ? updatedUser : u));
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
          </AlertDialogHeader>
          <p>Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.</p>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagementPage;

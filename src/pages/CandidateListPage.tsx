
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Search, Download, UserPlus, LogOut, Trash2, Loader2, Eye } from 'lucide-react';
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

const CandidateListPage = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<User[]>([]);
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
        fetchCandidates(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchCandidates = async (token: string) => {
    setIsLoading(true);
    try {
      const data = await userService.getCandidates(token);
      // Ensure all user objects have the required properties
      const validatedCandidates = data.map(user => ({
        ...user,
        fullName: user.fullName || '',
        username: user.username || '',
        role: user.role || 'USER',
        dob: user.dob || ''
      }));
      setCandidates(validatedCandidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Không thể tải danh sách thí sinh');
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
        fetchCandidates(authToken);
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
      fetchCandidates(authToken);
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (!authToken) return;
    
    try {
      const result = await userService.deleteUser(authToken, username);
      if (result) {
        fetchCandidates(authToken);
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
        fetchCandidates(authToken);
        setFileUpload(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate =>
    (candidate.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (candidate.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    ((candidate.dob?.toLowerCase() || '')).includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-white">Quản lý thí sinh</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-white text-military-red hover:bg-gray-100">
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </header>
    
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-military-red hover:bg-military-dark-red">
                  <UserPlus size={16} />
                  Thêm thí sinh
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Thêm thí sinh mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin để tạo tài khoản thí sinh mới.
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
                placeholder="Tìm kiếm thí sinh..."
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
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((candidate, index) => (
                      <TableRow 
                        key={candidate.username}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleViewUserDetails(candidate)}
                      >
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{candidate.fullName}</TableCell>
                        <TableCell>{candidate.username}</TableCell>
                        <TableCell>{candidate.dob || '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            candidate.role === 'ADMIN' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {candidate.role === 'ADMIN' ? 'Quản trị viên' : 'Thí sinh'}
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
                                handleViewUserDetails(candidate);
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
                                  <AlertDialogTitle>Xác nhận xóa thí sinh</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc muốn xóa thí sinh "{candidate.fullName}"? 
                                    Hành động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDeleteUser(candidate.username)}
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
                        Không tìm thấy thí sinh nào
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

export default CandidateListPage;

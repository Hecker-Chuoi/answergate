
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { userService, User, UserCreationRequest } from '@/services/userService';
import { sessionService } from '@/services/sessionService';
import { toast } from "sonner";
import { Eye, Trash2, UserPlus, CheckCircle2, Users, Filter } from "lucide-react";

const CandidateListPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddUserDialog, setShowAddUserDialog] = useState<boolean>(false);
  const [showAddByTypeDialog, setShowAddByTypeDialog] = useState<boolean>(false);
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // New user form state
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
  const sessionId = Number(id);

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!sessionId) return;
      
      setLoading(true);
      try {
        const candidates = await sessionService.getSessionCandidates(token, sessionId);
        setCandidates(candidates);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        toast.error('Không thể tải danh sách thí sinh');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [sessionId, token]);

  const fetchAllUsers = async () => {
    try {
      const fetchedUsers = await userService.getAllUsers(token);
      setUsers(fetchedUsers.filter(user => user.role === 'USER'));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUserSelection = (username: string) => {
    setSelectedUsernames(prev => 
      prev.includes(username) ? prev.filter(u => u !== username) : [...prev, username]
    );
  };

  const handleTypeSelection = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const assignCandidatesByUsernames = async () => {
    if (!selectedUsernames.length) {
      toast.warning('Vui lòng chọn ít nhất một người dùng');
      return;
    }

    try {
      await sessionService.assignCandidatesByUsernames(token, sessionId, selectedUsernames);
      toast.success('Thêm thí sinh thành công');
      // Refresh candidate list
      const updatedCandidates = await sessionService.getSessionCandidates(token, sessionId);
      setCandidates(updatedCandidates);
      setShowAddUserDialog(false);
      setSelectedUsernames([]);
    } catch (error) {
      console.error('Error assigning candidates:', error);
      toast.error('Không thể thêm thí sinh');
    }
  };

  const assignCandidatesByTypes = async () => {
    if (!selectedTypes.length) {
      toast.warning('Vui lòng chọn ít nhất một loại người dùng');
      return;
    }

    try {
      await sessionService.assignCandidatesByTypes(token, sessionId, selectedTypes);
      toast.success('Thêm thí sinh thành công');
      // Refresh candidate list
      const updatedCandidates = await sessionService.getSessionCandidates(token, sessionId);
      setCandidates(updatedCandidates);
      setShowAddByTypeDialog(false);
      setSelectedTypes([]);
    } catch (error) {
      console.error('Error assigning candidates by type:', error);
      toast.error('Không thể thêm thí sinh theo loại');
    }
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
        toast.success('Tạo người dùng thành công');
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
        // Refresh user list
        fetchAllUsers();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Không thể tạo người dùng');
    }
  };

  const filteredCandidates = candidates.filter(candidate => 
    candidate.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nonCandidateUsers = users.filter(
    user => !candidates.some(candidate => candidate.username === user.username)
  );

  const filteredUsers = nonCandidateUsers.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Danh sách thí sinh</h1>
        <div className="flex space-x-2">
          <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
            <DialogTrigger asChild>
              <Button onClick={fetchAllUsers} variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Thêm thí sinh
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Thêm thí sinh</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex space-x-2 mb-4">
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc tên đăng nhập"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="flex-1"
                  />
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Người dùng hiện có:</h3>
                  <div className="max-h-60 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10"></TableHead>
                          <TableHead>Tên đăng nhập</TableHead>
                          <TableHead>Họ tên</TableHead>
                          <TableHead>Loại</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.username} className="cursor-pointer"
                            onClick={() => handleUserSelection(user.username)}>
                            <TableCell>
                              <div className={`w-5 h-5 rounded-full border ${
                                selectedUsernames.includes(user.username) 
                                  ? 'bg-primary border-primary' 
                                  : 'border-gray-300'
                              } flex items-center justify-center`}>
                                {selectedUsernames.includes(user.username) && (
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.fullName}</TableCell>
                            <TableCell>{user.type}</TableCell>
                          </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              Không tìm thấy người dùng nào
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={assignCandidatesByUsernames} disabled={selectedUsernames.length === 0}>
                  Thêm ({selectedUsernames.length})
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAddByTypeDialog} onOpenChange={setShowAddByTypeDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Thêm theo loại
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm thí sinh theo loại</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="type-soldier"
                    checked={selectedTypes.includes('Chiến sĩ')}
                    onChange={() => handleTypeSelection('Chiến sĩ')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="type-soldier">Chiến sĩ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="type-officer"
                    checked={selectedTypes.includes('Sĩ quan')}
                    onChange={() => handleTypeSelection('Sĩ quan')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="type-officer">Sĩ quan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="type-pro"
                    checked={selectedTypes.includes('Chuyên nghiệp')}
                    onChange={() => handleTypeSelection('Chuyên nghiệp')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="type-pro">Chuyên nghiệp</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddByTypeDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={assignCandidatesByTypes} disabled={selectedTypes.length === 0}>
                  Thêm
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Danh sách thí sinh</CardTitle>
            <div className="w-1/3">
              <Input
                placeholder="Tìm kiếm theo tên hoặc tên đăng nhập"
                value={searchTerm}
                onChange={handleSearchChange}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.username}>
                      <TableCell>{candidate.username}</TableCell>
                      <TableCell>{candidate.fullName}</TableCell>
                      <TableCell>{candidate.dob ? format(new Date(candidate.dob), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                      <TableCell>
                        {candidate.gender === 'MALE' ? 'Nam' : 
                         candidate.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                      </TableCell>
                      <TableCell>{candidate.type}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      {searchTerm ? 'Không tìm thấy thí sinh nào' : 'Chưa có thí sinh nào'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateListPage;

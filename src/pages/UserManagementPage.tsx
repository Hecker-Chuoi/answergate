
import React, { useState, useEffect, useRef } from 'react';
import { userService, User, UserCreationRequest } from '@/services/userService';
import { toast } from 'sonner';
import UserTable from '@/components/UserTable';
import UserCreateDialog from '@/components/UserCreateDialog';
import UserSearchBar from '@/components/UserSearchBar';
import UserDetailDialog from '@/components/UserDetailDialog';
import { mapTypeToApi } from '@/utils/userTypeMapping';

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

  const handleCreateUser = async (userData: UserCreationRequest) => {
    setIsCreating(true);
    try {
      // Map UI type values to API type values before sending request
      const createdUser = await userService.createUser(token, userData);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await userService.createUsers(token, file);
      toast.success(`Đã tải lên ${file.name} thành công`);
      fetchUsers();
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

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailDialog(true);
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <UserSearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCount={selectedUsers.length}
        onDelete={handleDeleteSelectedUsers}
        onAdd={() => setShowCreateDialog(true)}
        onUpload={handleUploadClick}
        isDeleting={isDeleting}
      />
      
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload} 
      />
      
      <div className="mt-6">
        <UserTable 
          users={filteredUsers}
          selectedUsers={selectedUsers}
          toggleUserSelection={toggleUserSelection}
          onViewDetails={handleViewDetails}
          loading={loading}
        />
      </div>

      <UserCreateDialog 
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateUser}
        isSubmitting={isCreating}
      />

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

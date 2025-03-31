
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService, User, UserCreationRequest } from '@/services/userService';
import { sessionService } from '@/services/sessionService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Search } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CandidateListPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [candidates, setCandidates] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const token = localStorage.getItem('token') || '';
  
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const fetchedCandidates = await sessionService.getCandidates(token, Number(sessionId));
        setCandidates(fetchedCandidates);
        
        // Also fetch all users for selection
        const allUsers = await userService.getAllUsers(token);
        setAvailableUsers(allUsers);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        toast.error('Không thể tải danh sách thí sinh');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidates();
  }, [sessionId, token]);
  
  const handleAddByUsernames = async () => {
    if (selectedUsernames.length === 0) {
      toast.error('Vui lòng chọn ít nhất một người dùng');
      return;
    }
    
    setIsAdding(true);
    try {
      await sessionService.assignCandidatesByUsernames(token, Number(sessionId), selectedUsernames);
      
      const updatedCandidates = await sessionService.getCandidates(token, Number(sessionId));
      setCandidates(updatedCandidates);
      
      toast.success('Thêm thí sinh thành công');
      setShowAddDialog(false);
      setSelectedUsernames([]);
    } catch (error) {
      console.error('Error adding candidates:', error);
      toast.error('Không thể thêm thí sinh');
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleAddByTypes = async () => {
    if (selectedTypes.length === 0) {
      toast.error('Vui lòng chọn ít nhất một loại');
      return;
    }
    
    setIsAdding(true);
    try {
      await sessionService.assignCandidatesByTypes(token, Number(sessionId), selectedTypes);
      
      const updatedCandidates = await sessionService.getCandidates(token, Number(sessionId));
      setCandidates(updatedCandidates);
      
      toast.success('Thêm thí sinh thành công');
      setShowAddDialog(false);
      setSelectedTypes([]);
    } catch (error) {
      console.error('Error adding candidates by types:', error);
      toast.error('Không thể thêm thí sinh');
    } finally {
      setIsAdding(false);
    }
  };
  
  const toggleUserSelection = (username: string) => {
    setSelectedUsernames(prev => 
      prev.includes(username)
        ? prev.filter(u => u !== username)
        : [...prev, username]
    );
  };
  
  const toggleTypeSelection = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  const filteredUsers = availableUsers.filter(user => 
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const isUserAlreadyCandidate = (username: string) => {
    return candidates.some(candidate => candidate.username === username);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Danh sách thí sinh</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm thí sinh
        </Button>
      </div>
      
      {loading ? (
        <p className="text-center py-10">Đang tải...</p>
      ) : candidates.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Chưa có thí sinh nào</h3>
          <p className="text-gray-500 mb-6">Hãy thêm thí sinh vào phiên thi này</p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm thí sinh
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates.map((candidate) => (
                <tr key={candidate.userId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{candidate.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{candidate.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{candidate.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {candidate.gender === 'MALE' ? 'Nam' : 
                       candidate.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Thêm thí sinh</DialogTitle>
            <DialogDescription>
              Thêm thí sinh vào phiên thi này bằng cách chọn người dùng hoặc theo loại.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">Theo người dùng</TabsTrigger>
              <TabsTrigger value="types">Theo loại</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="border rounded-lg overflow-hidden max-h-80 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">Không tìm thấy người dùng</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chọn</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => {
                        const isAlreadyCandidate = isUserAlreadyCandidate(user.username);
                        
                        return (
                          <tr key={user.userId} className={isAlreadyCandidate ? 'bg-gray-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedUsernames.includes(user.username) || isAlreadyCandidate}
                                onChange={() => toggleUserSelection(user.username)}
                                disabled={isAlreadyCandidate}
                                className="h-4 w-4 text-blue-600 rounded"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.fullName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.type}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="types" className="space-y-4 py-4">
              <div className="space-y-3">
                <Label className="text-base">Chọn loại người dùng</Label>
                <div className="grid grid-cols-3 gap-4">
                  {['Chiến sĩ', 'Sĩ quan', 'Chuyên nghiệp'].map(type => (
                    <div 
                      key={type} 
                      className={`p-4 border rounded-lg cursor-pointer ${
                        selectedTypes.includes(type) ? 'bg-blue-50 border-blue-300' : ''
                      }`}
                      onClick={() => toggleTypeSelection(type)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{type}</span>
                        {selectedTypes.includes(type) && (
                          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setSelectedUsernames([]);
              setSelectedTypes([]);
              setSearchQuery('');
            }}>
              Hủy
            </Button>
            <Button 
              onClick={activeTab === 'users' ? handleAddByUsernames : handleAddByTypes}
              disabled={
                isAdding || 
                (activeTab === 'users' && selectedUsernames.length === 0) || 
                (activeTab === 'types' && selectedTypes.length === 0)
              }
            >
              {isAdding ? 'Đang thêm...' : 'Thêm thí sinh'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidateListPage;

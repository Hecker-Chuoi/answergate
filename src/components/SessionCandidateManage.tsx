
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { sessionService } from '@/services/sessionService';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from '@/services/userService';

interface SessionCandidateManageProps {
  sessionId: number;
  onCandidatesChanged: () => void;
  onCancel: () => void;
}

const SessionCandidateManage: React.FC<SessionCandidateManageProps> = ({
  sessionId,
  onCandidatesChanged,
  onCancel
}) => {
  const [tab, setTab] = useState('types');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [usernames, setUsernames] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const token = localStorage.getItem('token') || '';
  
  const handleTypeSelect = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };
  
  const handleAssignByTypes = async () => {
    if (selectedTypes.length === 0) {
      toast.error('Vui lòng chọn ít nhất một loại');
      return;
    }
    
    setSubmitting(true);
    try {
      await sessionService.assignCandidatesByTypes(token, sessionId, selectedTypes);
      toast.success('Thêm thí sinh theo loại thành công');
      onCandidatesChanged();
    } catch (error) {
      console.error('Error assigning candidates by types:', error);
      toast.error('Không thể thêm thí sinh theo loại');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleAssignByUsernames = async () => {
    const usernameList = usernames
      .split(/[\n,]/)
      .map(username => username.trim())
      .filter(username => username !== '');
    
    if (usernameList.length === 0) {
      toast.error('Vui lòng nhập ít nhất một tên đăng nhập');
      return;
    }
    
    setSubmitting(true);
    try {
      await sessionService.assignCandidatesByUsernames(token, sessionId, usernameList);
      toast.success('Thêm thí sinh theo tên đăng nhập thành công');
      onCandidatesChanged();
    } catch (error) {
      console.error('Error assigning candidates by usernames:', error);
      toast.error('Không thể thêm thí sinh theo tên đăng nhập');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="types" value={tab} onValueChange={setTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="types" className="flex-1">Thêm theo loại</TabsTrigger>
          <TabsTrigger value="custom" className="flex-1">Thêm tùy chỉnh</TabsTrigger>
        </TabsList>
        
        <TabsContent value="types">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Chọn loại thí sinh</Label>
              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="type-soldier"
                    checked={selectedTypes.includes('Chiến sĩ')}
                    onCheckedChange={() => handleTypeSelect('Chiến sĩ')}
                  />
                  <Label htmlFor="type-soldier" className="cursor-pointer">Chiến sĩ</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="type-officer"
                    checked={selectedTypes.includes('Sĩ quan')}
                    onCheckedChange={() => handleTypeSelect('Sĩ quan')}
                  />
                  <Label htmlFor="type-officer" className="cursor-pointer">Sĩ quan</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="type-pro"
                    checked={selectedTypes.includes('Chuyên nghiệp')}
                    onCheckedChange={() => handleTypeSelect('Chuyên nghiệp')}
                  />
                  <Label htmlFor="type-pro" className="cursor-pointer">Chuyên nghiệp</Label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={onCancel}>
                Hủy bỏ
              </Button>
              <Button 
                onClick={handleAssignByTypes}
                disabled={selectedTypes.length === 0 || submitting}
              >
                {submitting ? 'Đang thêm...' : 'Thêm thí sinh'}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="custom">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usernames">Danh sách tên đăng nhập</Label>
              <p className="text-sm text-gray-500">Nhập tên đăng nhập, mỗi tên trên một dòng hoặc cách nhau bởi dấu phẩy.</p>
              <textarea
                id="usernames"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[150px]"
                placeholder="username1&#10;username2&#10;username3"
                value={usernames}
                onChange={(e) => setUsernames(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={onCancel}>
                Hủy bỏ
              </Button>
              <Button 
                onClick={handleAssignByUsernames}
                disabled={!usernames.trim() || submitting}
              >
                {submitting ? 'Đang thêm...' : 'Thêm thí sinh'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionCandidateManage;


import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Trash2, Plus, Upload } from 'lucide-react';

interface UserSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onDelete: () => void;
  onAdd: () => void;
  onUpload: () => void;
  isDeleting: boolean;
}

const UserSearchBar = ({
  searchTerm,
  onSearchChange,
  selectedCount,
  onDelete,
  onAdd,
  onUpload,
  isDeleting
}: UserSearchBarProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <div className="flex space-x-2">
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
          <Button variant="outline" onClick={onUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Tải lên
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Tìm kiếm người dùng..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {selectedCount > 0 && (
          <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Đang xóa...' : `Xóa (${selectedCount})`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserSearchBar;

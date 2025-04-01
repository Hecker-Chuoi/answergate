
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sessionService } from '@/services/sessionService';
import { toast } from 'sonner';

interface SessionCandidateManageByTypeProps {
  sessionId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const SessionCandidateManageByType: React.FC<SessionCandidateManageByTypeProps> = ({
  sessionId,
  onSuccess,
  onCancel
}) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleToggleType = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTypes.length === 0) {
      toast.error('Vui lòng chọn ít nhất một loại quân nhân');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      await sessionService.assignCandidatesByTypes(token, sessionId, selectedTypes);
      toast.success('Đã gán thí sinh thành công');
      onSuccess();
    } catch (error) {
      console.error('Error assigning candidates by type:', error);
      toast.error('Không thể gán thí sinh');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Chọn loại quân nhân</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button
            type="button"
            variant={selectedTypes.includes('Chiến sĩ') ? 'default' : 'outline'}
            className="justify-start"
            onClick={() => handleToggleType('Chiến sĩ')}
          >
            {selectedTypes.includes('Chiến sĩ') && (
              <Check className="mr-2 h-4 w-4" />
            )}
            Chiến sĩ
          </Button>
          <Button
            type="button"
            variant={selectedTypes.includes('Sĩ quan') ? 'default' : 'outline'}
            className="justify-start"
            onClick={() => handleToggleType('Sĩ quan')}
          >
            {selectedTypes.includes('Sĩ quan') && (
              <Check className="mr-2 h-4 w-4" />
            )}
            Sĩ quan
          </Button>
          <Button
            type="button"
            variant={selectedTypes.includes('Chuyên nghiệp') ? 'default' : 'outline'}
            className="justify-start"
            onClick={() => handleToggleType('Chuyên nghiệp')}
          >
            {selectedTypes.includes('Chuyên nghiệp') && (
              <Check className="mr-2 h-4 w-4" />
            )}
            Chuyên nghiệp
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={submitting || selectedTypes.length === 0}>
          {submitting ? 'Đang xử lý...' : 'Xác nhận'}
        </Button>
      </div>
    </form>
  );
};

export default SessionCandidateManageByType;

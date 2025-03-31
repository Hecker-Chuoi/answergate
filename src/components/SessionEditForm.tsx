
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sessionService, SessionResponse, SessionUpdateRequest } from '@/services/sessionService';
import { toast } from 'sonner';

interface SessionEditFormProps {
  session: SessionResponse;
  onUpdate: (updatedSession: SessionResponse) => void;
  onCancel: () => void;
}

const SessionEditForm: React.FC<SessionEditFormProps> = ({ session, onUpdate, onCancel }) => {
  const [updateData, setUpdateData] = useState<SessionUpdateRequest>({
    startTime: session.startTime ? new Date(session.startTime).toISOString().slice(0, 16) : '',
    timeLimit: session.timeLimit
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('token') || '';
    
    try {
      const updatedSession = await sessionService.updateSession(
        token, 
        session.sessionId, 
        updateData
      );
      
      toast.success('Cập nhật phiên thi thành công');
      onUpdate(updatedSession);
    } catch (error) {
      console.error('Error updating session:', error);
      toast.error('Không thể cập nhật phiên thi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="startTime">Thời gian bắt đầu</Label>
        <Input
          id="startTime"
          type="datetime-local"
          value={updateData.startTime}
          onChange={(e) => setUpdateData(prev => ({ ...prev, startTime: e.target.value }))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="timeLimit">Thời gian làm bài</Label>
        <Select
          value={updateData.timeLimit}
          onValueChange={(value) => setUpdateData(prev => ({ ...prev, timeLimit: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PT0H30M">30 phút</SelectItem>
            <SelectItem value="PT1H00M">1 giờ</SelectItem>
            <SelectItem value="PT1H30M">1 giờ 30 phút</SelectItem>
            <SelectItem value="PT2H00M">2 giờ</SelectItem>
            <SelectItem value="PT2H30M">2 giờ 30 phút</SelectItem>
            <SelectItem value="PT3H00M">3 giờ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Hủy bỏ
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
      </div>
    </form>
  );
};

export default SessionEditForm;

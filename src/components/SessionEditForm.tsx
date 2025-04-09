
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sessionService, SessionResponse, SessionUpdateRequest } from '@/services/sessionService';
import { toast } from 'sonner';
import { format, parse } from 'date-fns';
import { vi } from 'date-fns/locale';

interface SessionEditFormProps {
  session: SessionResponse;
  onUpdate: (updatedSession: SessionResponse) => void;
  onCancel: () => void;
}

const SessionEditForm: React.FC<SessionEditFormProps> = ({ session, onUpdate, onCancel }) => {
  // Convert ISO timestamp to dd/MM/yyyy HH:mm format for display
  const formatStartTimeForDisplay = (isoString: string): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Parse duration from PT format to minutes
  const parseDurationToMinutes = (duration: string): string => {
    if (!duration) return '';
    
    // Handle both PT format and direct minute values
    if (duration.startsWith('PT')) {
      // Parse ISO 8601 duration like PT2H30M
      const hoursMatch = duration.match(/(\d+)H/);
      const minutesMatch = duration.match(/(\d+)M/);
      
      const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
      const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
      
      return String(hours * 60 + minutes);
    }
    
    return duration;
  };

  // Convert minutes to PT format for API
  const formatMinutesToDuration = (minutes: string): string => {
    if (!minutes || isNaN(Number(minutes))) return '';
    
    const mins = parseInt(minutes, 10);
    const hours = Math.floor(mins / 60);
    const remainingMinutes = mins % 60;
    
    let result = 'PT';
    if (hours > 0) {
      result += `${hours}H`;
    }
    if (remainingMinutes > 0 || hours === 0) {
      result += `${remainingMinutes}M`;
    }
    
    return result;
  };

  const [updateData, setUpdateData] = useState<{
    startTime: string;
    timeLimit: string;
  }>({
    startTime: formatStartTimeForDisplay(session.startTime),
    timeLimit: parseDurationToMinutes(session.timeLimit)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!updateData.startTime) {
      toast.error('Vui lòng nhập thời gian bắt đầu');
      return;
    }
    
    if (!updateData.timeLimit) {
      toast.error('Vui lòng nhập thời gian làm bài');
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('token') || '';
    
    try {
      // Parse the display date format back to ISO format for API
      let formattedStartTime;
      try {
        const parsedDate = parse(updateData.startTime, 'dd/MM/yyyy HH:mm', new Date());
        formattedStartTime = parsedDate.toISOString();
      } catch (error) {
        toast.error('Định dạng thời gian không hợp lệ. Vui lòng sử dụng dd/MM/yyyy HH:mm');
        setIsSubmitting(false);
        return;
      }
      
      // Convert minutes to PT format
      const formattedTimeLimit = formatMinutesToDuration(updateData.timeLimit);
      
      const updatedSession = await sessionService.updateSession(
        token, 
        session.sessionId, 
        {
          startTime: formattedStartTime,
          timeLimit: formattedTimeLimit
        }
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

  // Available time options in minutes
  const timeOptions = [
    { value: '30', label: '30 phút' },
    { value: '60', label: '1 giờ' },
    { value: '90', label: '1 giờ 30 phút' },
    { value: '120', label: '2 giờ' },
    { value: '150', label: '2 giờ 30 phút' },
    { value: '180', label: '3 giờ' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="startTime">Thời gian bắt đầu</Label>
        <Input
          id="startTime"
          type="text"
          placeholder="dd/MM/yyyy HH:mm"
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
            {timeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
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


import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamTimerProps {
  endTime: Date;
  onTimeUp: () => void;
}

const ExamTimer: React.FC<ExamTimerProps> = ({ endTime, onTimeUp }) => {
  const [remaining, setRemaining] = useState<number>(0);
  const [isWarning, setIsWarning] = useState<boolean>(false);
  const [isDanger, setIsDanger] = useState<boolean>(false);

  useEffect(() => {
    const calculateRemaining = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      return Math.max(0, Math.floor(diff / 1000));
    };

    const updateTimer = () => {
      const remainingTime = calculateRemaining();
      setRemaining(remainingTime);
      
      // Set warning state when 5 minutes remain
      setIsWarning(remainingTime <= 300 && remainingTime > 60);
      
      // Set danger state when 1 minute remains
      setIsDanger(remainingTime <= 60 && remainingTime > 0);
      
      // Call onTimeUp when time is up
      if (remainingTime === 0) {
        onTimeUp();
      }
    };

    // Initial update
    updateTimer();
    
    // Set up interval
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [endTime, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    
    if (hrs > 0) {
      parts.push(hrs.toString().padStart(2, '0'));
    }
    
    parts.push(mins.toString().padStart(2, '0'));
    parts.push(secs.toString().padStart(2, '0'));
    
    return parts.join(':');
  };

  return (
    <div className={cn(
      "flex items-center space-x-2 rounded-full px-4 py-2 bg-white/90 shadow-sm border",
      isWarning && "bg-yellow-50 border-yellow-300",
      isDanger && "bg-red-50 border-red-300 animate-pulse"
    )}>
      <Clock className={cn(
        "w-5 h-5",
        isWarning && "text-yellow-600",
        isDanger && "text-red-600"
      )} />
      <span className={cn(
        "font-mono font-medium",
        isWarning && "text-yellow-800",
        isDanger && "text-red-800"
      )}>
        {formatTime(remaining)}
      </span>
    </div>
  );
};

export default ExamTimer;

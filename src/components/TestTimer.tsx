
import React, { useEffect, useState } from 'react';
import { useTest } from '@/context/TestContext';
import { Clock } from 'lucide-react';

const TestTimer = () => {
  const { remainingTime, isTimeUp } = useTest();
  const [timerClass, setTimerClass] = useState('');
  
  useEffect(() => {
    if (remainingTime <= 60) { // Last minute
      setTimerClass('timer-danger');
    } else if (remainingTime <= 300) { // Last 5 minutes
      setTimerClass('timer-warning');
    } else {
      setTimerClass('');
    }
  }, [remainingTime]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
      <Clock className={`w-5 h-5 ${timerClass}`} />
      <span className={`timer-display ${timerClass}`}>
        {formatTime(remainingTime)}
      </span>
    </div>
  );
};

export default TestTimer;

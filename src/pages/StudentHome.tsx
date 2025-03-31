
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { userService } from '@/services/userService';
import { sessionService, SessionResponse } from '@/services/sessionService';
import { toast } from 'sonner';
import { format } from 'date-fns';

const StudentHome = () => {
  const navigate = useNavigate();
  const [upcomingSessions, setUpcomingSessions] = useState<SessionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('token') || '';
  
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const user = await userService.getCurrentUser(token);
        if (!user) {
          navigate('/login');
          return;
        }
        
        const sessions = await sessionService.getUpcomingSessions(token);
        setUpcomingSessions(sessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast.error('Không thể tải danh sách bài thi sắp tới');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [token, navigate]);
  
  const formatDateTime = (dateTimeStr: string) => {
    try {
      return format(new Date(dateTimeStr), 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Không hợp lệ';
    }
  };
  
  const formatTimeLimit = (timeLimit: string) => {
    // Convert PT2H30M to 2h 30m
    const hours = timeLimit.match(/(\d+)H/);
    const minutes = timeLimit.match(/(\d+)M/);
    
    let result = '';
    if (hours) result += `${hours[1]} giờ `;
    if (minutes) result += `${minutes[1]} phút`;
    
    return result.trim() || 'Không xác định';
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Đang tải...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Bài kiểm tra sắp tới</h1>
      
      {upcomingSessions.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Không có bài kiểm tra nào</h3>
          <p className="text-gray-500">Hiện tại bạn không có bài kiểm tra nào sắp tới</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingSessions.map((session) => {
            const startTime = new Date(session.startTime);
            const isAvailable = startTime <= new Date();
            
            return (
              <Card key={session.sessionId} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>Kỳ thi {session.sessionId}</CardTitle>
                  <CardDescription>
                    {isAvailable ? 'Đã bắt đầu' : 'Sắp diễn ra'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">
                      Thời gian bắt đầu: {formatDateTime(session.startTime)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">
                      Thời gian làm bài: {formatTimeLimit(session.timeLimit)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    disabled={!isAvailable}
                    onClick={() => navigate(`/test-confirmation/${session.sessionId}`)}
                  >
                    {isAvailable ? (
                      <>
                        Vào làm bài
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      'Chưa đến thời gian'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentHome;

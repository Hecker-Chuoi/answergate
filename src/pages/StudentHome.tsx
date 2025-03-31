
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, LogOut, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { sessionService, Session } from '@/services/sessionService';

const StudentHome = () => {
  const navigate = useNavigate();
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const fetchUserInfo = () => {
      const userStr = sessionStorage.getItem('currentUser');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

    const fetchUpcomingSessions = async () => {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const sessions = await sessionService.getUpcomingSessions(token);
        setUpcomingSessions(sessions);
      } catch (error) {
        console.error('Error fetching upcoming sessions:', error);
        toast.error('Không thể tải danh sách bài kiểm tra sắp tới');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
    fetchUpcomingSessions();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');
    toast.success('Đăng xuất thành công');
    navigate('/login');
  };

  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return dateTimeStr;
    }
  };

  const formatTimeLimit = (timeLimit: string) => {
    // Convert PT2H30M format to readable format
    try {
      let hours = 0;
      let minutes = 0;
      
      const hoursMatch = timeLimit.match(/(\d+)H/);
      const minutesMatch = timeLimit.match(/(\d+)M/);
      
      if (hoursMatch) hours = parseInt(hoursMatch[1], 10);
      if (minutesMatch) minutes = parseInt(minutesMatch[1], 10);
      
      let result = '';
      if (hours > 0) result += `${hours} giờ `;
      if (minutes > 0) result += `${minutes} phút`;
      
      return result.trim() || 'Không giới hạn';
    } catch (error) {
      return timeLimit;
    }
  };
  
  const goToTestConfirmation = (sessionId: number) => {
    navigate(`/test-confirmation/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <header className="bg-blue-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Trang chủ thí sinh</h1>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-white hidden md:block">
                Xin chào, <span className="font-semibold">{user.fullName || user.username}</span>
              </span>
            )}
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-white text-blue-700 hover:bg-gray-100">
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-semibold mb-6">Bài kiểm tra sắp tới</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          </div>
        ) : upcomingSessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">Không có bài kiểm tra nào sắp tới</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingSessions.map((session) => (
              <Card key={session.sessionId} className="overflow-hidden">
                <CardHeader className="bg-blue-50 border-b">
                  <CardTitle className="text-lg font-medium">Mã phiên: {session.sessionId}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">
                      <strong>Thời gian bắt đầu:</strong> {formatDateTime(session.startTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">
                      <strong>Thời gian làm bài:</strong> {formatTimeLimit(session.timeLimit)}
                    </span>
                  </div>
                  <div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      Sẵn sàng
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 px-6 py-3">
                  <Button 
                    onClick={() => goToTestConfirmation(session.sessionId!)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    Vào làm bài
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentHome;

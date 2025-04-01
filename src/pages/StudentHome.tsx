
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { userService } from '@/services/userService';
import { SessionResponse } from '@/services/sessionService';
import { takingTestService } from '@/services/takingTestService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const StudentHome = () => {
  const navigate = useNavigate();
  const [upcomingSessions, setUpcomingSessions] = useState<SessionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const userInfo = await userService.getMyInfo(token);
        setUser(userInfo);
      } catch (error) {
        console.error('Error fetching user info:', error);
        toast.error('Không thể tải thông tin người dùng');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserInfo();
  }, [navigate]);
  
  useEffect(() => {
    const fetchUpcomingSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        // Use the new takingTestService instead of userService
        const sessions = await takingTestService.getUpcomingSessions(token);
        setUpcomingSessions(sessions);
      } catch (error) {
        console.error('Error fetching upcoming sessions:', error);
        toast.error('Không thể tải danh sách buổi thi sắp tới');
      }
    };
    
    if (user) {
      fetchUpcomingSessions();
    }
  }, [user]);
  
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
  
  const handleViewTest = async (sessionId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Use the correct API from takingTestService
      await takingTestService.getTest(token, sessionId);
      
      // If successful, navigate to the test confirmation page
      navigate(`/test-confirmation/${sessionId}`);
    } catch (error) {
      console.error('Error accessing test:', error);
      toast.error('Không thể truy cập bài kiểm tra này');
    }
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
        <Card>
          <CardHeader>
            <CardTitle>Danh sách bài kiểm tra sắp diễn ra</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã phiên</TableHead>
                  <TableHead>Thời gian bắt đầu</TableHead>
                  <TableHead>Thời gian làm bài</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingSessions.map((session) => {
                  const startTime = new Date(session.startTime);
                  const isAvailable = startTime <= new Date();
                  
                  return (
                    <TableRow key={session.sessionId}>
                      <TableCell className="font-medium">#{session.sessionId}</TableCell>
                      <TableCell>{formatDateTime(session.startTime)}</TableCell>
                      <TableCell>{formatTimeLimit(session.timeLimit)}</TableCell>
                      <TableCell>
                        {isAvailable ? (
                          <span className="text-green-600 font-medium">Đã bắt đầu</span>
                        ) : (
                          <span className="text-amber-600 font-medium">Sắp diễn ra</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm"
                          onClick={() => handleViewTest(session.sessionId)}
                          disabled={!isAvailable}
                        >
                          {isAvailable ? 'Vào làm bài' : 'Chưa đến thời gian'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentHome;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { testService, Test } from '@/services/testService';
import { sessionService } from '@/services/sessionService';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SessionTestChangeProps {
  sessionId: number;
  currentTestId: number;
  onTestChanged: () => void;
  onCancel: () => void;
}

const SessionTestChange: React.FC<SessionTestChangeProps> = ({ 
  sessionId, 
  currentTestId, 
  onTestChanged, 
  onCancel 
}) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const token = localStorage.getItem('token') || '';
  
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const validTests = await testService.getValidTests(token);
        setTests(validTests);
      } catch (error) {
        console.error('Error fetching tests:', error);
        toast.error('Không thể tải danh sách đề thi');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTests();
  }, [token]);
  
  const handleChangeTest = async (testId: number) => {
    if (testId === currentTestId) {
      toast.info('Đề thi đã được chọn');
      return;
    }
    
    setChanging(true);
    try {
      await sessionService.changeSessionTest(token, sessionId, testId);
      toast.success('Đổi đề thi thành công');
      onTestChanged();
    } catch (error) {
      console.error('Error changing test:', error);
      toast.error('Không thể đổi đề thi');
    } finally {
      setChanging(false);
    }
  };

  const filteredTests = tests.filter((test) => 
    test.testName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    test.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Tìm kiếm đề thi..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên đề thi</TableHead>
                <TableHead>Môn học</TableHead>
                <TableHead>Số câu hỏi</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Không tìm thấy đề thi
                  </TableCell>
                </TableRow>
              ) : (
                filteredTests.map((test) => (
                  <TableRow 
                    key={test.testId}
                    className={test.testId === currentTestId ? "bg-blue-50" : ""}
                  >
                    <TableCell>{test.testId}</TableCell>
                    <TableCell>{test.testName}</TableCell>
                    <TableCell>{test.subject}</TableCell>
                    <TableCell>{test.questionCount}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant={test.testId === currentTestId ? "secondary" : "outline"}
                        disabled={changing || test.testId === currentTestId}
                        onClick={() => handleChangeTest(test.testId)}
                      >
                        {test.testId === currentTestId ? 'Đang sử dụng' : 'Chọn'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={onCancel}>
          Quay lại
        </Button>
      </div>
    </div>
  );
};

export default SessionTestChange;

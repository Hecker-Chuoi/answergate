
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { sessionService } from '@/services/sessionService';
import { testService, Test } from '@/services/testService';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SessionTestSelectorProps {
  sessionId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const SessionTestSelector: React.FC<SessionTestSelectorProps> = ({
  sessionId,
  onSuccess,
  onCancel
}) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');
        
        const testsData = await testService.getValidTests(token);
        setTests(testsData);
      } catch (error) {
        console.error('Error fetching tests:', error);
        toast.error('Không thể tải danh sách đề thi');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTests();
  }, []);

  const handleSelectTest = async (testId: number) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      await sessionService.changeSessionTest(token, sessionId, testId);
      toast.success('Đã thay đổi đề thi thành công');
      onSuccess();
    } catch (error) {
      console.error('Error changing test:', error);
      toast.error('Không thể thay đổi đề thi');
      setSubmitting(false);
    }
  };

  const filteredTests = tests.filter(test =>
    test.testName.toLowerCase().includes(filter.toLowerCase()) ||
    test.subject.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin h-6 w-6 mr-2" />
        <span>Đang tải danh sách đề thi...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="test-filter">Tìm kiếm đề thi</Label>
        <Input
          id="test-filter"
          placeholder="Tìm theo tên hoặc môn học"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="border rounded-md overflow-hidden max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên đề thi</TableHead>
              <TableHead>Môn học</TableHead>
              <TableHead>Số câu hỏi</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Không tìm thấy đề thi nào
                </TableCell>
              </TableRow>
            ) : (
              filteredTests.map((test) => (
                <TableRow key={test.testId}>
                  <TableCell>{test.testId}</TableCell>
                  <TableCell>{test.testName}</TableCell>
                  <TableCell>{test.subject}</TableCell>
                  <TableCell>{test.questionCount}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleSelectTest(test.testId)}
                      disabled={submitting}
                    >
                      Chọn
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </div>
  );
};

export default SessionTestSelector;

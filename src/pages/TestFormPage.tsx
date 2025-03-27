
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { testService, TestCreationRequest, TestUpdateRequest, Test } from '@/services/testService';
import { toast } from 'sonner';

type TestFormValues = {
  testName: string;
  description: string;
  subject: string;
  totalTime: number;
  startTime: string;
  endTime: string;
  status?: 'ACTIVE' | 'INACTIVE';
};

const TestFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);
  const [test, setTest] = useState<Test | null>(null);

  const form = useForm<TestFormValues>({
    defaultValues: {
      testName: '',
      description: '',
      subject: '',
      totalTime: 60,
      startTime: '',
      endTime: '',
      status: 'ACTIVE'
    }
  });

  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!isEditing) return;
      
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const fetchedTest = await testService.getTestById(token, Number(id));
        if (fetchedTest) {
          setTest(fetchedTest);
          
          // Format dates for input
          const startTime = fetchedTest.startTime ? new Date(fetchedTest.startTime).toISOString().slice(0, 16) : '';
          const endTime = fetchedTest.endTime ? new Date(fetchedTest.endTime).toISOString().slice(0, 16) : '';
          
          form.reset({
            testName: fetchedTest.testName,
            description: fetchedTest.description || '',
            subject: fetchedTest.subject || '',
            totalTime: fetchedTest.totalTime || 60,
            startTime,
            endTime,
            status: fetchedTest.status as 'ACTIVE' | 'INACTIVE' || 'ACTIVE'
          });
        } else {
          toast.error('Không tìm thấy đề thi');
          navigate('/exam-list');
        }
      } catch (error) {
        console.error('Error fetching test details:', error);
        toast.error('Lỗi khi tải thông tin đề thi');
      } finally {
        setLoading(false);
      }
    };

    const checkAuth = () => {
      const userStr = sessionStorage.getItem('currentUser');
      if (!userStr) {
        navigate('/login');
        return;
      }
      
      try {
        const user = JSON.parse(userStr);
        if (user.role !== 'ADMIN' && user.role !== 'admin') {
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    };

    checkAuth();
    fetchTestDetails();
  }, [id, isEditing, navigate, form]);

  const onSubmit = async (data: TestFormValues) => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      if (isEditing && id) {
        // Update existing test
        const updateData: TestUpdateRequest = {
          testName: data.testName,
          description: data.description,
          subject: data.subject,
          totalTime: data.totalTime,
          startTime: data.startTime,
          endTime: data.endTime,
          status: data.status
        };
        
        await testService.updateTest(token, Number(id), updateData);
        toast.success('Cập nhật đề thi thành công');
      } else {
        // Create new test
        const createData: TestCreationRequest = {
          testName: data.testName,
          description: data.description,
          subject: data.subject,
          totalTime: data.totalTime,
          startTime: data.startTime,
          endTime: data.endTime
        };
        
        await testService.createTest(token, createData);
        toast.success('Tạo đề thi thành công');
      }
      
      navigate('/exam-list');
    } catch (error) {
      console.error('Error saving test:', error);
      toast.error('Lỗi khi lưu đề thi');
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEditing ? 'Chỉnh sửa đề thi' : 'Tạo đề thi mới'}</h1>
        <Button variant="outline" onClick={() => navigate('/exam-list')}>
          Quay lại
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="testName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đề thi <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên đề thi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Môn học</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên môn học" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Nhập mô tả về đề thi"
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="totalTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian làm bài (phút)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                          <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian bắt đầu</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian kết thúc</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/exam-list')}
              >
                Hủy
              </Button>
              <Button type="submit">
                {isEditing ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TestFormPage;

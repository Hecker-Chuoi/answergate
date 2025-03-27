
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { FileText, Clock, Calendar, Edit, Plus, Trash } from 'lucide-react';
import { testService, Test, Question } from '@/services/testService';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { QuestionForm } from '@/components/QuestionForm';

const TestDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const testId = Number(id);
  
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showDeleteQuestionDialog, setShowDeleteQuestionDialog] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!testId) {
        navigate('/exam-list');
        return;
      }
      
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const fetchedTest = await testService.getTestById(token, testId);
        if (fetchedTest) {
          setTest(fetchedTest);
          const fetchedQuestions = await testService.getTestQuestions(token, testId);
          setQuestions(fetchedQuestions);
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
  }, [testId, navigate]);

  const handleAddQuestion = async (newQuestion: Question) => {
    const token = sessionStorage.getItem('authToken');
    if (!token || !testId) return;

    try {
      // Add testId to the question
      const questionWithTestId = {
        ...newQuestion,
        testId
      };
      
      // Add the question to the list
      const updatedQuestions = [...questions, questionWithTestId];
      
      // Update on the server
      const success = await testService.setTestQuestions(token, testId, updatedQuestions);
      
      if (success) {
        setQuestions(updatedQuestions);
        setShowAddQuestion(false);
        toast.success('Thêm câu hỏi thành công');
      }
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Lỗi khi thêm câu hỏi');
    }
  };

  const handleUpdateQuestion = async (updatedQuestion: Question, index: number) => {
    const token = sessionStorage.getItem('authToken');
    if (!token || !testId) return;

    try {
      // Make sure we have the testId in the question
      const questionWithTestId = {
        ...updatedQuestion,
        testId
      };
      
      // Update the question in the list
      const updatedQuestions = [...questions];
      updatedQuestions[index] = questionWithTestId;
      
      // Update on the server
      const success = await testService.setTestQuestions(token, testId, updatedQuestions);
      
      if (success) {
        setQuestions(updatedQuestions);
        setEditingQuestion(null);
        toast.success('Cập nhật câu hỏi thành công');
      }
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error('Lỗi khi cập nhật câu hỏi');
    }
  };

  const handleDeleteQuestion = async () => {
    if (selectedQuestionIndex === null) return;
    
    const token = sessionStorage.getItem('authToken');
    if (!token || !testId) return;

    try {
      // Remove the question from the list
      const updatedQuestions = [...questions];
      updatedQuestions.splice(selectedQuestionIndex, 1);
      
      // Update on the server
      const success = await testService.setTestQuestions(token, testId, updatedQuestions);
      
      if (success) {
        setQuestions(updatedQuestions);
        setShowDeleteQuestionDialog(false);
        setSelectedQuestionIndex(null);
        toast.success('Xóa câu hỏi thành công');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Lỗi khi xóa câu hỏi');
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang hoạt động';
      case 'INACTIVE':
        return 'Không hoạt động';
      case 'DELETED':
        return 'Đã xóa';
      default:
        return 'Không xác định';
    }
  };

  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'DELETED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chi tiết đề thi</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/exam-list')}
          >
            Quay lại
          </Button>
          <Button 
            variant="default" 
            onClick={() => navigate(`/edit-test/${testId}`)}
            className="flex items-center gap-2"
          >
            <Edit size={16} />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      {test && (
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-[400px] mb-6">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="questions">Câu hỏi ({questions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{test.testName}</CardTitle>
                <CardDescription>
                  {test.subject && <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs font-medium mr-2">{test.subject}</span>}
                  <span className={`py-1 px-2 rounded-full text-xs font-medium ${getStatusClass(test.status)}`}>
                    {getStatusText(test.status)}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-500 mb-2">Thông tin cơ bản</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <FileText size={18} className="text-gray-500" />
                        <span className="text-sm">
                          <strong>Mã đề thi:</strong> {test.testCode || 'Chưa có mã'}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText size={18} className="text-gray-500" />
                        <span className="text-sm">
                          <strong>Số câu hỏi:</strong> {test.totalQuestion || 0}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock size={18} className="text-gray-500" />
                        <span className="text-sm">
                          <strong>Thời gian làm bài:</strong> {test.totalTime || 0} phút
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500 mb-2">Thời gian</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <Calendar size={18} className="text-gray-500" />
                        <span className="text-sm">
                          <strong>Bắt đầu:</strong> {test.startTime ? new Date(test.startTime).toLocaleString('vi-VN') : 'Chưa đặt'}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Calendar size={18} className="text-gray-500" />
                        <span className="text-sm">
                          <strong>Kết thúc:</strong> {test.endTime ? new Date(test.endTime).toLocaleString('vi-VN') : 'Chưa đặt'}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Calendar size={18} className="text-gray-500" />
                        <span className="text-sm">
                          <strong>Ngày tạo:</strong> {test.createdAt ? new Date(test.createdAt).toLocaleString('vi-VN') : 'N/A'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {test.description && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-500 mb-2">Mô tả</h3>
                    <p className="text-sm bg-gray-50 p-4 rounded-lg">{test.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Danh sách câu hỏi</CardTitle>
                  <CardDescription>Quản lý câu hỏi cho đề thi</CardDescription>
                </div>
                <Button onClick={() => setShowAddQuestion(true)} className="flex items-center gap-2">
                  <Plus size={16} />
                  Thêm câu hỏi
                </Button>
              </CardHeader>
              <CardContent>
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Đề thi này chưa có câu hỏi nào. Hãy thêm câu hỏi để bắt đầu.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">STT</TableHead>
                          <TableHead>Nội dung câu hỏi</TableHead>
                          <TableHead className="text-center">Số lựa chọn</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {questions.map((question, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell className="max-w-md truncate">{question.content}</TableCell>
                            <TableCell className="text-center">{question.options?.length || 0}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setEditingQuestion(question)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => {
                                    setSelectedQuestionIndex(index);
                                    setShowDeleteQuestionDialog(true);
                                  }}
                                >
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Add Question Dialog */}
      {showAddQuestion && (
        <AlertDialog
          open={showAddQuestion}
          onOpenChange={(open) => !open && setShowAddQuestion(false)}
        >
          <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Thêm câu hỏi mới</AlertDialogTitle>
            </AlertDialogHeader>
            <QuestionForm 
              onSubmit={handleAddQuestion}
              onCancel={() => setShowAddQuestion(false)}
            />
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Edit Question Dialog */}
      {editingQuestion && (
        <AlertDialog
          open={!!editingQuestion}
          onOpenChange={(open) => !open && setEditingQuestion(null)}
        >
          <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Chỉnh sửa câu hỏi</AlertDialogTitle>
            </AlertDialogHeader>
            <QuestionForm 
              initialData={editingQuestion}
              onSubmit={(question) => {
                const index = questions.findIndex(q => 
                  q.questionId === editingQuestion.questionId);
                handleUpdateQuestion(question, index !== -1 ? index : questions.length - 1);
              }}
              onCancel={() => setEditingQuestion(null)}
            />
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Question Dialog */}
      <AlertDialog open={showDeleteQuestionDialog} onOpenChange={setShowDeleteQuestionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa câu hỏi này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteQuestion}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestDetailsPage;

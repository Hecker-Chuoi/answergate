
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { testService, Test, Question } from '@/services/testService';
import { format } from 'date-fns';
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Eye, Trash2, Edit, Clock } from "lucide-react";
import { QuestionNavigation, TestQuestionEditor } from '@/components';

const TestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeQuestion, setActiveQuestion] = useState<number>(0);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const fetchedTest = await testService.getTest(token, Number(id));
        setTest(fetchedTest);
        
        const fetchedQuestions = await testService.getQuestions(token, Number(id));
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching test details:', error);
        toast.error('Không thể tải thông tin bài kiểm tra');
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [id, token]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await testService.deleteTest(token, Number(id));
      toast.success('Xóa bài kiểm tra thành công');
      navigate('/exam-list');
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error('Không thể xóa bài kiểm tra');
    }
  };

  const handleEdit = () => {
    navigate(`/edit-test/${id}`);
  };

  const handleNavigate = (index: number) => {
    setActiveQuestion(index);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Đang tải thông tin bài kiểm tra...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Không tìm thấy thông tin bài kiểm tra</p>
        <Button onClick={() => navigate('/exam-list')} className="mt-4">Quay lại danh sách</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{test.testName}</h1>
          <div className="flex items-center mt-2 space-x-2">
            <Badge>{test.subject}</Badge>
            <div className="text-sm text-gray-500">
              {questions.length} câu hỏi
            </div>
            {test.isDeleted && (
              <Badge variant="destructive">Đã xóa</Badge>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleEdit} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
          
          <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
              </AlertDialogHeader>
              <p>Hành động này không thể hoàn tác. Bài kiểm tra sẽ bị xóa vĩnh viễn.</p>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Thông tin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">ID Bài kiểm tra</h4>
              <p>{test.testId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Môn học</h4>
              <p>{test.subject}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Số câu hỏi</h4>
              <p>{questions.length}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Trạng thái</h4>
              <p>{test.isDeleted ? 'Đã xóa' : 'Đang hoạt động'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Thời gian chỉnh sửa</h4>
              <p>{test.editedTime ? format(new Date(test.editedTime), 'dd/MM/yyyy HH:mm') : 'Chưa có'}</p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 flex flex-col">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Danh sách câu hỏi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-3/4">
                  {questions.length > 0 ? (
                    <div className="border rounded-md p-4">
                      {questions[activeQuestion] && (
                        <div>
                          <h3 className="font-semibold mb-2">Câu hỏi {activeQuestion + 1}</h3>
                          <p className="mb-4">{questions[activeQuestion].questionText}</p>
                          <div className="space-y-2">
                            {questions[activeQuestion].answers.map((answer, index) => (
                              <div key={index} className={`p-2 border rounded-md ${
                                answer.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'
                              }`}>
                                <div className="flex items-start">
                                  <div className="mr-2">{String.fromCharCode(65 + index)}.</div>
                                  <div>{answer.answerText}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {questions[activeQuestion].explainText && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-md">
                              <h4 className="font-medium mb-1">Giải thích:</h4>
                              <p>{questions[activeQuestion].explainText}</p>
                            </div>
                          )}
                        </div>
                      )}
                      {questions.length === 0 && (
                        <p>Không có câu hỏi nào</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p>Bài kiểm tra này chưa có câu hỏi nào</p>
                      <Button onClick={handleEdit} className="mt-4">Thêm câu hỏi</Button>
                    </div>
                  )}
                </div>
                <div className="md:w-1/4">
                  <QuestionNavigation 
                    questionsCount={questions.length} 
                    activeQuestion={activeQuestion}
                    onNavigate={handleNavigate}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestDetailsPage;

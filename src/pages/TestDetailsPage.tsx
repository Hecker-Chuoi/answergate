
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Edit, Trash2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { testService } from '@/services/testService';
import { Question } from '@/services/sessionService';

import TestQuestionNavigation from '@/components/TestQuestionNavigation';

const TestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const token = localStorage.getItem('token') || '';
  
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const fetchedTest = await testService.getTestById(token, Number(id));
        setTest(fetchedTest);
        
        const fetchedQuestions = await testService.getTestQuestions(token, Number(id));
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching test data:', error);
        toast.error('Không thể tải thông tin bài kiểm tra');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestData();
  }, [id, token]);
  
  const handleDelete = async () => {
    if (!test) return;
    
    setIsDeleting(true);
    try {
      await testService.deleteTest(token, test.testId);
      toast.success('Xóa bài kiểm tra thành công');
      navigate('/exam-list');
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error('Không thể xóa bài kiểm tra');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  
  const handleChangeQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    
    // Scroll to the question
    const questionElement = document.getElementById(`question-${index}`);
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Đang tải...</p>
      </div>
    );
  }
  
  if (!test) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Không tìm thấy bài kiểm tra</p>
        <Button onClick={() => navigate('/exam-list')} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }
  
  const letterMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết bài kiểm tra</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/edit-test/${test.testId}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Thông tin chung</TabsTrigger>
          <TabsTrigger value="questions">Nội dung bài kiểm tra</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">ID bài kiểm tra</h3>
                    <p className="mt-1">{test.testId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Tên bài kiểm tra</h3>
                    <p className="mt-1">{test.testName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Môn học</h3>
                    <p className="mt-1">{test.subject}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Số lượng câu hỏi</h3>
                    <p className="mt-1">{test.questionCount}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Thời gian chỉnh sửa</h3>
                    <p className="mt-1">
                      {test.editedTime ? new Date(test.editedTime).toLocaleDateString() : 'Chưa có'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Trạng thái</h3>
                    <p className="mt-1 flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${test.isDeleted ? 'bg-red-500' : 'bg-green-500'}`}></span>
                      {test.isDeleted ? 'Đã xóa' : 'Hoạt động'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions">
          <div className="flex h-[calc(100vh-12rem)]">
            {/* Sidebar with question navigation */}
            <div className="w-64 hidden md:block">
              <TestQuestionNavigation 
                questions={questions} 
                currentQuestionIndex={currentQuestionIndex}
                onQuestionChange={handleChangeQuestion}
              />
            </div>
            
            {/* Main content with questions */}
            <div className="flex-1">
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle>
                    {test.testName} - {test.subject}
                  </CardTitle>
                </CardHeader>
              </Card>
              
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="pr-4 space-y-6">
                  {questions.length === 0 ? (
                    <Card className="p-6 text-center">
                      <div className="flex flex-col items-center justify-center p-8">
                        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Chưa có câu hỏi nào</h3>
                        <p className="text-gray-500 mb-4">Bài kiểm tra này chưa có câu hỏi</p>
                        <Button 
                          onClick={() => navigate(`/edit-test/${test.testId}`)}
                          variant="default"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Thêm câu hỏi
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    questions.map((question, index) => (
                      <Card key={question.questionId} id={`question-${index}`} className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-800">
                            Câu {index + 1}
                          </h3>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {question.questionType === 'SINGLE_CHOICE' ? 'Một đáp án' : 'Nhiều đáp án'}
                          </span>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          {question.questionText}
                        </div>
                        
                        <div className="space-y-2">
                          {question.answers.map((answer, answerIndex) => (
                            <div 
                              key={answer.answerId}
                              className={`p-3 rounded-lg border ${answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
                            >
                              <div className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm mr-3 flex-shrink-0">
                                  {letterMap[answerIndex]}
                                </div>
                                <div className="flex-1">
                                  {answer.answerText}
                                </div>
                                {answer.isCorrect && (
                                  <div className="ml-2 text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full">
                                    Đúng
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {question.explainText && (
                          <div className="mt-4 p-3 border border-blue-100 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-800 mb-1">Giải thích:</p>
                            <p className="text-sm text-blue-700">{question.explainText}</p>
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bài kiểm tra "{test.testName}" không? 
              Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Đang xóa...' : 'Xóa bài kiểm tra'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestDetailsPage;

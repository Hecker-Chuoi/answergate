
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, Calendar, Edit, Plus, Trash, Save, X } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import TestQuestionNavigation from '@/components/TestQuestionNavigation';
import TestQuestionEditor from '@/components/TestQuestionEditor';

const TestDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const testId = Number(id);
  
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingQuestions, setEditingQuestions] = useState<Question[]>([]);
  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false);
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

  const handleChangeQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleStartEditing = () => {
    setEditingQuestions([...questions]);
    setIsEditMode(true);
  };

  const handleCancelEditing = () => {
    setIsEditMode(false);
  };

  const handleSaveQuestions = async () => {
    // Validate questions before saving
    
    // Check for empty question texts
    const emptyQuestionIndex = editingQuestions.findIndex(q => !q.questionText.trim());
    if (emptyQuestionIndex !== -1) {
      toast.error(`Câu hỏi ${emptyQuestionIndex + 1} không có nội dung`);
      return;
    }
    
    // Check for empty answer texts
    for (let i = 0; i < editingQuestions.length; i++) {
      const emptyAnswerIndex = editingQuestions[i].answers.findIndex(a => !a.answerText.trim());
      if (emptyAnswerIndex !== -1) {
        toast.error(`Đáp án ${emptyAnswerIndex + 1} của câu hỏi ${i + 1} không có nội dung`);
        return;
      }
    }
    
    // Check for at least one correct answer per question
    const noCorrectAnswerIndex = editingQuestions.findIndex(q => !q.answers.some(a => a.isCorrect));
    if (noCorrectAnswerIndex !== -1) {
      toast.error(`Câu hỏi ${noCorrectAnswerIndex + 1} phải có ít nhất một đáp án đúng`);
      return;
    }
    
    // Check for single choice questions having exactly one correct answer
    const invalidSingleChoiceIndex = editingQuestions.findIndex(q => 
      q.questionType === 'SINGLE_CHOICE' && q.answers.filter(a => a.isCorrect).length !== 1
    );
    if (invalidSingleChoiceIndex !== -1) {
      toast.error(`Câu hỏi ${invalidSingleChoiceIndex + 1} là dạng một đáp án nhưng có nhiều hơn một đáp án đúng`);
      return;
    }
    
    const token = sessionStorage.getItem('authToken');
    if (!token || !testId) return;

    try {
      const success = await testService.setTestQuestions(token, testId, editingQuestions);
      if (success) {
        setQuestions(editingQuestions);
        setIsEditMode(false);
        toast.success('Lưu thay đổi thành công');
      }
    } catch (error) {
      console.error('Error saving questions:', error);
      toast.error('Lỗi khi lưu thay đổi');
    }
  };

  const handleUpdateQuestion = (updatedQuestion: Question, index: number) => {
    const newQuestions = [...editingQuestions];
    newQuestions[index] = updatedQuestion;
    setEditingQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      questionText: '',
      questionType: 'SINGLE_CHOICE',
      answers: [
        { answerText: '', isCorrect: true },
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false }
      ]
    };
    
    setEditingQuestions([...editingQuestions, newQuestion]);
    setCurrentQuestionIndex(editingQuestions.length);
  };

  const handleDeleteQuestion = () => {
    if (selectedQuestionIndex === null) return;
    
    const newQuestions = [...editingQuestions];
    newQuestions.splice(selectedQuestionIndex, 1);
    
    setEditingQuestions(newQuestions);
    setShowDeleteQuestionDialog(false);
    
    // Adjust current question index if needed
    if (currentQuestionIndex >= newQuestions.length) {
      setCurrentQuestionIndex(Math.max(0, newQuestions.length - 1));
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
                  <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs font-medium">
                    {test.deleted ? 'Đã xóa' : 'Đang hoạt động'}
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
                          <strong>Mã đề thi:</strong> {test.testId || 'Chưa có mã'}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText size={18} className="text-gray-500" />
                        <span className="text-sm">
                          <strong>Số câu hỏi:</strong> {questions.length || 0}
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
                          <strong>Cập nhật:</strong> {test.editedTime || 'N/A'}
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

                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={() => navigate(`/edit-test/${testId}`)}
                    className="flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Chỉnh sửa thông tin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Danh sách câu hỏi</h2>
              <div className="flex gap-2">
                {isEditMode ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEditing} className="flex items-center gap-1">
                      <X size={16} />
                      Hủy bỏ
                    </Button>
                    <Button onClick={handleSaveQuestions} className="flex items-center gap-1">
                      <Save size={16} />
                      Lưu thay đổi
                    </Button>
                    <Button 
                      onClick={handleAddQuestion}
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      Thêm câu hỏi
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleStartEditing} className="flex items-center gap-1">
                    <Edit size={16} />
                    Chỉnh sửa câu hỏi
                  </Button>
                )}
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500 mb-4">Đề thi này chưa có câu hỏi nào.</p>
                <Button onClick={handleStartEditing}>Thêm câu hỏi ngay</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 space-y-4">
                  {isEditMode ? (
                    // Show editing UI for the current question
                    <>
                      {editingQuestions.length > 0 && currentQuestionIndex < editingQuestions.length && (
                        <div className="relative">
                          <div className="absolute top-2 right-2 z-10">
                            <Button 
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedQuestionIndex(currentQuestionIndex);
                                setShowDeleteQuestionDialog(true);
                              }}
                              className="flex items-center gap-1"
                            >
                              <Trash size={16} />
                              Xóa câu hỏi
                            </Button>
                          </div>
                          <TestQuestionEditor
                            question={editingQuestions[currentQuestionIndex]}
                            isEditing={true}
                            onSave={(updatedQuestion) => handleUpdateQuestion(updatedQuestion, currentQuestionIndex)}
                            onCancel={() => {}}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    // Show view-only UI for the current question
                    <>
                      {questions.length > 0 && currentQuestionIndex < questions.length && (
                        <TestQuestionEditor
                          question={questions[currentQuestionIndex]}
                          isEditing={false}
                          onSave={() => {}}
                          onCancel={() => {}}
                        />
                      )}
                    </>
                  )}
                </div>
                <div className="md:col-span-1 bg-white rounded-lg shadow-md h-[600px]">
                  <TestQuestionNavigation
                    questions={isEditMode ? editingQuestions : questions}
                    currentQuestionIndex={currentQuestionIndex}
                    onQuestionChange={handleChangeQuestion}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Delete Question Dialog */}
      <AlertDialog open={showDeleteQuestionDialog} onOpenChange={setShowDeleteQuestionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa câu hỏi</AlertDialogTitle>
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

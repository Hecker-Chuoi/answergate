
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { testService, Question, QuestionCreationRequest, Test } from '@/services/testService';
import QuestionEditorItem from './QuestionEditorItem';
import TestQuestionNavigation from './TestQuestionNavigation';
import { Plus, Save } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

interface TestQuestionEditorProps {
  testId: number;
  token: string;
}

const TestQuestionEditor: React.FC<TestQuestionEditorProps> = ({ testId, token }) => {
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTestFormEditing, setIsTestFormEditing] = useState(false);
  const [testForm, setTestForm] = useState({
    testName: '',
    subject: ''
  });

  // Fetch test data and questions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedTest = await testService.getTestById(token, testId);
        setTest(fetchedTest);
        setTestForm({
          testName: fetchedTest.testName,
          subject: fetchedTest.subject
        });
        
        const fetchedQuestions = await testService.getTestQuestions(token, testId);
        setQuestions(fetchedQuestions || []);
      } catch (error) {
        console.error('Error fetching test data:', error);
        toast.error('Không thể tải thông tin bài kiểm tra');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [testId, token]);

  const handleSaveQuestion = (updatedQuestion: Question, index: number) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    
    // Update current question index if needed
    if (index === currentQuestionIndex && newQuestions.length > 0) {
      setCurrentQuestionIndex(Math.min(currentQuestionIndex, newQuestions.length - 1));
    } else if (newQuestions.length === 0) {
      setCurrentQuestionIndex(-1);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      questionText: 'Câu hỏi mới',
      questionType: 'SINGLE_CHOICE',
      explainText: '',
      answers: [
        { answerText: 'Đáp án A', isCorrect: true },
        { answerText: 'Đáp án B', isCorrect: false },
      ]
    };
    
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };

  const handleSaveTest = async () => {
    if (!test) return;
    
    setSaving(true);
    try {
      // Update test info if needed
      if (isTestFormEditing) {
        await testService.updateTest(token, testId, {
          testName: testForm.testName,
          subject: testForm.subject
        });
        setIsTestFormEditing(false);
      }
      
      // Map questions to QuestionCreationRequest format
      const questionsToSave: QuestionCreationRequest[] = questions.map(q => ({
        questionText: q.questionText,
        questionType: q.questionType,
        explainText: q.explainText,
        answers: q.answers.map(a => ({
          answerText: a.answerText,
          isCorrect: a.isCorrect
        }))
      }));
      
      // Save questions
      const updatedTest = await testService.setTestQuestions(token, testId, questionsToSave);
      
      // Update local test data
      setTest(updatedTest);
      toast.success('Lưu bài kiểm tra thành công');
    } catch (error) {
      console.error('Error saving test:', error);
      toast.error('Không thể lưu bài kiểm tra');
    } finally {
      setSaving(false);
    }
  };

  const handleQuestionChange = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleTestFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTestForm({
      ...testForm,
      [name]: value
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center p-8">
        <p>Không tìm thấy thông tin bài kiểm tra</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Chỉnh sửa bài kiểm tra</h2>
        <Button 
          onClick={handleSaveTest} 
          disabled={saving} 
          className="flex items-center gap-2"
        >
          <Save size={16} />
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
      
      {/* <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Thông tin bài kiểm tra</span>
            {!isTestFormEditing && (
              <Button 
                onClick={() => setIsTestFormEditing(true)} 
                variant="outline" 
                size="sm"
              >
                Chỉnh sửa
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isTestFormEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="testName">Tên bài kiểm tra</Label>
                <Input
                  id="testName"
                  name="testName"
                  value={testForm.testName}
                  onChange={handleTestFormChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="subject">Môn học</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={testForm.subject}
                  onChange={handleTestFormChange}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsTestFormEditing(false);
                    setTestForm({
                      testName: test.testName,
                      subject: test.subject
                    });
                  }}
                >
                  Hủy
                </Button>
                <Button 
                  onClick={() => setIsTestFormEditing(false)}
                >
                  Xác nhận
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Tên bài kiểm tra</Label>
                <p className="mt-1 font-medium">{testForm.testName}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Môn học</Label>
                <p className="mt-1 font-medium">{testForm.subject}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Số lượng câu hỏi</Label>
                <p className="mt-1 font-medium">{questions.length}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Cập nhật lần cuối</Label>
                <p className="mt-1 font-medium">
                  {test.editedTime ? new Date(test.editedTime).toLocaleDateString() : 'Chưa có'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card> */}
      
      <div className="flex flex-col md:flex-row h-[calc(100vh-24rem)]">
        <div className="w-full md:w-64 mb-4 md:mb-0">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Danh sách câu hỏi</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <Button 
                className="w-full mb-4 flex items-center gap-1" 
                onClick={handleAddQuestion}
              >
                <Plus size={16} />
                Thêm câu hỏi
              </Button>
              
              {questions.length === 0 ? (
                <p className="text-center text-gray-500 text-sm p-4">
                  Chưa có câu hỏi, hãy thêm câu hỏi mới
                </p>
              ) : (
                <ScrollArea className="h-[calc(100vh-30rem)]">
                  <TestQuestionNavigation 
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    onQuestionChange={handleQuestionChange}
                  />
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-grow md:pl-4">
          <Card className="h-full">
            <CardHeader className="border-b">
              <CardTitle>
                {questions.length > 0 ? (
                  `Câu ${currentQuestionIndex + 1} / ${questions.length}`
                ) : (
                  'Chi tiết câu hỏi'
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[calc(100vh-32rem)]">
              <ScrollArea className="h-full pr-4">
                {questions.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-gray-500 mb-4">Chưa có câu hỏi nào</p>
                    <Button onClick={handleAddQuestion}>Thêm câu hỏi mới</Button>
                  </div>
                ) : (
                  <QuestionEditorItem
                    question={questions[currentQuestionIndex]}
                    onSave={(updatedQuestion) => handleSaveQuestion(updatedQuestion, currentQuestionIndex)}
                    onDelete={() => handleDeleteQuestion(currentQuestionIndex)}
                  />
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestQuestionEditor;

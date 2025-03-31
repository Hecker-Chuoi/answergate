
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { testService, Test, TestCreationRequest } from '@/services/testService';
import { toast } from "sonner";
import TestQuestionEditor from '@/components/TestQuestionEditor';
import { ArrowLeft, Save } from "lucide-react";

interface TestForm extends TestCreationRequest {
  testId?: number;
}

const TestFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [test, setTest] = useState<Test | null>(null);
  const [formData, setFormData] = useState<TestForm>({
    testName: '',
    subject: '',
  });
  const [activeTab, setActiveTab] = useState<string>("details");
  
  const token = localStorage.getItem('token') || '';
  const isEditing = !!id;

  useEffect(() => {
    const fetchTest = async () => {
      if (!isEditing) {
        setLoading(false);
        return;
      }
      
      try {
        const fetchedTest = await testService.getTestById(token, Number(id));
        setTest(fetchedTest);
        setFormData({
          testId: fetchedTest.testId,
          testName: fetchedTest.testName,
          subject: fetchedTest.subject,
        });
      } catch (error) {
        console.error('Error fetching test:', error);
        toast.error('Không thể tải thông tin bài kiểm tra');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id, token, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.testName || !formData.subject) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSaving(true);
    try {
      let savedTest: Test | null = null;
      
      if (isEditing && test?.testId) {
        savedTest = await testService.updateTest(
          token, 
          test.testId, 
          {
            testName: formData.testName,
            subject: formData.subject
          }
        );
        toast.success('Cập nhật bài kiểm tra thành công');
      } else {
        savedTest = await testService.createTest(
          token, 
          {
            testName: formData.testName,
            subject: formData.subject
          }
        );
        toast.success('Tạo bài kiểm tra thành công');
      }

      if (savedTest) {
        navigate(`/test-details/${savedTest.testId}`);
      }
    } catch (error) {
      console.error('Error saving test:', error);
      toast.error('Không thể lưu bài kiểm tra');
    } finally {
      setSaving(false);
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
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Chỉnh sửa bài kiểm tra' : 'Tạo bài kiểm tra mới'}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="details">Thông tin chung</TabsTrigger>
          {isEditing && (
            <TabsTrigger value="questions">Câu hỏi</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin bài kiểm tra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="testName">Tên bài kiểm tra</Label>
                  <Input
                    id="testName"
                    name="testName"
                    value={formData.testName}
                    onChange={handleInputChange}
                    placeholder="Nhập tên bài kiểm tra"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Môn học</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Nhập tên môn học"
                    className="mt-1"
                  />
                </div>
                {isEditing && test && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-medium mb-2">Thông tin thêm</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>ID bài kiểm tra</Label>
                        <p className="mt-1">{test.testId}</p>
                      </div>
                      <div>
                        <Label>Số lượng câu hỏi</Label>
                        <p className="mt-1">{test.questionCount || 0}</p>
                      </div>
                      <div>
                        <Label>Trạng thái</Label>
                        <p className="mt-1">{test.isDeleted ? 'Đã xóa' : 'Đang hoạt động'}</p>
                      </div>
                      <div>
                        <Label>Thời gian chỉnh sửa</Label>
                        <p className="mt-1">{test.editedTime ? new Date(test.editedTime).toLocaleDateString() : 'Chưa có'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {isEditing && (
          <TabsContent value="questions">
            <TestQuestionEditor testId={Number(id)} token={token} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default TestFormPage;

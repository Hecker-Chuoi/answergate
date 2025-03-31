
import { toast } from "sonner";

const API_URL = 'http://localhost:8080/exam';

export type Test = {
  testId?: number;
  testName: string;
  subject?: string;
  editedTime?: string;
  isDeleted?: boolean;
  questionCount?: number;
};

export type TestCreationRequest = {
  testName: string;
  subject?: string;
};

export type Answer = {
  answerId?: number;
  answerText: string;
  isCorrect: boolean;
};

export type Question = {
  questionId?: number;
  questionText: string;
  explainText?: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICES';
  answers: Answer[];
  testId?: number;
};

export type QuestionCreationRequest = {
  questionText: string;
  explainText?: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICES';
  answers: {
    answerText: string;
    isCorrect: boolean;
  }[];
};

export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  result: T;
};

export const testService = {
  getAllTests: async (token: string): Promise<Test[]> => {
    try {
      const response = await fetch(`${API_URL}/test/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data: ApiResponse<Test[]> = await response.json();
        return data.result || [];
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đề thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return [];
    }
  },

  getValidTests: async (token: string): Promise<Test[]> => {
    try {
      const response = await fetch(`${API_URL}/test/valid`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data: ApiResponse<Test[]> = await response.json();
        return data.result || [];
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đề thi hợp lệ:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return [];
    }
  },

  getTestById: async (token: string, testId: number): Promise<Test | null> => {
    try {
      const response = await fetch(`${API_URL}/test/${testId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data: ApiResponse<Test> = await response.json();
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đề thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  createTest: async (token: string, testData: TestCreationRequest): Promise<Test | null> => {
    try {
      const response = await fetch(`${API_URL}/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      
      if (response.ok) {
        const data: ApiResponse<Test> = await response.json();
        toast.success('Tạo đề thi thành công');
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi tạo đề thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  updateTest: async (token: string, testId: number, testData: TestCreationRequest): Promise<Test | null> => {
    try {
      const response = await fetch(`${API_URL}/test/${testId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      
      if (response.ok) {
        const data: ApiResponse<Test> = await response.json();
        toast.success('Cập nhật đề thi thành công');
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi cập nhật đề thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  deleteTest: async (token: string, testId: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/test/${testId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        toast.success('Xóa đề thi thành công');
        return true;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return false;
    } catch (error) {
      console.error('Lỗi khi xóa đề thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return false;
    }
  },

  restoreTest: async (token: string, testId: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/test/${testId}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        toast.success('Khôi phục đề thi thành công');
        return true;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return false;
    } catch (error) {
      console.error('Lỗi khi khôi phục đề thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return false;
    }
  },

  getTestQuestions: async (token: string, testId: number): Promise<Question[]> => {
    try {
      const response = await fetch(`${API_URL}/test/${testId}/questions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data: ApiResponse<Question[]> = await response.json();
        return data.result || [];
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách câu hỏi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return [];
    }
  },

  setTestQuestions: async (token: string, testId: number, questions: QuestionCreationRequest[]): Promise<Test | null> => {
    try {
      const response = await fetch(`${API_URL}/test/${testId}/questions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questions)
      });
      
      if (response.ok) {
        const data: ApiResponse<Test> = await response.json();
        toast.success('Cập nhật câu hỏi thành công');
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi cập nhật câu hỏi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  }
};

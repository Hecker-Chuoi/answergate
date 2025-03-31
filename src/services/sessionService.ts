import { toast } from "sonner";
import { User } from './userService';
import { Test, Question, QuestionCreationRequest } from './testService';

export interface Answer {
  answerId: number;
  answerText: string;
  isCorrect: boolean;
}

export interface Question {
  questionId: number;
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICES';
  explainText?: string;
  answers: Answer[];
}

export interface CandidateAnswer {
  answerChosen: string;
  correct: boolean;
  testAnswerId: number;
}

export interface ResultResponse {
  testResultId: number;
  sessionId: number;
  candidateId: number;
  score: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  submitAt: string;
  timeTaken: number;
  candidateAnswered: CandidateAnswer[];
}

export interface CandidateResult {
  testResultId: number;
  score: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  submitAt: string;
  timeTaken: number;
  candidateAnswered: CandidateAnswer[];
}

export interface SessionResponse {
  sessionId: number;
  testId: number;
  startTime: string;
  timeLimit: string; // Format "PT2H30M"
  lastEditTime: string;
  candidateCount: number;
  isDeleted: boolean;
}

export interface SessionCreationRequest {
  testId: number;
  startTime: string;
  timeLimit: string; // Format "PT2H30M"
}

export interface SessionUpdateRequest {
  startTime?: string;
  timeLimit?: string; // Format "PT2H30M"
}

export interface CandidateAnswerRequest {
  questionId: number;
  answerChosen: string;
}

export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  result: T;
};

export const sessionService = {
  getAllSessions: async (token: string): Promise<SessionResponse[]> => {
    try {
      const response = await fetch(`${API_URL}/session/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data: ApiResponse<SessionResponse[]> = await response.json();
        return data.result || [];
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phiên thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return [];
    }
  },

  getSession: async (token: string, sessionId: number): Promise<SessionResponse | null> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data: ApiResponse<SessionResponse> = await response.json();
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin phiên thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  createSession: async (token: string, sessionData: SessionCreationRequest): Promise<SessionResponse | null> => {
    try {
      const response = await fetch(`${API_URL}/session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });
      
      if (response.ok) {
        const data: ApiResponse<SessionResponse> = await response.json();
        toast.success('Tạo phiên thi thành công');
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi tạo phiên thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  updateSession: async (token: string, sessionId: number, sessionData: SessionUpdateRequest): Promise<SessionResponse | null> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });
      
      if (response.ok) {
        const data: ApiResponse<SessionResponse> = await response.json();
        toast.success('Cập nhật phiên thi thành công');
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi cập nhật phiên thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  deleteSession: async (token: string, sessionId: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        toast.success('Xóa phiên thi thành công');
        return true;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return false;
    } catch (error) {
      console.error('Lỗi khi xóa phiên thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return false;
    }
  },

  getSessionTest: async (token: string, sessionId: number): Promise<Test | null> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/test`, {
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
      console.error('Lỗi khi lấy thông tin bài kiểm tra của phiên thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  changeSessionTest: async (token: string, sessionId: number, testId: number): Promise<SessionResponse | null> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/test`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testId)
      });
      
      if (response.ok) {
        const data: ApiResponse<SessionResponse> = await response.json();
        toast.success('Thay đổi bài kiểm tra thành công');
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi thay đổi bài kiểm tra cho phiên thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  getSessionQuestions: async (token: string, sessionId: number): Promise<Question[]> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/questions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data: ApiResponse<Question[]> = await response.json();
        return data.result || [];
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách câu hỏi của phiên thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return [];
    }
  },

  getSessionCandidates: async (token: string, sessionId: number): Promise<User[]> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/candidates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data: ApiResponse<User[]> = await response.json();
        return data.result || [];
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thí sinh của phiên thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return [];
    }
  },

  assignCandidatesByUsernames: async (token: string, sessionId: number, usernames: string[]): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/candidates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usernames)
      });
      
      if (response.ok) {
        toast.success('Thêm thí sinh thành công');
        return true;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return false;
    } catch (error) {
      console.error('Lỗi khi thêm thí sinh cho phiên thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return false;
    }
  },

  assignCandidatesByTypes: async (token: string, sessionId: number, types: string[]): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/types`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(types)
      });
      
      if (response.ok) {
        toast.success('Thêm thí sinh theo loại thành công');
        return true;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return false;
    } catch (error) {
      console.error('Lỗi khi thêm thí sinh theo loại cho phiên thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return false;
    }
  },

  getSessionResults: async (token: string, sessionId: number): Promise<CandidateResult[]> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/results`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data: ApiResponse<CandidateResult[]> = await response.json();
        return data.result || [];
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy kết quả của phiên thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return [];
    }
  },

  startTest: async (token: string, sessionId: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        toast.success('Bắt đầu làm bài thành công');
        return true;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return false;
    } catch (error) {
      console.error('Lỗi khi bắt đầu làm bài:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return false;
    }
  },

  getTestQuestions: async (token: string, sessionId: number): Promise<Question[]> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/questions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data: ApiResponse<Question[]> = await response.json();
        return data.result || [];
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách câu hỏi bài thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return [];
    }
  },

  saveAnswer: async (token: string, sessionId: number, answers: CandidateAnswerRequest[]): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/save-progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answers)
      });
      
      if (response.ok) {
        toast.success('Lưu tiến trình làm bài thành công');
        return true;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return false;
    } catch (error) {
      console.error('Lỗi khi lưu tiến trình làm bài:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return false;
    }
  },

  submitTest: async (token: string, sessionId: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        toast.success('Nộp bài thành công');
        return true;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return false;
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return false;
    }
  },

  getTestResult: async (token: string, sessionId: number): Promise<ResultResponse | null> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/result`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data: ApiResponse<ResultResponse> = await response.json();
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi lấy kết quả bài thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  getStudentTest: async (token: string, sessionId: number): Promise<Test | null> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/test`, {
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
      console.error('Lỗi khi lấy thông tin bài kiểm tra:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  getUpcomingSessions: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/user/upcomingSessions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách kỳ thi sắp tới');
      }
      
      return data.result;
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      throw error;
    }
  },

  getCandidates: async (token: string, sessionId: number) => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/candidates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách thí sinh');
      }
      
      return data.result;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  }
};

export { sessionService };


import { toast } from "sonner";
import { Test } from "./testService";
import { User } from "./userService";
import { Question } from "./testService";

const API_URL = 'http://localhost:8080/exam';

export type Session = {
  sessionId?: number;
  startTime: string;
  timeLimit: string; // format PT2H30M
  testId: number;
  isDeleted?: boolean;
  lastEditTime?: string;
  candidateCount?: number;
};

export type SessionCreationRequest = {
  testId: number;
  startTime?: string;
  timeLimit?: string; // format PT2H30M
};

export type SessionUpdateRequest = {
  startTime?: string;
  timeLimit?: string; // format PT2H30M
};

export type CandidateAnswer = {
  testAnswerId?: number;
  answerChosen?: string;
  correct?: boolean;
};

export type CandidateResult = {
  testResultId: number;
  score: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  submitAt?: string;
  timeTaken?: number;
  candidateAnswered: CandidateAnswer[];
};

export type ResultResponse = {
  testResultId: number;
  sessionId: number;
  candidateId: number;
  score: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  submitAt?: string;
  timeTaken?: number;
  candidateAnswered: CandidateAnswer[];
};

export type CandidateAnswerRequest = {
  questionId: number;
  answerChosen?: string;
};

export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  result: T;
};

export const sessionService = {
  getAllSessions: async (token: string, sortBy: string = 'startTime'): Promise<Session[]> => {
    try {
      const response = await fetch(`${API_URL}/session/all?sortBy=${sortBy}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data: ApiResponse<Session[]> = await response.json();
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

  getSession: async (token: string, sessionId: number): Promise<Session | null> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data: ApiResponse<Session> = await response.json();
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

  createSession: async (token: string, sessionData: SessionCreationRequest): Promise<Session | null> => {
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
        const data: ApiResponse<Session> = await response.json();
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

  updateSession: async (token: string, sessionId: number, sessionData: SessionUpdateRequest): Promise<Session | null> => {
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
        const data: ApiResponse<Session> = await response.json();
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
        }
      });
      
      if (response.ok) {
        const data: ApiResponse<Test> = await response.json();
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin bài thi của phiên:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  changeSessionTest: async (token: string, sessionId: number, testId: number): Promise<Session | null> => {
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
        const data: ApiResponse<Session> = await response.json();
        toast.success('Thay đổi bài thi thành công');
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi thay đổi bài thi của phiên:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  getSessionCandidates: async (token: string, sessionId: number): Promise<User[]> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/candidates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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
        toast.success('Gán thí sinh thành công');
        return true;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return false;
    } catch (error) {
      console.error('Lỗi khi gán thí sinh cho phiên thi:', error);
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
        toast.success('Gán thí sinh theo loại thành công');
        return true;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return false;
    } catch (error) {
      console.error('Lỗi khi gán thí sinh theo loại cho phiên thi:', error);
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
        }
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

  // APIs cho thí sinh
  getUpcomingSessions: async (token: string): Promise<Session[]> => {
    try {
      const response = await fetch(`${API_URL}/user/upcomingSessions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data: ApiResponse<Session[]> = await response.json();
        return data.result || [];
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phiên thi sắp tới:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return [];
    }
  },

  getAssignedSessions: async (token: string, status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'): Promise<ResultResponse[]> => {
    try {
      const response = await fetch(`${API_URL}/user/assigned-session/${status}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data: ApiResponse<ResultResponse[]> = await response.json();
        return data.result || [];
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phiên thi được gán:', error);
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
        }
      });
      
      if (response.ok) {
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

  saveAnswers: async (token: string, sessionId: number, answers: CandidateAnswerRequest[]): Promise<boolean> => {
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
        toast.success('Lưu tiến trình thành công');
        return true;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return false;
    } catch (error) {
      console.error('Lỗi khi lưu tiến trình bài thi:', error);
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
        }
      });
      
      if (response.ok) {
        toast.success('Nộp bài thành công');
        return true;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return false;
    } catch (error) {
      console.error('Lỗi khi nộp bài thi:', error);
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
      console.error('Lỗi khi lấy danh sách câu hỏi bài thi:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return [];
    }
  },

  getResult: async (token: string, sessionId: number): Promise<ResultResponse | null> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/result`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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
  }
};

import { config } from '@/config';
import { User, UserResponse } from './userService';
import { Test, Question } from './testService';

export interface SessionCreationRequest {
  startTime: string;
  testId: number;
  timeLimit: string; // format: PT2H30M (ISO 8601 duration)
}

export interface SessionUpdateRequest {
  startTime?: string;
  timeLimit?: string;
}

export interface SessionResponse {
  sessionId: number;
  testId: number;
  startTime: string;
  timeLimit: string;
  candidateCount: number;
  lastEditTime: string;
  isDeleted: boolean;
}

export interface CandidateAnswerRequest {
  questionId: number;
  answerChosen: string;
}

export interface CandidateAnswer {
  testAnswerId: number;
  answerChosen: string;
  correct: boolean;
}

export interface ResultResponse {
  testResultId: number;
  sessionId: number;
  candidateId: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  score: number;
  timeTaken: number;
  submitAt: string;
  candidateAnswered: CandidateAnswer[];
}

export interface CandidateResult {
  testResultId: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  score: number;
  timeTaken: number;
  submitAt: string;
  candidateAnswered: CandidateAnswer[];
}

// Define API URL
const API_URL = config.apiUrl;

const sessionService = {
  getAllSessions: async (token: string): Promise<SessionResponse[]> => {
    try {
      const response = await fetch(`${API_URL}/session/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  },
  
  getSession: async (token: string, sessionId: number): Promise<SessionResponse> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching session ${sessionId}:`, error);
      throw error;
    }
  },
  
  createSession: async (token: string, sessionData: SessionCreationRequest): Promise<SessionResponse> => {
    try {
      const response = await fetch(`${API_URL}/session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },
  
  updateSession: async (token: string, sessionId: number, sessionData: SessionUpdateRequest): Promise<SessionResponse> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error updating session ${sessionId}:`, error);
      throw error;
    }
  },
  
  deleteSession: async (token: string, sessionId: number): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error deleting session ${sessionId}:`, error);
      throw error;
    }
  },
  
  assignCandidatesByUsernames: async (token: string, sessionId: number, usernames: string[]): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/candidates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usernames)
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error assigning candidates to session ${sessionId}:`, error);
      throw error;
    }
  },
  
  assignCandidatesByTypes: async (token: string, sessionId: number, types: string[]): Promise<string> => {
    try {
      // Ánh xạ các loại hợp lệ
      const typeMapping: Record<string, string> = {
        'Chiến sĩ': 'SOLDIER',
        'Sĩ quan': 'OFFICER',
        'Chuyên nghiệp': 'PROFESSIONAL'
      };

      // Lọc và ánh xạ các loại hợp lệ
      const mappedTypes = types
        .map(type => typeMapping[type]) // Ánh xạ sang giá trị mới
        .filter(Boolean); // Loại bỏ giá trị `undefined`

      if (mappedTypes.length === 0) {
        console.warn(`No valid types provided for session ${sessionId}. Skipping request.`);
        return 'No valid types';
      }

      const response = await fetch(`${API_URL}/session/${sessionId}/types`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mappedTypes)
      });

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error assigning candidates by types to session ${sessionId}:`, error);
      throw error;
    }
  },
  
  getCandidates: async (token: string, sessionId: number): Promise<UserResponse[]> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/candidates`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching candidates for session ${sessionId}:`, error);
      throw error;
    }
  },
  
  getSessionQuestions: async (token: string, sessionId: number): Promise<Question[]> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/questions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching questions for session ${sessionId}:`, error);
      throw error;
    }
  },
  
  getSessionTest: async (token: string, sessionId: number): Promise<Test> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/test`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching test for session ${sessionId}:`, error);
      throw error;
    }
  },
  
  changeSessionTest: async (token: string, sessionId: number, testId: number): Promise<SessionResponse> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/test`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testId)
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error changing test for session ${sessionId}:`, error);
      throw error;
    }
  },
  
  getCandidateResults: async (token: string, sessionId: number): Promise<CandidateResult[]> => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}/results`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching results for session ${sessionId}:`, error);
      throw error;
    }
  },
  
  // Taking Test API endpoints
  getTestQuestions: async (token: string, sessionId: number): Promise<Question[]> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/questions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching questions for taking test ${sessionId}:`, error);
      throw error;
    }
  },
  
  getTestResult: async (token: string, sessionId: number): Promise<ResultResponse> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/result`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching result for test ${sessionId}:`, error);
      throw error;
    }
  },
  
  saveAnswers: async (token: string, sessionId: number, answers: CandidateAnswerRequest[]): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/save-progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answers)
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error saving answers for test ${sessionId}:`, error);
      throw error;
    }
  },
  
  startTest: async (token: string, sessionId: number): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error starting test ${sessionId}:`, error);
      throw error;
    }
  },
  
  submitTest: async (token: string, sessionId: number): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error submitting test ${sessionId}:`, error);
      throw error;
    }
  },
  
  getTakingTest: async (token: string, sessionId: number): Promise<Test> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/test`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching taking test ${sessionId}:`, error);
      throw error;
    }
  }
};

export { sessionService };

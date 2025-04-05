
import { Test, Question } from './testService';
import { SessionResponse } from './sessionService';
import { ResultResponse } from './sessionService';

export interface CandidateAnswerRequest {
  questionId: number;
  answerChosen: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  result: T;
}

const API_URL = 'http://localhost:8080/exam';

export const takingTestService = {
  getUpcomingSessions: async (token: string): Promise<SessionResponse[]> => {
    try {
      const response = await fetch(`${API_URL}/user/upcomingSessions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      throw error;
    }
  },

  getSession: async (token: string, sessionId: number): Promise<SessionResponse> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  },
  
  getTest: async (token: string, sessionId: number): Promise<Test> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/test`, {
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
  
  getQuestions: async (token: string, sessionId: number): Promise<Question[]> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/questions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if(data.statusCode !== 0){
        throw new Error(`${data.statusCode}: ${data.message}`);
      }
      return data.result;
    } catch (error) {
      console.error(`Error fetching questions for test ${sessionId}:`, error);
      throw error;
    }
  },
  
  getResult: async (token: string, sessionId: number): Promise<ResultResponse> => {
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
  
  startTest: async (token: string, sessionId: number): Promise<ApiResponse<string>> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error starting test ${sessionId}:`, error);
      throw error;
    }
  },
  
  saveAnswers: async (token: string, sessionId: number, answers: CandidateAnswerRequest[]): Promise<ApiResponse<string>> => {
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
      return data;
    } catch (error) {
      console.error(`Error saving answers for test ${sessionId}:`, error);
      throw error;
    }
  },
  
  submitTest: async (token: string, sessionId: number): Promise<ApiResponse<string>> => {
    try {
      const response = await fetch(`${API_URL}/taking-test/${sessionId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error submitting test ${sessionId}:`, error);
      throw error;
    }
  }
};

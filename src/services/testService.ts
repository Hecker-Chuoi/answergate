
// Define API URL
const API_URL = 'http://localhost:8080/exam';

export interface TestCreationRequest {
  testName: string;
  subject: string;
}

export interface TestUpdateRequest {
  testName: string;
  subject: string;
}

export interface Test {
  testId: number;
  testName: string;
  subject: string;
  questionCount: number;
  editedTime: string;
  isDeleted: boolean;
}

export interface AnswerCreationRequest {
  answerText: string;
  isCorrect: boolean;
}

export interface QuestionCreationRequest {
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICES';
  explainText?: string;
  answers: AnswerCreationRequest[];
}

const testService = {
  getAllTests: async (token: string): Promise<Test[]> => {
    try {
      const response = await fetch(`${API_URL}/test/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching tests:', error);
      throw error;
    }
  },

  getValidTests: async (token: string): Promise<Test[]> => {
    try {
      const response = await fetch(`${API_URL}/test/valid`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching valid tests:', error);
      throw error;
    }
  },

  getTestById: async (token: string, testId: number): Promise<Test> => {
    try {
      const response = await fetch(`${API_URL}/test/${testId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching test ${testId}:`, error);
      throw error;
    }
  },

  createTest: async (token: string, testData: TestCreationRequest): Promise<Test> => {
    try {
      const response = await fetch(`${API_URL}/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error creating test:', error);
      throw error;
    }
  },

  updateTest: async (token: string, testId: number, testData: TestUpdateRequest): Promise<Test> => {
    try {
      const response = await fetch(`${API_URL}/test/${testId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error updating test ${testId}:`, error);
      throw error;
    }
  },

  deleteTest: async (token: string, testId: number): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/test/${testId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error deleting test ${testId}:`, error);
      throw error;
    }
  },

  getTestQuestions: async (token: string, testId: number) => {
    try {
      const response = await fetch(`${API_URL}/test/${testId}/questions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching questions for test ${testId}:`, error);
      throw error;
    }
  },

  setTestQuestions: async (token: string, testId: number, questions: QuestionCreationRequest[]) => {
    try {
      const response = await fetch(`${API_URL}/test/${testId}/questions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questions)
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error setting questions for test ${testId}:`, error);
      throw error;
    }
  },

  restoreTest: async (token: string, testId: number): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/test/${testId}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error restoring test ${testId}:`, error);
      throw error;
    }
  }
};

export { testService };

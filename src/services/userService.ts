
// Define API URL
const API_URL = 'http://localhost:8080/exam';

export interface User {
  userId: number;
  username: string;
  fullName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  type: 'Chiến sĩ' | 'Sĩ quan' | 'Chuyên nghiệp';
  role: 'USER' | 'ADMIN';
  mail?: string;
  phoneNumber?: string;
  hometown?: string;
}

export interface UserResponse {
  userId: number;
  username: string;
  fullName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  type: 'Chiến sĩ' | 'Sĩ quan' | 'Chuyên nghiệp';
  role: 'USER' | 'ADMIN';
  mail?: string;
  phoneNumber?: string;
  hometown?: string;
}

export interface UserCreationRequest {
  fullName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  type: 'Chiến sĩ' | 'Sĩ quan' | 'Chuyên nghiệp';
  mail?: string;
  phoneNumber?: string;
  hometown?: string;
}

export interface UserUpdateRequest {
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  type: 'Chiến sĩ' | 'Sĩ quan' | 'Chuyên nghiệp';
  mail?: string;
  phoneNumber?: string;
  hometown?: string;
}

export interface ResultResponse {
  testResultId: number;
  sessionId: number;
  candidateId: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  score: number;
  timeTaken: number;
  submitAt: string;
  candidateAnswered: any[];
}

export interface UserDetailDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

const userService = {
  getAllUsers: async (token: string): Promise<User[]> => {
    try {
      const response = await fetch(`${API_URL}/user/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUserByUsername: async (token: string, username: string): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/user/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching user ${username}:`, error);
      throw error;
    }
  },

  createUser: async (token: string, userData: UserCreationRequest): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/user/one`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (token: string, username: string, userData: UserUpdateRequest): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/user/${username}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error updating user ${username}:`, error);
      throw error;
    }
  },

  deleteUser: async (token: string, username: string): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/user/${username}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error deleting user ${username}:`, error);
      throw error;
    }
  },

  getUsersByType: async (token: string, types: string[]): Promise<User[]> => {
    try {
      const response = await fetch(`${API_URL}/user/type`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(types)
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching users by type:', error);
      throw error;
    }
  },
  
  getMyInfo: async (token: string): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/user/myInfo`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching my info:', error);
      throw error;
    }
  },
  
  getAssignedSessions: async (token: string, status: string): Promise<ResultResponse[]> => {
    try {
      const response = await fetch(`${API_URL}/user/assigned-session/${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching assigned sessions with status ${status}:`, error);
      throw error;
    }
  },
  
  getUserAssignedSessions: async (token: string, username: string, status: string): Promise<ResultResponse[]> => {
    try {
      const response = await fetch(`${API_URL}/user/${username}/assigned-session/${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching assigned sessions for user ${username} with status ${status}:`, error);
      throw error;
    }
  },
  
  getUpcomingSession: async (token: string): Promise<any[]> => {
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
  
  createUsers: async (token: string, file: File): Promise<User[]> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_URL}/user/many`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error creating users from file:', error);
      throw error;
    }
  },
  
  getSessionCandidates: async (token: string, sessionId: number): Promise<User[]> => {
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
  }
};

export { userService };

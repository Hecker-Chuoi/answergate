// Define API URL
const API_URL = 'http://localhost:8080/exam';

export interface UserCreationRequest {
  fullName: string;
  dob: string; // Format: DD/MM/YYYY
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber?: string;
  mail?: string;
  hometown?: string;
  type: string;
}

export interface UserUpdateRequest {
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber?: string;
  mail?: string;
  hometown?: string;
  type: string;
}

export interface UserResponse {
  userId: number;
  username: string;
  fullName: string;
  dob?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber?: string;
  mail?: string;
  hometown?: string;
  role: 'USER' | 'ADMIN';
  type?: string;
}

export interface User {
  userId: number;
  username: string;
  fullName: string;
  dob?: string;
  gender?: string;
  phoneNumber?: string;
  mail?: string;
  hometown?: string;
  role: string;
  type: string;
}

export interface ResultResponse {
  testResultId: number;
  sessionId: number;
  candidateId: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  score: number;
  timeTaken: number;
  submitAt: string | null;
  candidateAnswered: any[];
}

const userService = {
  getMyInfo: async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/user/myInfo`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.result;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  },
  
  getAllUsers: async (token: string): Promise<UserResponse[]> => {
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
  
  getUserByUsername: async (token: string, username: string): Promise<UserResponse> => {
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
  
  getUsersByType: async (token: string, types: string[]): Promise<UserResponse[]> => {
    try {
      const response = await fetch(`${API_URL}/user/type`, {
        method: 'GET',
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
  
  createUser: async (token: string, userData: UserCreationRequest): Promise<UserResponse> => {
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
  
  updateUser: async (token: string, username: string, userData: UserUpdateRequest): Promise<UserResponse> => {
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
  
  getUserAssignedSession: async (token: string, username: string, status: string): Promise<ResultResponse[]> => {
    try {
      const response = await fetch(`${API_URL}/user/${username}/assigned-session/${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching assigned sessions for user ${username}:`, error);
      throw error;
    }
  },
  
  getMyAssignedSession: async (token: string, status: string): Promise<ResultResponse[]> => {
    try {
      const response = await fetch(`${API_URL}/user/assigned-session/${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Error fetching my assigned sessions:`, error);
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
  
  createUsers: async (token: string, file: File): Promise<UserResponse[]> => {
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
  }
};

export { userService };

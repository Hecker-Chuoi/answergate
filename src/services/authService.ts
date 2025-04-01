
// Standardized API Response type matching backend structure
type ApiResponse<T> = {
  statusCode: number;
  message: string;
  result: T;
};

type AuthResult = {
  authenticated: boolean;
  token: string;
};

type TokenValidationResult = {
  valid: boolean;
};

type UserInfo = {
  userId?: number;
  username: string;
  fullName: string;
  dob?: string;
  gender?: string;
  phoneNumber?: string;
  mail?: string;
  hometown?: string;
  role: 'USER' | 'ADMIN';
  type?: string;
};

const API_URL = 'http://localhost:8080/exam';

export const authService = {
  login: async (username: string, password: string): Promise<ApiResponse<AuthResult>> => {
    try {
      const response = await fetch(`${API_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      return data;
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      return {
        statusCode: 999, // Uncategorized error
        message: 'Lỗi kết nối đến máy chủ',
        result: { authenticated: false, token: '' }
      };
    }
  },
  
  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/introspect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      return data.result?.valid || false;
    } catch (error) {
      console.error('Lỗi xác thực token:', error);
      return false;
    }
  },

  getUserInfo: async (token: string): Promise<UserInfo | null> => {
    try {
      const response = await fetch(`${API_URL}/user/myInfo`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.result;
      }
      return null;
    } catch (error) {
      console.error('Lỗi lấy thông tin người dùng:', error);
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }
};

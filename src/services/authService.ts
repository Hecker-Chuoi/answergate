
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
      return data;
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      return {
        statusCode: 500,
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
      
      const data: TokenValidationResult = await response.json();
      return data.valid;
    } catch (error) {
      console.error('Lỗi xác thực token:', error);
      return false;
    }
  }
};

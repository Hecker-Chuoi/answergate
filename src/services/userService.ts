
import { toast } from "sonner";

const API_URL = 'http://localhost:8080/exam';

export type User = {
  userId?: number;
  username: string;
  fullName: string;
  dob?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber?: string;
  mail?: string;
  hometown?: string;
  role: 'USER' | 'ADMIN';
  type?: 'Chiến sĩ' | 'Sĩ quan' | 'Chuyên nghiệp';
};

export type UserCreationRequest = {
  fullName: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber?: string;
  mail?: string;
  hometown?: string;
  type: 'Chiến sĩ' | 'Sĩ quan' | 'Chuyên nghiệp';
};

export type UserUpdateRequest = {
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber?: string;
  mail?: string;
  hometown?: string;
  type: 'Chiến sĩ' | 'Sĩ quan' | 'Chuyên nghiệp';
};

export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  result: T;
};

export const userService = {
  getAllUsers: async (token: string): Promise<User[]> => {
    try {
      const response = await fetch(`${API_URL}/user/all`, {
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
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return [];
    }
  },

  getUserByUsername: async (token: string, username: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/user/${username}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data: ApiResponse<User> = await response.json();
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  createUser: async (token: string, userData: UserCreationRequest): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/user/one`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        const data: ApiResponse<User> = await response.json();
        toast.success('Tạo người dùng thành công');
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  updateUser: async (token: string, username: string, userData: UserUpdateRequest): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/user/${username}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        const data: ApiResponse<User> = await response.json();
        toast.success('Cập nhật người dùng thành công');
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  deleteUser: async (token: string, username: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/user/${username}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        toast.success('Xóa người dùng thành công');
        return true;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return false;
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return false;
    }
  },

  uploadUsersExcel: async (token: string, file: File): Promise<User[] | null> => {
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
      
      if (response.ok) {
        const data: ApiResponse<User[]> = await response.json();
        toast.success('Tải lên và tạo người dùng thành công');
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi tải lên tệp Excel:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  },

  getUsersByType: async (token: string, types: string[]): Promise<User[] | null> => {
    try {
      const response = await fetch(`${API_URL}/user/type`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(types)
      });
      
      if (response.ok) {
        const data: ApiResponse<User[]> = await response.json();
        return data.result;
      }
      
      const errorData = await response.json();
      toast.error(`Lỗi: ${errorData.message}`);
      return null;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng theo loại:', error);
      toast.error('Không thể kết nối đến máy chủ');
      return null;
    }
  }
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 
  | 'superadmin'  // 超级管理员
  | 'doctor'      // 医生
  | 'nurse'       // 护士
  | 'director'    // 科室主任
  | 'admin'       // 系统管理员
  | 'cashier'     // 收费处
  | 'pharmacist'  // 药剂师
  | 'technician'  // 检验/检查技师
  | 'receptionist'; // 导医台

interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (credentials) => {
        // 这里应该调用实际的登录 API
        // 示例实现
        const mockUsers: Record<string, User> = {
          'superadmin': {
            id: 'SA001',
            name: '超级管理员',
            role: 'superadmin',
            avatar: 'https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg?auto=compress&cs=tinysrgb&w=150'
          },
          'doctor1': {
            id: 'D001',
            name: '张医生',
            role: 'doctor',
            department: '内科',
            avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150'
          },
          'nurse1': {
            id: 'N001',
            name: '李护士',
            role: 'nurse',
            department: '内科',
            avatar: 'https://images.pexels.com/photos/5214995/pexels-photo-5214995.jpeg?auto=compress&cs=tinysrgb&w=150'
          },
          'director1': {
            id: 'DIR001',
            name: '王主任',
            role: 'director',
            department: '内科',
            avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150'
          },
          'admin1': {
            id: 'A001',
            name: '管理员',
            role: 'admin',
            avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150'
          },
          'cashier1': {
            id: 'C001',
            name: '赵收费员',
            role: 'cashier',
            avatar: 'https://images.pexels.com/photos/3201580/pexels-photo-3201580.jpeg?auto=compress&cs=tinysrgb&w=150'
          },
          'pharmacist1': {
            id: 'P001',
            name: '钱药剂师',
            role: 'pharmacist',
            avatar: 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg?auto=compress&cs=tinysrgb&w=150'
          },
          'technician1': {
            id: 'T001',
            name: '孙技师',
            role: 'technician',
            avatar: 'https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg?auto=compress&cs=tinysrgb&w=150'
          },
          'receptionist1': {
            id: 'R001',
            name: '周导医',
            role: 'receptionist',
            avatar: 'https://images.pexels.com/photos/5998474/pexels-photo-5998474.jpeg?auto=compress&cs=tinysrgb&w=150'
          }
        };

        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        const user = mockUsers[credentials.username];
        if (user && credentials.password === '123456') {
          set({ user, isAuthenticated: true });
        } else {
          throw new Error('用户名或密码错误');
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);

export default useAuthStore;

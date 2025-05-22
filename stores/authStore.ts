import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User } from '@/types/auth';

// Mock users for demo purposes
const mockUsers: Record<string, { password: string; user: User }> = {
  demo: {
    password: 'demo123',
    user: {
      id: '1',
      username: 'demo',
      storeName: 'HAJI RAHMATHULLAH STORE',
      storeAddress: '1, PARK ROAD, 01-K95B, PEOPLES PARK COMPLEX, SINGAPORE, 059108'
    }
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        try {
          console.log('AuthStore: Starting login process');
          set({ isLoading: true, error: null });
          
          // Simulate API call
          console.log('AuthStore: Simulating API call');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const userRecord = mockUsers[username.toLowerCase()];
          
          if (userRecord && userRecord.password === password) {
            set({ 
              user: userRecord.user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            return true;
          } else {
            throw new Error('Invalid username or password');
          }
        } catch (error) {
          set({ 
            error: error.message,
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          return false;
        }
      },
      
      register: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (mockUsers[username.toLowerCase()]) {
          set({ 
            error: 'Username already exists',
            isLoading: false
          });
          return false;
        } else {
          const newUser: User = {
            id: Date.now().toString(),
            username,
            storeName: 'My Store',
            storeAddress: 'Store Address'
          };
          
          // In a real app, we would call an API to create the user
          mockUsers[username.toLowerCase()] = {
            password,
            user: newUser
          };
          
          set({ 
            user: newUser,
            isAuthenticated: true,
            isLoading: false
          });
          return true;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: (data) => {
        set(state => {
          if (!state.user) return state;
          
          const updatedUser = { ...state.user, ...data };
          
          // Update the mock user data
          if (mockUsers[state.user.username.toLowerCase()]) {
            mockUsers[state.user.username.toLowerCase()].user = updatedUser;
          }
          
          return { user: updatedUser };
        });
      },
      
      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const username = useAuthStore.getState().user?.username;
        
        if (!username || !mockUsers[username.toLowerCase()]) {
          set({ 
            error: 'User not found',
            isLoading: false
          });
          return false;
        }
        
        if (mockUsers[username.toLowerCase()].password !== currentPassword) {
          set({ 
            error: 'Current password is incorrect',
            isLoading: false
          });
          return false;
        }
        
        // Update password
        mockUsers[username.toLowerCase()].password = newPassword;
        
        set({ isLoading: false });
        return true;
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  skills: string;
  workExperience: string;
  education: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: async (user: User) => {
    await AsyncStorage.setItem('user', JSON.stringify(user)); // Save user to Async Storage
    set({ isAuthenticated: true, user });
  },

  logout: async () => {
    await AsyncStorage.removeItem('user'); // Remove user from Async Storage
    set({ isAuthenticated: false, user: null });
  },

  loadUser: async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      set({ isAuthenticated: true, user: JSON.parse(userData) });
    }
  },
}));

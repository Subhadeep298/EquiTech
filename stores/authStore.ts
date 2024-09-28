import {create} from 'zustand';

interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: (user: User) => set({ isAuthenticated: true, user }),

  logout: () => set({ isAuthenticated: false, user: null }),
}));

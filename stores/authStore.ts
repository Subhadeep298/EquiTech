import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  password : string;
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
  appliedJobs: string[]; // Array to store job IDs the user has applied to
  login: (user: User) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
  applyToJob: (jobId: string) => void; // Function to add a job to appliedJobs
  hasAppliedToJob: (jobId: string) => any; // Function to check if user applied to a job
  setUser: (user: User) => void; // New method to update user information
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  appliedJobs: [],

  login: async (user: User) => {
    await AsyncStorage.setItem('user', JSON.stringify(user)); // Save user to Async Storage
    set({ isAuthenticated: true, user });
  },

  logout: async () => {
    await AsyncStorage.removeItem('user'); // Remove user from Async Storage
    set({ isAuthenticated: false, user: null, appliedJobs: [] });
  },

  loadUser: async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      const appliedJobs = await AsyncStorage.getItem('appliedJobs') || '[]';
      set({ isAuthenticated: true, user: parsedUser, appliedJobs: JSON.parse(appliedJobs) });
    }
  },

  applyToJob: async (jobId: string) => {
    set((state) => ({
      appliedJobs: [...state.appliedJobs, jobId],
    }));
    await AsyncStorage.setItem('appliedJobs', JSON.stringify([...useAuthStore.getState().appliedJobs, jobId]));
  },

  hasAppliedToJob: (jobId: string) => {
    return useAuthStore.getState().appliedJobs.includes(jobId);
  },

  setUser: (user: User) => {
    set({ user });
  }, // Implement the setUser method
}));

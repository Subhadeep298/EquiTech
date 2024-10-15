import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { your_json_url } from '../utils/url';
import { JobData } from '../utils/types';

interface User {
  id: string;
  password: string;
  email: string;
  name: string;
  phoneNumber: string;
  skills: string;
  workExperience: string;
  education: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  appliedJobs: string[];
  isJobSeeker: boolean;
  jobPosted: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  applyToJob: (jobId: string) => Promise<void>;
  hasAppliedToJob: (jobId: string) => boolean;
  setUser: (user: User) => void;
  setIsJobSeeker: (isJobSeeker: boolean) => Promise<void>;
  fetchAppliedJobs: (userId: string) => Promise<void>;
  postJob: (JobData: any)=> any;
  resetJobPosted: () => any;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  appliedJobs: [],
  isJobSeeker: false, // Default to true, can be changed later
  jobPosted: false,

  // Method to trigger when a job is successfully posted
  postJob: async (jobData: any) => {
    try {
      const response = await axios.post(`http://${your_json_url}/jobs`, jobData);

      if (response.status === 201) {
        set({ jobPosted: true }); // Set jobPosted to true when job is successfully posted
        return response;
      }
    } catch (error) {
      console.error('Error posting job:', error);
    }
  },

  resetJobPosted: () => {
    set({ jobPosted: false }); // Reset jobPosted to false after refreshing jobs
  },
  login: async (user: User) => {
    const isJobSeeker = user.role === 'jobseeker';
    
    // Store user data in AsyncStorage
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('isJobSeeker', JSON.stringify(isJobSeeker));
    
    // Update state
    set({ isAuthenticated: true, user, isJobSeeker });
  },

  logout: async () => {
    // Remove user data from AsyncStorage
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('isJobSeeker');
    await AsyncStorage.removeItem('appliedJobs');
    
    // Reset state
    set({ isAuthenticated: false, user: null, appliedJobs: [], isJobSeeker: true });
  },

  loadUser: async () => {
    const userData = await AsyncStorage.getItem('user');
    const isJobSeekerData = await AsyncStorage.getItem('isJobSeeker');
    const appliedJobsData = await AsyncStorage.getItem('appliedJobs') || '[]';

    if (userData) {
      const parsedUser = JSON.parse(userData);
      const isJobSeeker = isJobSeekerData ? JSON.parse(isJobSeekerData) : null;
      const appliedJobs = JSON.parse(appliedJobsData);
      
      // Update state
      set({ isAuthenticated: true, user: parsedUser, appliedJobs, isJobSeeker });
    }
  },

  applyToJob: async (jobId: string) => {
    const currentAppliedJobs = get().appliedJobs;

    // Update applied jobs state
    const updatedJobs = [...currentAppliedJobs, jobId];
    set({ appliedJobs: updatedJobs });
    
    // Save to AsyncStorage
    await AsyncStorage.setItem('appliedJobs', JSON.stringify(updatedJobs));
  },

  hasAppliedToJob: (jobId: string) => {
    return get().appliedJobs.includes(jobId);
  },

  setUser: (user: User) => {
    set({ user });
  },

  setIsJobSeeker: async (isJobSeeker: boolean) => {
    // Store isJobSeeker state in AsyncStorage
    await AsyncStorage.setItem('isJobSeeker', JSON.stringify(isJobSeeker));
    
    // Update state
    set({ isJobSeeker });
  },

  fetchAppliedJobs: async (userId: any) => {
    try {
      const response = await axios.get(`http://${your_json_url}/jobApplications`);
    const appliedJobs = response.data
      .filter((jobApplication: any) => 
        jobApplication.applicants.some((applicant: any) => applicant.userId === userId)
      )
      .map((jobApplication: any) => jobApplication.jobId);
      set({ appliedJobs });
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    }
  }
}));

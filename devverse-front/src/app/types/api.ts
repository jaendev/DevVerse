
// Response base for the api
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// Auth response
export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    username?: string;
  };
  message?: string;
}

// Login data
export interface LoginRequest {
  email: string;
  password: string;
}

// Register data
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// User profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username?: string;
  bio?: string;
  avatar?: string;
  joinedAt: string;
}

// Dashboard stats
export interface DashboardStats {
  totalProjects: number;
  totalStars: number;
  totalCommits: number;
  activeProjects: number;
}

// Project
export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  lastUpdated: string;
  isPublic: boolean;
  repositoryUrl?: string;
}
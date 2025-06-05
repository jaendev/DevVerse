// Type definitions for the application

// User-related types
export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

// Authentication-related types
export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Form-related types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}
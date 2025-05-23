
import { apiClient } from '@/lib/api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile
} from '@/app/types/api';

export class AuthService {
  // Login
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/api/auth/login',
        credentials,
        false // No incluir auth header para login
      );

      // Guardar token y usuario en localStorage
      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  // register
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/api/auth/register',
        userData,
        false // Not include auth header for registration
      );

      // Save token and user in localStorage
      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  // Logout
  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user
  static getCurrentUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;

    const userString = localStorage.getItem('user');
    if (!userString) return null;

    try {
      return JSON.parse(userString);
    } catch (error) {
      return null;
    }
  }

  // Verify if authenticated
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get token
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  // Verify token (call to backend)
  static async verifyToken(): Promise<boolean> {
    try {
      await apiClient.get('/api/auth/verify');
      return true;
    } catch (error) {
      this.logout(); // Eliminar token inválido
      return false;
    }
  }
}
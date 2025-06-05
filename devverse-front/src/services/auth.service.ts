
import { apiClient } from '@/src/lib/api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
  GitHubAuthRequest,
  GitHubAuthUrlResponse
} from '../../app/types/api';

export class AuthService {
  // Login
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/api/auth/login',
        credentials,
        false // No include auth header for login
      );

      // Save token and user in localStorage
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
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Verify if authenticated
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('token');
    return !!token;
  }

  // Verify token (call to backend)
  // static async verifyToken(): Promise<{ isValid: boolean; user?: UserProfile }> {
  //   try {
  //     const response = await apiClient.get<{
  //       success: boolean;
  //       userId: string;
  //       email: string;
  //     }>('/api/auth/verify');

  //     return {
  //       isValid: true,
  //       user: response
  //     };
  //   } catch (error) {
  //     console.error('Error verifying token:', error);
  //     this.logout(); // Eliminar token inválido
  //     return { isValid: false };
  //   }
  // }

  // Get token
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  // Get GitHub auth URL
  static async getGitHubAuthUrl(): Promise<GitHubAuthUrlResponse> {
    try {
      const response = await apiClient.get<GitHubAuthUrlResponse>(
        '/api/auth/github',
        false // No auth header needed
      );

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('github_oauth_state', response.state);
      }
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get GitHub auth URL');
    }
  }

  // Authtenticate with GitHub callback
  static async authenticateWithGitHub(code: string, state: string): Promise<AuthResponse> {
    try {
      // Verify state matches
      if (typeof window !== 'undefined') {
        const storedState = sessionStorage.getItem('github_oauth_state')
        if (storedState !== state) {
          throw new Error('Invalid state parameter');
        }
        sessionStorage.removeItem('github_oauth_state');
      }

      const response = await apiClient.post<AuthResponse>(
        '/api/auth/github/callback',
        { code, state } as GitHubAuthRequest,
        false // No auth header needed
      )

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response; // Return the AuthResponse objec
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'GitHub authentication failed');
    }
  }

  static redirectToGitHubAuth() {
    this.getGitHubAuthUrl().then((response) => {
      window.location.href = response.authUrl;
    }).catch((error) => {
      console.error('Error redirecting to GitHub auth:', error);
    });
  }

}
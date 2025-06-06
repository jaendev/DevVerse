import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthService } from '@/src/services';
import type { UserProfile, LoginRequest, RegisterRequest } from '@/src/services';

interface AuthState {
  // Estate
  user: UserProfile | null;
  joinedAt: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  loginWithGitHub: (code: string, state: string) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => void;
  // Utilities
  clearError: () => void;
  setUser: (user: UserProfile) => void;
  checkAuth: () => Promise<boolean>;
  getGitHubAuthUrl: () => Promise<string>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      joinedAt: null,
      // Login action
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthService.login(credentials);

          if (response.success) {
            set({
              user: { ...response.user, joinedAt: new Date().toISOString() },
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              joinedAt: new Date().toISOString(),
            })
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
            isAuthenticated: false,
          });
        }
      },

      // Register action
      register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthService.register(userData);
          if (response.success) {
            set({
              user: { ...response.user, joinedAt: new Date().toISOString() },
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              joinedAt: new Date().toISOString(),
            });
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
            isAuthenticated: false,
          });
        }
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          joinedAt: null,
        });
      },

      // Clear error action
      clearError: () => {
        set({ error: null });
      },

      // Set user action
      setUser: (user: UserProfile) => set({ user }),

      // Check auth action
      checkAuth: async () => {
        const { token, user } = get();

        // Verificar que tenemos token y usuario
        if (!token || !user) {
          set({
            isAuthenticated: false,
            token: null,
            user: null
          });
          return false;
        }

        // Si tenemos datos, asumir que está autenticado
        set({ isAuthenticated: true });
        return true;
      },

      getGitHubAuthUrl: async () => {
        try {
          const response = await AuthService.getGitHubAuthUrl();
          return response.authUrl;
        } catch (error) {
          console.error('Error fetching GitHub auth URL:', error);
          throw error;
        }
      },

      loginWithGitHub: async (code: string, state: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await AuthService.authenticateWithGitHub(code, state);

          if (response.success) {
            set({
              user: { ...response.user, joinedAt: new Date().toISOString() },
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              joinedAt: new Date().toISOString(),
            });
          } else {
            throw new Error(response.message || 'GitHub authentication failed');
          }

        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'GitHub authentication failed',
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

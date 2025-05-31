
export { AuthService } from './auth.service';
export { UserService } from './user.service';

// Re-exportar tipos comunes
export type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
  DashboardStats,
  Project,
  GitHubAuthUrlResponse,
  GitHubAuthRequest,
  ApiResponse,
} from '@/app/types/api';
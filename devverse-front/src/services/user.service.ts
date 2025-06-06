
import { apiClient } from '@/src/lib/api';
import { UserProfile, DashboardStats, Project } from '../../app/types/api';

export class UserService {
  // Get user profile
  static async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/api/user/profile');
  }

  // Update profile
  static async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    return apiClient.put<UserProfile>('/api/user/profile', profileData);
  }

  // Get stats dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/api/user/dashboard-stats');
  }

  // Get user projects
  static async getProjects(): Promise<Project[]> {
    return apiClient.get<Project[]>('/api/user/projects');
  }

  // Create new project
  static async createProject(projectData: Omit<Project, 'id' | 'lastUpdated'>): Promise<Project> {
    return apiClient.post<Project>('/api/user/projects', projectData);
  }

  // Upadte project
  static async updateProject(projectId: string, projectData: Partial<Project>): Promise<Project> {
    return apiClient.put<Project>(`/api/user/projects/${projectId}`, projectData);
  }

  // Delete project
  static async deleteProject(projectId: string): Promise<void> {
    return apiClient.delete<void>(`/api/user/projects/${projectId}`);
  }
}
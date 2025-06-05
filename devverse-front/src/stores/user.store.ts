import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserService } from '@/src/services';
import type { DashboardStats, Project } from '@/src/services';

interface UserState {
  // State
  dashBoardStats: DashboardStats | null;
  projects: Project[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadDashBoardStats: () => Promise<void>;
  loadProjects: () => Promise<void>;
  createProject: (projectData: Omit<Project, 'id' | 'lastUpdate'>) => Promise<void>;
  updateProject: (projectId: string, projectData: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  // Utilities
  clearError: () => void;
  resetState: () => void;
}

const initialState = {
  dashBoardStats: null,
  projects: [],
  isLoading: false,
  error: null,
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // State
      ...initialState,

      // Load dashboard stats
      loadDashBoardStats: async () => {
        set({ isLoading: true, error: null });

        try {
          const stats = await UserService.getDashboardStats();
          set({ dashBoardStats: stats, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      // Load projects
      loadProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const projects = await UserService.getProjects();
          set({ projects, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      // Create project
      createProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
          const newProject = await UserService.createProject(projectData);
          const { projects } = get();
          set({
            projects: [...projects, newProject],
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
          throw error;
        }
      },

      // Update project
      updateProject: async (projectId, projectData) => {
        set({ isLoading: true, error: null });
        try {
          const updatedProject = await UserService.updateProject(projectId, projectData);
          const { projects } = get();

          set({
            projects: projects.map(project => project.id === projectId ? updatedProject : project),
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
          throw error;
        }
      },

      // Delete project
      deleteProject: async (projectId) => {

        set({ isLoading: true, error: null });
        try {
          await UserService.deleteProject(projectId);
          const { projects } = get();
          set({
            projects: projects.filter(project => project.id !== projectId),
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
          throw error;
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Reset state
      resetState: () => {
        set(initialState);
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        dashBoardStats: state.dashBoardStats,
        projects: state.projects,
      })
    }
  )
)
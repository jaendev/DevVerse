'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Code,
  GitBranch,
  Star,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Github,
  ExternalLink,
  Settings,
  LogOut
} from 'lucide-react';
import Container from '@/app/components/ui/Container';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username?: string;
  bio?: string;
  avatar?: string;
  joinedAt: string;
}

interface ProjectStats {
  totalProjects: number;
  totalStars: number;
  totalCommits: number;
  activeProjects: number;
}

interface RecentProject {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  lastUpdated: string;
  isPublic: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    totalStars: 0,
    totalCommits: 0,
    activeProjects: 0
  });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      // Aquí cargarías los datos reales del usuario desde tu API
      loadDashboardData();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  const loadDashboardData = async () => {
    try {
      // Simular carga de datos - reemplaza con llamadas reales a tu API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStats({
        totalProjects: 12,
        totalStars: 284,
        totalCommits: 1847,
        activeProjects: 5
      });

      setRecentProjects([
        {
          id: '1',
          name: 'DevVerse Frontend',
          description: 'Modern React application for developer social network',
          language: 'TypeScript',
          stars: 45,
          lastUpdated: '2 hours ago',
          isPublic: true
        },
        {
          id: '2',
          name: 'API Gateway',
          description: 'Microservices API gateway with authentication',
          language: 'C#',
          stars: 23,
          lastUpdated: '1 day ago',
          isPublic: false
        },
        {
          id: '3',
          name: 'React Components Library',
          description: 'Reusable UI components for React applications',
          language: 'JavaScript',
          stars: 156,
          lastUpdated: '3 days ago',
          isPublic: true
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      'TypeScript': 'bg-blue-500',
      'JavaScript': 'bg-yellow-500',
      'C#': 'bg-purple-500',
      'Python': 'bg-green-500',
      'Java': 'bg-red-500',
      'Go': 'bg-cyan-500'
    };
    return colors[language] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Container className="py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Developer'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here&apos;s what&apos;s happening with your projects today.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="outline" onClick={() => router.push('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="elevated">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <Code className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProjects}</p>
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Stars</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStars}</p>
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <GitBranch className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Commits</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCommits}</p>
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeProjects}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>

              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getLanguageColor(project.language)}`}></div>
                        <Github className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                          {!project.isPublic && (
                            <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                              Private
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                          <span>{project.language}</span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {project.stars}
                          </span>
                          <span>Updated {project.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button variant="outline">View All Projects</Button>
              </div>
            </Card>
          </div>

          {/* Profile & Quick Actions */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card variant="elevated">
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" fullWidth>
                    Edit Profile
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card variant="elevated">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" size="sm" fullWidth>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  <Users className="h-4 w-4 mr-2" />
                  Find Developers
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </Card>

            {/* Activity Feed */}
            <Card variant="elevated">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">Pushed to <span className="font-medium">main</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">Created new project</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">Received 5 new stars</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
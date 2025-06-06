/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '../components/ui/Container';
import { GitHubRepo } from '@/app/types/github';
import { useGitHubAPI } from '@/src/hooks/useGitHubAPI';
import { useSession } from 'next-auth/react';
import StatsSkeleton from '@/app/components/ui/StatsSkeleton';
import {
  User,
  Code,
  GitBranch,
  Star,
  TrendingUp,
  Github,
  ExternalLink,
  Settings,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const { error, getRecentActivity, getRepositories, getUserStats, hasToken, loading } = useGitHubAPI();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (hasToken) {
      loadGitHubData();
    }
  }, [status, router, hasToken]);

  const loadGitHubData = async () => {
    try {
      const reposData = await getRepositories(10);
      setRepos(reposData);

      const statsData = await getUserStats();
      setStats(statsData);

      const activityData = await getRecentActivity();
      setActivity(activityData);

    } catch (err) {
      console.error('Error loading GitHub data:', err);
    }
  };


  const maskEmail = (email: string) => {
    if (!email) return '';

    const [user, domain] = email.split('@');
    if (!user || !domain) return email;

    const maskedUser = user.substring(0, 2) + '*'.repeat(Math.max(user.length - 2, 3));
    return maskedUser + '@' + domain;
  };

  const parseDate = (dateString: string) => {
    // If user is from Europe, return date in DD/MM/YYYY format
    const dateSplitbyT = dateString.split('T')[0];
    const dateParsed = dateSplitbyT.split('-').reverse().join('/');

    // TODO: If user is from USA, return date in MM/DD/YYYY format

    return dateParsed
  }

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

  const getRepoStatusBadge = (repo: GitHubRepo) => {
    const badges = [];

    // Privacity badge
    if (repo.private) {
      badges.push(
        <span key="private" className="py-1 text-xs text-gray-900 dark:text-white">
          Private
        </span>
      );
    } else {
      badges.push(
        <span key="public" className="py-1 text-xs text-gray-900 dark:text-white">
          Public
        </span>
      );
    }

    // Badge de fork
    if (repo.fork) {
      badges.push(
        <span key="fork" className="py-1 text-xs text-gray-900 dark:text-white">
          Fork
        </span>
      );
    }

    // Badge archived
    if (repo.archived) {
      badges.push(
        <span key="archived" className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
          📦 Archived
        </span>
      );
    }

    return badges;
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={loadGitHubData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try
        </button>
      </div>
    );
  }

  if (loading) {
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
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <Container className="py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {session?.user?.name?.split(' ')[0] || 'Developer'}!
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
          </div>
        </div>

        {/* Stats Cards */}
        {!stats ? (
          <StatsSkeleton
          />
        ) : stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card variant="elevated">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                  <Code className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.total_repos}</p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.total_stars}</p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.total_commits}</p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{activity.length}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
                {/* <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button> */}
              </div>

              <div className="space-y-4">
                {repos.slice(0, 5).map((project) => (
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
                          <a
                            className="font-medium text-gray-900 dark:text-white"
                            href={project.html_url}
                            target="_blank">
                            {project.name}
                          </a>
                          {getRepoStatusBadge(project)}
                          <span className='text-xs text-gray-500 dark:text-gray-200'>{project.default_branch}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{project.description || 'No description'}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                          <span>{project.language}</span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {project.stargazers_count}
                          </span>
                          <span>Updated {parseDate(project.updated_at)}</span>
                          <span>{(project.size / 1024).toFixed(1)} MB</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <a
                        target='_blank'
                        href={project.html_url}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button variant="outline">View All Projects</Button>
              </div>
            </Card>
          </div>

          {/* Profile & Languages */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card variant="elevated">
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{session?.user?.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{maskEmail(session?.user?.email || '')}</p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" fullWidth>
                    Edit Profile
                  </Button>
                </div>
              </div>
            </Card>

            {/* Languages more used */}
            <Card variant="elevated">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Most used languages</h3>
              {stats?.languages && (
                <>
                  <div className="space-y-2">
                    {Object.entries(stats.languages)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .slice(0, 5)
                      .map(([language, count]) => (
                        <div key={language} className="flex justify-between items-center dark:text-white">
                          <span className="font-medium">{language}</span>
                          <span className="text-gray-600 dark:text-white">{count} repos</span>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </Card>

            {/* Activity Feed */}
            <Card variant="elevated">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="h-48 md:h-64 overflow-y-auto space-y-3 pr-5">
                {activity && activity.length > 0 ? (
                  activity.slice(0, 20).map((event, index) => (
                    <div key={event.id || index} className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-600 dark:text-white">
                        {event.type === 'PushEvent' && `📤 Push ${event.repo?.name || 'Unknown repo'}`}
                        {event.type === 'CreateEvent' && `🆕 Create ${event.payload?.ref_type || 'branch'} en ${event.repo?.name || 'Unknown repo'}`}
                        {event.type === 'WatchEvent' && `⭐ Starred ${event.repo?.name || 'Unknown repo'}`}
                        {event.type === 'ForkEvent' && `🍴 Fork ${event.repo?.name || 'Unknown repo'}`}
                        {!['PushEvent', 'CreateEvent', 'WatchEvent', 'ForkEvent'].includes(event.type) &&
                          `${event.type} en ${event.repo?.name || 'Unknown repo'}`}
                      </span>
                      <span className="text-gray-400 ml-auto flex-shrink-0">
                        {event.created_at ? new Date(event.created_at).toLocaleDateString() : 'Unknown date'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No recent activity found
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div >
      </Container >
    </div >
  );
}
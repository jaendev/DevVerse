/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSession } from "next-auth/react";
import { useState, useCallback } from "react";
import { GitHubRepo, GitHubStats } from "@/app/types/github";

export function useGitHubAPI() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeGitHubRequest = useCallback(async (endpoint: string) => {
    if (!session?.accessToken) {
      throw new Error("No GitHub acces token available");
    }

    const response = await fetch(`https://api.github.com${endpoint}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'DevVerse-App'
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return response.json()
  }, [session?.accessToken])

  // Get user's repositories
  const getRepositories = useCallback(async (per_page = 30) => {
    setLoading(true)
    setError(null)
    try {
      const repos = await makeGitHubRequest(`/user/repos?per_page=${per_page}&short=updated`)
      return repos as GitHubRepo[]
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error fetching repositories')
      return []
    } finally {
      setLoading(false)
    }
  }, [makeGitHubRequest])

  // Get user's stats
  const getUserStats = useCallback(async () => {
    try {
      // Get basic user info
      const user = await makeGitHubRequest('/user')

      // get repos to calculate stats
      const repos = await makeGitHubRequest(`/users/${user.login}/repos?per_page=100`)

      const stats: GitHubStats = {
        total_repos: user.public_repos + (user.total_private_repos || 0),
        total_commits: 0, // TODO: implement
        total_stars: repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0),
        total_forks: repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0),
        languages: {},
      }

      // Container lenguages
      repos.forEach((repo: any) => {
        if (repo.language) {
          stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1
        }
      })

      for (const repo of repos) {
        try {
          // Get user commits in this current repo
          const commits = await makeGitHubRequest(
            `/repos/${repo.full_name}/commits?author=${user.login}&per_page=100`
          );

          let repoCommits = commits.length;

          // If there are exactly 100 commits, there may be more (pagination)
          if (commits.length === 100) {
            let page = 2;
            let hasMore = true;

            // Get more pages (max 5 pages for repo to avoid rate limiting)
            while (hasMore && page <= 5) {
              try {
                const moreCommits = await makeGitHubRequest(
                  `/repos/${repo.full_name}/commits?author=${user.login}&per_page=100&page=${page}`
                );

                if (moreCommits.length === 0) {
                  hasMore = false;
                } else {
                  repoCommits += moreCommits.length;
                  page++;

                  if (moreCommits.length < 100) {
                    hasMore = false;
                  }
                }

                // Lite sleep for avoid rate limit
                await new Promise(resolve => setTimeout(resolve, 50));

              } catch (pageError) {
                console.warn(`Error getting page ${page} for ${repo.full_name}:`, pageError);
                hasMore = false;
              }
            }
          }

          stats.total_commits += repoCommits;

          // Litle pause between repos for avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (repoError) {
          console.warn(`⚠️ No se pudieron obtener commits de ${repo.full_name}:`, repoError);
          // Continue with the next repository without failing
        }
      }

      return stats
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error fetching user stats')
      return null
    } finally {
      setLoading(false)
    }
  }, [makeGitHubRequest])


  // Get commits for a repository
  const getRepoCommits = useCallback(async (owner: string, repo = 100) => {
    try {
      const commits = await makeGitHubRequest(`/repos/${owner}/${repo}/commits?author=${session?.user?.username}&per_page=100`)
      return commits
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error fetching commits')
      return []
    } finally {
      setLoading(false)
    }
  }, [makeGitHubRequest, session?.user?.username])

  // Get recent events
  const getRecentActivity = useCallback(async () => {
    try {
      const events = await makeGitHubRequest(`/users/${session?.user?.username}/events?per_page=100`)
      return events
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error fetching recent activity')
      return []
    } finally {
      setLoading(false)
    }
  }, [makeGitHubRequest, session?.user?.username])

  return {
    loading,
    error,
    getRepositories,
    getUserStats,
    getRepoCommits,
    getRecentActivity,
    hasToken: !!session?.accessToken
  };
}
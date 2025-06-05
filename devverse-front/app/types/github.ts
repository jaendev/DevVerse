export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  private: boolean;
  visibility: 'public' | 'private' | 'internal';
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  size: number;
  default_branch: string;
  topics: string[];
  license: {
    key: string;
    name: string;
  } | null;
}

export interface GitHubStats {
  total_repos: number;
  total_commits: number;
  total_stars: number;
  total_forks: number;
  languages: Record<string, number>;
}
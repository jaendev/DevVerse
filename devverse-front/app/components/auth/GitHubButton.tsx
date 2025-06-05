'use client';

import { useState } from 'react';
import { Github } from 'lucide-react';
import Button from '../ui/Button';
import { useAuthStore } from '@/src/stores';

interface GitHubButtonProps {
  text?: string;
  className?: string;
  disabled?: boolean;
}

export default function GitHubButton({
  text = "Continue with GitHub",
  className = "",
  disabled = false
}: GitHubButtonProps) {
  const { getGitHubAuthUrl } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = async () => {
    try {
      setIsLoading(true);
      const authUrl = await getGitHubAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('GitHub login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGitHubLogin}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      fullWidth
      className={`border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 ${className}`}
    >
      <Github className="h-5 w-5 mr-3" />
      {text}
    </Button>
  );
}
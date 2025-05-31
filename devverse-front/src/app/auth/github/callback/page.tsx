'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Container from '@/app/components/ui/Container';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useAuthStore } from '@/stores';

export default function GitHubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGitHub } = useAuthStore();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing GitHub authentication...');

  useEffect(() => {
    const handleGitHubCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`GitHub authentication was ${error === 'access_denied' ? 'cancelled' : 'failed'}`);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state parameter');
        }

        await loginWithGitHub(code, state);

        setStatus('success');
        setMessage('Successfully authenticated with GitHub!');

        // Redirect to dashboard after short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);

      } catch (error) {
        console.error('GitHub callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
      }
    };

    handleGitHubCallback();
  }, [searchParams, loginWithGitHub, router]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-12 w-12 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-gray-600 dark:text-gray-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Container size="sm">
        <Card variant="elevated" className="text-center">
          <div className="flex flex-col items-center">
            {getStatusIcon()}

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-2">
              {status === 'loading' && 'Authenticating...'}
              {status === 'success' && 'Welcome to DevVerse!'}
              {status === 'error' && 'Authentication Failed'}
            </h1>

            <p className={`${getStatusColor()} mb-6`}>
              {message}
            </p>

            {status === 'success' && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Redirecting to your dashboard...
              </p>
            )}

            {status === 'error' && (
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/login')}
                  fullWidth
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  fullWidth
                >
                  Back to Home
                </Button>
              </div>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import { TextField } from '@/app/components/ui/TextField';
import Button from '@/app/components/ui/Button';
import Checkbox from '@/app/components/ui/Checkbox';
import Container from '@/app/components/ui/Container';
import type { LoginFormData } from '@/app/types';
import { useAuthStore } from '@/stores';
import GitHubButton from '@/app/components/auth/GitHubButton';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when field is modified
    if (validationErrors[name as keyof LoginFormData]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (error) {
      clearError();
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await login({
        email: formData.email,
        password: formData.password,
      })

      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed: ', error)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Container size="sm" className="flex-1 flex items-center justify-center py-12">
        <Card variant="elevated" className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Log in to your developer account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={validationErrors.email}
              fullWidth
              placeholder="your.email@example.com"
              required
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={validationErrors.password}
              fullWidth
              required
            />

            <div className="flex justify-between items-center">
              <Checkbox
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                label="Remember me"
              />

              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Log In
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* GitHub Login */}
            <GitHubButton />

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </Card>
      </Container>

      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 p-2 flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        <span>Back to Home</span>
      </button>
    </div>
  );
}
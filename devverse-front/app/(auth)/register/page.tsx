'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Card from '../../components/ui/Card';
import { TextField } from '../../components/ui/TextField';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import Container from '../../components/ui/Container';
import type { RegisterFormData } from '../../types';
import { useAuthStore } from '@/src/stores';
import GitHubButton from '../../components/auth/GitHubButton';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  // Separate validation erros and lauth errors
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when field is modified
    if (validationErrors[name as keyof RegisterFormData]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear error auth when user begin type
    if (error) {
      clearError()
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await register({
        username: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      router.push('/dashboard')
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Container size="sm" className="flex-1 flex items-center justify-center py-12">
        <Card variant="elevated" className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Join the developer community today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Full Name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              error={validationErrors.name}
              fullWidth
              placeholder="John Doe"
              required
            />

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
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={validationErrors.password}
              helperText="Must be at least 8 characters long"
              fullWidth
              required
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={validationErrors.confirmPassword}
              fullWidth
              required
            />

            <Checkbox
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              label="I agree to the Terms of Service and Privacy Policy"
              error={validationErrors.acceptTerms}
              className="mt-4"
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-6"
            >
              Create Account
            </Button>

            {/* Divider */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* GitHub Registration */}
            <GitHubButton text="Sign up with GitHub" />

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mt-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
              >
                Log in
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
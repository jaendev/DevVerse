/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react'; // ← CAMBIO: de @/src/auth a next-auth/react
import Link from 'next/link';
import { Menu, X, Moon, Sun, LogOut, User } from 'lucide-react';
import Button from '../ui/Button';
import Container from '../ui/Container';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useShowHeader } from '@/src/hooks/useShowHeader';
import { useAuth } from '@/src/hooks/useAuth';

export default function Header() {
  const router = useRouter();
  const showHeader = useShowHeader();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' }); // ← CAMBIO: usar callbackUrl
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showHeader) return null;

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Community', href: '#community' },
    { name: 'Resources', href: '#resources' },
  ];

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled
        ? 'py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm'
        : 'py-4 bg-transparent'
        }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center space-x-2"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">DV</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">DevVerse</span>
          </Link>

          {/* Navigation - Only show public pages*/}
          {!isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          )}

          {/* User info - Only show when authenticated */}
          {isAuthenticated && user && (
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Welcome, {user.username || user.name}!
              </span>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Authenticated User Actions */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/profile')}
                  size="sm"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              /* Unauthenticated User Actions */
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/login')}
                  size="sm"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => router.push('/register')}
                  size="sm"
                >
                  Sign up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <nav className="flex flex-col space-y-4 mt-4">
              {!isAuthenticated && (
                <>
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push('/login');
                      setIsMenuOpen(false);
                    }}
                    fullWidth
                  >
                    Log in
                  </Button>
                  <Button
                    onClick={() => {
                      router.push('/register');
                      setIsMenuOpen(false);
                    }}
                    fullWidth
                  >
                    Sign up
                  </Button>
                </>
              )}

              {isAuthenticated && (
                <>
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push('/profile');
                      setIsMenuOpen(false);
                    }}
                    fullWidth
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    fullWidth
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
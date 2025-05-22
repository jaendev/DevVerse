'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Moon, Sun } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Container from '@/app/components/ui/Container';
import { useTheme } from '@/contexts/ThemeContext';
import { useShowHeader } from '@/hooks/useShowHeader';

export default function Header() {
  const router = useRouter();
  const showHeader = useShowHeader();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleThemeToggle = () => {
    console.log('=== THEME TOGGLE DEBUG ===');
    console.log('Current theme before toggle:', theme);
    console.log('HTML classList before:', document.documentElement.classList.toString());

    toggleTheme();

    // Verificar después del toggle
    setTimeout(() => {
      console.log('Theme after toggle:', theme);
      console.log('HTML classList after:', document.documentElement.classList.toString());
      console.log('localStorage theme:', localStorage.getItem('theme'));
    }, 100);
  };

  // useEffect después de los hooks de estado
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Si necesitas una condición de retorno temprano, hazlo después de los hooks
  if (!showHeader) return null;


  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Community', href: '#community' },
    { name: 'Resources', href: '#resources' },
  ];

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled
        ? 'py-2 bg-background/90 backdrop-blur-md shadow-sm'
        : 'py-4 bg-transparent'
        }`}
    >
      <Container>
        <div className={`${localStorage.getItem('token') ? 'hidden' : ''}`}>


          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">DV</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">DevVerse</span>
            </Link>

            {/* Desktop Navigation */}
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

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center space-x-4">
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
              <Button
                variant="outline"
                onClick={() => router.push('/login')}
              >
                Log in
              </Button>
              <Button
                onClick={() => router.push('/register')}
              >
                Sign up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
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
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col space-y-4 mt-4">
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
              </nav>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
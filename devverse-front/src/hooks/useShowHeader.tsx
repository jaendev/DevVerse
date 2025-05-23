
'use client';

import { usePathname } from 'next/navigation';

export function useShowHeader() {
  const pathname = usePathname();

  // Pages where the header should be shown (whitelist)
  const allowedPages = [
    '/',           // Home
    '/dashboard',  // Dashboard
    '/profile',    // Profile
    '/settings',   // Settings
    '/projects',   // Projects
    '/community',  // Community
    '/about',      // About
    '/contact',    // Contact
    '/help',       // Help
    '/test-theme', // Tu página de test
  ];

  // Also allow common dynamic routes
  const isDynamicRoute = [
    '/project/',   // /project/[id]
    '/user/',      // /user/[id]
    '/post/',      // /post/[id]
  ].some(route => pathname.startsWith(route));

  return allowedPages.includes(pathname) || isDynamicRoute;
}
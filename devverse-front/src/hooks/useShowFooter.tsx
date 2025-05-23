'use client';

import { usePathname } from 'next/navigation';

export function useShowFooter() {
  const pathname = usePathname();
  const authPaths = ['/login', '/register', '/forgot-password'];

  return !authPaths.includes(pathname);
}
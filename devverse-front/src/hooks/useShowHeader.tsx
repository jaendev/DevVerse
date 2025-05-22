'use client';

import { usePathname } from 'next/navigation';

export function useShowHeader() {
  const pathname = usePathname();
  const authPaths = ['/login', '/register', '/forgot-password'];
  
  return !authPaths.includes(pathname);
}
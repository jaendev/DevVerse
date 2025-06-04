import { auth } from '@/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/register')
  const isProtectedPage = req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/profile')

  console.log('Middleware:', {
    pathname: req.nextUrl.pathname,
    isLoggedIn,
    isAuthPage,
    isProtectedPage,
    auth: req.auth
  });

  // Redirect to dashboard if logged in and trying to access auth pages
  if (isLoggedIn && isAuthPage) {
    console.log('Redirecting to dashboard from auth page');
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }

  // Redirect to login if not logged in and trying to access protected pages
  if (!isLoggedIn && isProtectedPage) {
    console.log('Redirecting to login from protected page');
    return Response.redirect(new URL('/login', req.nextUrl))
  }

  console.log('Allowing access');
  return null; // Allow access
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
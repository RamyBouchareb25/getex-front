import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

// Create the intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default withAuth(
  function middleware(req) {
    const { pathname, searchParams } = req.nextUrl;
    const token = req.nextauth.token;

    // Skip API routes and other non-localized paths
    if (pathname.startsWith('/api/') || 
        pathname.startsWith('/_next/') || 
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/robots.txt')) {
      return NextResponse.next();
    }

    // Apply intl middleware first for locale handling
    const intlResponse = intlMiddleware(req);
    
    // If intl middleware returns a response (redirect), use it
    if (intlResponse) {
      return intlResponse;
    }

    // Extract locale from pathname for auth logic
    const locale = pathname.split('/')[1];
    const isValidLocale = locales.includes(locale as any);
    
    if (!isValidLocale) {
      // If no valid locale, let intl middleware handle it
      return intlMiddleware(req);
    }

    // Auth routes (with locale prefix)
    const authRoutes = [
      `/${locale}/auth/signin`,
      `/${locale}/auth/signup`, 
      `/${locale}/auth/login`,
      "/auth/signin",
      "/auth/signup",
      "/auth/login",
    ];
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // If user is logged in and trying to access auth routes
    if (token && isAuthRoute) {
      const callbackUrl = searchParams.get("callbackUrl");

      if (callbackUrl) {
        return NextResponse.redirect(new URL(callbackUrl, req.url));
      }

      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Skip API routes and other non-localized paths
        if (pathname.startsWith('/api/') || 
            pathname.startsWith('/_next/') || 
            pathname.startsWith('/favicon.ico') ||
            pathname.startsWith('/robots.txt')) {
          return true;
        }

        // Extract locale from pathname
        const locale = pathname.split('/')[1];
        const isValidLocale = locales.includes(locale as any);
        
        const authRoutes = [
          `/${locale}/auth/signin`,
          `/${locale}/auth/signup`,
          `/${locale}/auth/login`,
          "/auth/signin",
          "/auth/signup", 
          "/auth/login",
        ];
        const isAuthRoute = authRoutes.some((route) =>
          pathname.startsWith(route)
        );

        // Allow access to auth routes regardless of token
        if (isAuthRoute) return true;

        // For dashboard routes, require token
        if (isValidLocale && pathname.startsWith(`/${locale}/dashboard`)) {
          return !!token;
        }

        // Allow other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - Next.js internals
    // - Static files
    '/((?!api|_next|.*\\..*).*)',
  ],
};
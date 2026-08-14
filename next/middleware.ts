import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/i18n.config';

// Lightweight JWT decode without importing the full auth library.
// NextAuth v5 stores session in a JWE cookie. We only need to check
// if the cookie exists and decode its payload to read the role.
// The actual cryptographic verification happens in server components/actions.
async function getTokenFromRequest(request: NextRequest) {
  try {
    const cookieName =
      process.env.NODE_ENV === 'production'
        ? '__Secure-authjs.session-token'
        : 'authjs.session-token';

    const token = request.cookies.get(cookieName)?.value;
    if (!token) return null;

    // Dynamically import only the lightweight decode function
    const { decode } = await import('next-auth/jwt');

    const secret = process.env.AUTH_SECRET;
    if (!secret) return null;

    const decoded = await decode({
      token,
      secret,
      salt: cookieName,
    });

    return decoded;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // --- Admin route protection ---
  if (pathname.startsWith('/admin')) {
    const token = await getTokenFromRequest(request);

    // Allow the login page without auth
    if (pathname === '/admin/login') {
      // Only bounce *staff* to the dashboard. Sending a logged-in applicant
      // there would trip the kind check below and redirect straight back here,
      // looping forever.
      if (token?.kind === 'staff') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // All other /admin/* pages require authentication
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // ...and specifically a *staff* session. Applicants authenticate through
    // the same NextAuth cookie, so "a token exists" is no longer proof of
    // staff access — without this check any logged-in job applicant would
    // satisfy the guard above and land straight on the dashboard.
    if (token.kind !== 'staff') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // /admin/admins requires ADMIN or SUPER_ADMIN role
    if (pathname.startsWith('/admin/admins')) {
      if (token.role !== 'SUPER_ADMIN' && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }

    // /admin/clock-records requires ADMIN or SUPER_ADMIN role
    if (pathname.startsWith('/admin/clock-records')) {
      if (token.role !== 'SUPER_ADMIN' && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }

    return NextResponse.next();
  }

  // --- Locale routing for public pages ---
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const locale = pathname.split('/')[1];

    // Careers is entirely public, including the apply form — applications
    // need no account, so nothing under /<locale>/careers is gated here.

    // The root layout renders <html> but sits above [locale], so it cannot read
    // the route param. Pass the locale down as a header so it can set lang/dir
    // on <html> itself — which is where RTL belongs.
    const headers = new Headers(request.headers);
    headers.set('x-locale', locale);
    return NextResponse.next({ request: { headers } });
  }

  // Redirect to default locale if no locale found
  return NextResponse.redirect(
    new URL(`/${i18n.defaultLocale}${pathname}`, request.url)
  );
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest\\.json|sitemap\\.xml|robots\\.txt|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // লগইন করা থাকলে লগইন/সাইনআপে ঢুকতে বাধা দেওয়া
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard/projects', request.url));
  }

  // ড্যাশবোর্ডে টোকেন ছাড়া ঢুকতে বাধা দেওয়া
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // সব রাউট চেক করবে, তবে স্ট্যাটিক ফাইলগুলো বাদ দিয়ে
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
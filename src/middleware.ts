import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // কুকিতে টোকেন চেক করছি
  const token = request.cookies.get('token')?.value;

  // যদি লগইন পেজে থাকে এবং টোকেন থাকে, তবে সরাসরি ড্যাশবোর্ডে পাঠিয়ে দাও
  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard/projects', request.url));
  }

  // যদি ড্যাশবোর্ডে যেতে চায় এবং টোকেন না থাকে, তবে লগইন পেজে পাঠিয়ে দাও
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // কুকি থেকে টোকেন চেক করছি
  const token = request.cookies.get('token')?.value;

  const { pathname } = request.nextUrl;

  // ১. যদি ইউজার লগইন করা থাকে (টোকেন আছে) এবং সে /login বা /signup পেজে যেতে চায়
  // তবে তাকে সরাসরি ড্যাশবোর্ডে পাঠিয়ে দাও
  if ((pathname === '/login' || pathname === '/signup') && token) {
    return NextResponse.redirect(new URL('/dashboard/projects', request.url));
  }

  // ২. যদি ড্যাশবোর্ডের কোনো পেজে যেতে চায় কিন্তু টোকেন না থাকে
  // তবে তাকে লগইন পেজে পাঠিয়ে দাও
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ৩. যদি রুট পাথ '/' এ থাকে এবং লগইন করা থাকে, ড্যাশবোর্ডে পাঠিয়ে দাও
  if (pathname === '/' && token) {
     return NextResponse.redirect(new URL('/dashboard/projects', request.url));
  }

  return NextResponse.next();
}

// কোন কোন পাথে এই মিডলওয়্যার কাজ করবে তা এখানে উল্লেখ করতে হবে
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/'],
};
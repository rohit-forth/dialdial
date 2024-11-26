import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('COOKIES_ADMIN_ACCESS_TOKEN')?.value;
  const isLoginPage = req.nextUrl.pathname === '/';

  if (!accessToken && !isLoginPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (accessToken && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/call-management/:path*',
    '/chat/:path*',
    
    
  ],
};
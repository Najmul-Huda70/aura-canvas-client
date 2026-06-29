import { NextResponse } from 'next/server';

export async function proxy(request) { 
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get('better-auth.session_token')?.value || 
                request.cookies.get('__secure-better-auth.session_token')?.value ||
                request.cookies.get('better-auth.session')?.value || 
                request.cookies.get('__secure-better-auth.session')?.value;

  console.log('--- Middleware Check ---');
  console.log('Pathname:', pathname);
  console.log('Detected Token:', token ? "Yes (Token Exists)" : "No Token found");

  if (!token && pathname.startsWith("/dashboard")) {
    console.log("🔴 No token! Redirecting to /login");
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  if (token && (pathname === "/login" || pathname === "/register")) {
    console.log("🟢 Token found! Redirecting authenticated user to home (/)");
    return NextResponse.redirect(new URL('/', request.url)); 
  }

  return NextResponse.next();
}
 
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'] 
};
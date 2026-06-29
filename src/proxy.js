import { NextResponse } from 'next/server';

export async function proxy(request) { 
  const { pathname } = request.nextUrl;
  
  const token = 
    request.cookies.get('better-auth.session_token')?.value || 
    request.cookies.get('__Secure-better-auth.session_token')?.value ||  // capital S
    request.cookies.get('__secure-better-auth.session_token')?.value ||  // lowercase s
    request.cookies.get('better-auth.session')?.value || 
    request.cookies.get('__Secure-better-auth.session')?.value ||
    request.cookies.get('__secure-better-auth.session')?.value;

  console.log('--- Middleware Check ---');
  console.log('Pathname:', pathname);
  console.log('All cookies:', request.cookies.getAll().map(c => c.name)); 
  console.log('Detected Token:', token ? "Yes" : "No");

  if (!token && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL('/', request.url)); 
  }

  return NextResponse.next();
}
 
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'] 
};
import { NextResponse } from 'next/server';

export async function proxy(request) { 
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get('better-auth.session_token')?.value || 
                request.cookies.get('__secure-better-auth.session_token')?.value;

  console.log('Detected Better Auth Token:', token);

  // try {
  //   if (!token && pathname.startsWith("/dashboard")) {
  //     return NextResponse.redirect(new URL('/login', request.url));
  //   }

  //   if (token && pathname === "/login") {
  //     return NextResponse.redirect(new URL('/', request.url)); 
  //   }
  //   if (token && pathname === "/register") {
  //     return NextResponse.redirect(new URL('/', request.url)); 
  //   }
  // } catch (error) {
  //   console.error("Middleware Auth Error:", error);
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return NextResponse.next();
}
 
export const config = {
  // matcher: ['/dashboard/:path*', '/login','/register'] 
};
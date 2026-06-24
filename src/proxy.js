import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
 

export async function proxy(request) {
  const {pathname}=request?.nextUrl;
  const token =request.cookies.get('token')?.value;
  try{
  //  const cookieStore = await cookies();
  //  console.log('cookies:',cookieStore);
  if(!token && pathname.startsWith("/dashboard"))
  {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  }
  catch (error) {
    console.error("proxy Auth Error:", error);
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/dashboard/:path*']
}
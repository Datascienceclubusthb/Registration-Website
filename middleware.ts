import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // TODO: Update valid routes for your event
  // Add any custom pages you create to this array
  const validRoutes = ['/', '/registration-closed', '/timer', '/api/submissions'];

  const isValidRoute = validRoutes.some((route) => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  });

  // Allow Next.js internal routes and static files
  const isNextJsInternal =
    pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.includes('.');

  // Redirect invalid routes to home page
  if (!isValidRoute && !isNextJsInternal) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};

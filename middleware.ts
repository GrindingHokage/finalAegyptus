import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("aegyptus_auth_token")?.value
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const publicPaths = ["/auth/signin", "/auth/signup", "/auth/forgot-password", "/auth"]

  const isPublicPath = publicPaths.includes(path)

  // If the user is authenticated (has the cookie)
  if (authCookie) {
    // If they try to access a public auth page, redirect them to the home page
    if (isPublicPath) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    // Otherwise, allow them to proceed to the requested page
    return NextResponse.next()
  } else {
    // If the user is NOT authenticated (no cookie)
    // If they try to access a protected page (not a public auth page), redirect to signin
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
    // Otherwise, allow them to proceed to the public auth page
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

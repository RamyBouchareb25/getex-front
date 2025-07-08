import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname, searchParams } = req.nextUrl
    const token = req.nextauth.token
    
    // Auth routes (login, register, etc.)
    const authRoutes = ["/auth/signin", "/auth/signup", "/auth/login", "/login", "/signin"]
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
    
    // If user is logged in and trying to access auth routes
    if (token && isAuthRoute) {
      const callbackUrl = searchParams.get("callbackUrl")
      
      if (callbackUrl) {
        return NextResponse.redirect(new URL(callbackUrl, req.url))
      }
      
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        const authRoutes = ["/auth/signin", "/auth/signup", "/auth/login", "/login", "/signin"]
        const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
        
        // Allow access to auth routes regardless of token
        if (isAuthRoute) return true
        
        // Require token for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*", "/auth/:path*", "/login", "/signin"],
}

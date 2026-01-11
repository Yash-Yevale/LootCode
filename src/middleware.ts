// middleware.ts or src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",   // protect everything except Next.js internals
    "/(api|trpc)(.*)"           // optionally protect API routes
  ],
};

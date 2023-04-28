import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname === '/about') {
        return true;
      }

      return true;
    },
  },
});

import { withAuth } from 'next-auth/middleware';

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (!token?.email) {
        return false;
      }

      if (req.nextUrl.pathname === '/admin') {
        return token.email === process.env.SUPPER_DUPER_ADMIN_EMAIL;
      }

      return true;
    },
  },
});

export const config = { matcher: ['/admin', '/complaint/create'] };

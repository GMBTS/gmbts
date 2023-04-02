import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        // eslint-disable-next-line no-param-reassign
        session.user.id = token.uid;
      }

      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        const isUserThere = await prisma.whiteListAccounts.count({
          where: {
            accountId: user.id,
          },
        });

        token.uid = user.id;
        token.isAllowed = !!isUserThere;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);

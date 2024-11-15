import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user && bcrypt.compareSync(credentials!.password, user.password)) {
          return { id: user.id, email: user.email, role: user.role };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: { id: token.sub },
      });
      if (user) session.user = { id: user.id, email: user.email, role: user.role };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

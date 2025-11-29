import NextAuth, { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      companyName?: string;
      role: string;
    } & DefaultSession['user']
  }

  interface User {
    id: string;
    email: string;
    companyName?: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string;
      email: string;
      companyName?: string;
      role: string;
    }
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          return null;
        }

        const isPasswordValid = await user.comparePassword(credentials.password);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: (user as any)._id.toString(),
          email: user.email,
          companyName: user.companyName,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/signup'
  },
  session: {
    strategy: 'jwt' as const,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

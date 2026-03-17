// src/auth.ts
import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    // Google OAuth
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    // GitHub OAuth
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),

    // Credentials (email/password)
    Credentials({
      name: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as any;
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error('User not found');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),
  ],

  callbacks: {
    // JWT callback: يضيف id للمستخدم في التوكن
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    // Session callback: يضيف id للمستخدم في session
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },

    // SignIn callback: الربط التلقائي للحسابات OAuth
    async signIn({ user, account }) {
      // فقط OAuth providers (ليس credentials)
      if (account && account.provider !== 'credentials' && user.email) {
        // تحقق إذا المستخدم موجود مسبقًا
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          user.id = existingUser.id;

          // تحقق إذا حساب OAuth موجود في Account
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          // إذا لم يكن موجودًا، أنشئ الحساب تلقائيًا
          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                id_token: account.id_token,
              },
            });
            console.log('Account جديد تم إنشاؤه تلقائيًا');
          }
        }
      }

      return true;
    },
  },

  // خيارات إضافية: صفحة تسجيل الدخول مخصصة
  pages: {
    signIn: '/signin',
    error: '/signin', // تظهر الأخطاء على صفحة sign-in
  },

  // إعدادات أخرى
  debug: process.env.NODE_ENV === 'development',
});

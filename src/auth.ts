// src/auth.ts
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { prisma } from "./lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {},
      async authorize(credentials)
      {
        const { email, password } = credentials as any;
        const user = await prisma.user.findUnique({
          where: {
            email  //creditals.email== user.email
          }
        })
        if (!user || !user.password) throw new Error("User not found");
        const ok = await bcrypt.compare(password, user.password) //compare input password with hashed password
        if (!ok) return null;
        return user
      }
    })
  ],
  callbacks: {
    async jwt({ token, user })
    {
      if (user) token.id = user.id;
      return token;
    },

    async session({ session, token })
    {
      if (session.user)
      {
        session.user.id = token.id as string;
      }
      return session;
    },

    async signIn({ user, account })
    {
      if (account?.provider !== "credentials" && user.email)
      {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (existing)
        {
          user.id = existing.id;
        }
      }
      return true;
    }
  }
})

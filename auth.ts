import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { UserRole } from "@prisma/client";

/**
 * Initializes NextAuth with PrismaAdapter (PrismaAdapter is used to allow Auth.js to manage user data via Prisma ORM.)
 * for database interactions.
 *
 * Exports authentication functions for use in the application.
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth sign in without email verification
      if (account?.provider !== "credentials") {
        return true;
      }

      const existingUser = await getUserById(user.id);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) {
        return false;
      }

      // TODO: Add 2FA check

      return true;
    },
    async session({ token, session }) {
      // The 'token' object 'sub' property is basically the userId.
      // By creating an 'id' property inside 'session.user', we can always have access to the id of the user.
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // By creating a 'role' property inside 'session.user', we can always have access to the role of the user.
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }

      // Obtain 'role' property from user object and set as a new property in token object
      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});

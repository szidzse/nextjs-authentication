import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { UserRole } from "@prisma/client";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

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

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        );

        console.log({ twoFactorConfirmation });

        if (!twoFactorConfirmation) {
          return false;
        }

        // Delete two factor confirmation for next sign in
        // Optional: add expiration time to TwoFactorConfirmation model
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }

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

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
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

      token.name = existingUser.name;
      token.email = existingUser.email;
      // Obtain 'role' property from user object and set as a new property in token object
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});

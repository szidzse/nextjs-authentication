import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";

/**
 * Initializes NextAuth with PrismaAdapter (PrismaAdapter is used to allow Auth.js to manage user data via Prisma ORM.)
 * for database interactions.
 *
 * Exports authentication functions for use in the application.
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      // The 'token' object 'sub' property is basically the userId.
      // By creating an 'id' property inside 'session.user', we can always have access to the id of the user.
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);

      console.log(existingUser);

      if (!existingUser) {
        return token;
      }

      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});

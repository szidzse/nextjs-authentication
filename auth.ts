import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { UserRole } from "@prisma/client";
import { getUserByEmail, getUserById } from "@/data/user";
// import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "@/data/account";

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
    /*async signIn({ user, account }) {
      // Allow OAuth sign in without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        );

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        // Optional: add expiration time to TwoFactorConfirmation model
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }

      return true;
    }*/
    async signIn({ user, account }) {
      // Check if the login method is OAuth
      if (account && account.provider !== "credentials") {
        if (!user.email) return false;

        const existingUser = await getUserByEmail(user.email);

        if (existingUser) {
          // If an account already exists with this email address,
          // we will link the new OAuth provider with the existing user account
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token || null,
              access_token: account.access_token || null,
              expires_at: account.expires_at || null,
              token_type: account.token_type || null,
              scope: account.scope || null,
              id_token: account.id_token || null,
              session_state: account.session_state
                ? String(account.session_state)
                : null,
            },
          });

          // Automatically verify email if the user is logged in with OAuth
          if (!existingUser.emailVerified) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { emailVerified: new Date() },
            });
          }

          // Overwrite the login user with the existing user
          // This will ensure that you are logged in to the existing user account
          user.id = existingUser.id;

          return true;
        }
      }

      // Login with credentials or create new user with OAuth registration
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
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = !!token.isOAuth;
        session.user.isTwoFactorEnabled = !!token.isTwoFactorEnabled;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
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

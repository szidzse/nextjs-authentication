import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

/**
 * Configuration file for NextAuth authentication.
 * Defines available authentication providers.
 */
export default { providers: [GitHub] } satisfies NextAuthConfig;

import { useSession } from "next-auth/react";

/**
 * Custom hook to quickly obtain the current logged-in user data.
 */
export const useCurrentUser = () => {
  const session = useSession();
  return session.data?.user;
};

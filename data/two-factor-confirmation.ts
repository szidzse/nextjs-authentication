import { prisma } from "@/lib/prisma";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  if (!userId) return null;
  try {
    return prisma.twoFactorConfirmation.findUnique({
      where: { userId },
    });
  } catch (error) {
    console.error("Error fetching two factor confirmation: ", error);
    return null;
  }
};

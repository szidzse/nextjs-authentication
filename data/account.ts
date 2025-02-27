import { prisma } from "@/lib/prisma";

export const getAccountByUserId = async (userId: string) => {
  if (!userId) return null;
  try {
    return await prisma.account.findFirst({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.error("Error fetching account by userId: ", error);
    return null;
  }
};

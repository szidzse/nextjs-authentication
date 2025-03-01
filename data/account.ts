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

export const getAccountByProviderAndProviderAccountId = async (
  provider: string,
  providerAccountId: string,
) => {
  if (!provider || !providerAccountId) return null;
  try {
    return await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });
  } catch (error) {
    console.error(
      "Error fetching account by provider and providerAccountId: ",
      error,
    );
    return null;
  }
};

import { prisma } from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Error fetching user by email: ", error);
    return null;
  }
};

export const getUserById = async (id: string | undefined) => {
  if (!id) return null;
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching user by id: ", error);
    return null;
  }
};

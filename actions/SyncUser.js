"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function syncUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Clerk user not found");

  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
        imageUrl: clerkUser.imageUrl ?? "",
      },
    });

    await db.account.create({
      data: {
        name: "Primary Account",
        type: "SAVINGS",
        balance: 1000,
        isDefault: true,
        userId: user.id,
      },
    });
  }

  return user;
}
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

async function bootstrapUser() {
  const { userId } = await auth();
  if (!userId) return;

  const clerkUser = await currentUser();
  if (!clerkUser) return;

  let user = await db.user.findUnique({ where: { clerkUserId: userId } });

  if (!user) {
    user = await db.user.create({
      data: {
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
        imageUrl: clerkUser.imageUrl ?? "",
      },
    });
  }

  const hasAccount = await db.account.findFirst({ where: { userId: user.id } });

  if (!hasAccount) {
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
}

export default async function DashboardLayout({ children }) {
  await bootstrapUser();
  return <>{children}</>;
}
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardBootstrap from "@/components/DashboardBootstrap";

async function bootstrapUser() {
  const { userId } = await auth();
  if (!userId) redirect("/Sign-in");

  const existingUser = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });
  if (existingUser) return true;

  let clerkUser = await currentUser();
  if (!clerkUser) {
    await new Promise((r) => setTimeout(r, 500));
    clerkUser = await currentUser();
  }
  if (!clerkUser) redirect("/Sign-in");

  const user = await db.user.create({
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

  return true;
}

export default async function DashboardLayout({ children }) {
  let userReady = false;
  try {
    userReady = await bootstrapUser();
  } catch {
    userReady = false;
  }

  return (
    <DashboardBootstrap userReady={userReady}>
      {children}
    </DashboardBootstrap>
  );
}
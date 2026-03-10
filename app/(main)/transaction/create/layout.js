import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

async function checkUserAccount() {
  const { userId } = await auth();
  if (!userId) return { allowed: false };

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    return { allowed: false };
  }

  const account = await db.account.findFirst({
    where: { userId: user.id },
  });

  if (!account) {
    return { allowed: false };
  }

  return { allowed: true };
}

export default async function TransactionLayout({ children }) {
  const { allowed } = await checkUserAccount();

  if (!allowed) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">
            Please create a Primary Account
          </h2>
          <p className="text-gray-500 mt-2">
            You need to create an account before accessing transactions.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
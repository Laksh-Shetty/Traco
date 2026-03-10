"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

const serializedAccount = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) serialized.balance = obj.balance.toNumber();
  if (obj.amount) serialized.amount = obj.amount.toNumber();
  return serialized;
};

export async function ensureDefaultAccount() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("No user found in db");

  const existing = await db.account.findFirst({
    where: { userId: user.id },
  });

  if (!existing) {
    await db.account.create({
      data: {
        name: "Primary Account",
        type: "CURRENT",
        balance: 1000,
        isDefault: true,
        userId: user.id,
      },
    });
  }
}

export async function getAccountsWithTransactions(accId) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("No user found in db");

  const account = await db.account.findUnique({
    where: {
      id: accId,
      userId: user.id,
    },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
      _count: {
        select: { transactions: true },
      },
    },
  });

  if (!account) throw new Error("Account not found");

  return {
    ...serializedAccount(account),
    transactions: account.transactions.map(serializedAccount),
  };
}
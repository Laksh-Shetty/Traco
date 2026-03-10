"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

const serialize = (obj) => {
  const out = { ...obj };
  if (obj.balance) out.balance = obj.balance.toNumber();
  if (obj.amount) out.amount = obj.amount.toNumber();
  return out;
};

export async function getAccountsWithTransactions(accId) {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) return null;

  const account = await db.account.findUnique({
    where: { id: accId, userId: user.id },
    include: {
      transactions: { orderBy: { date: "desc" } },
      _count: { select: { transactions: true } },
    },
  });

  if (!account) return null;

  return {
    ...serialize(account),
    transactions: account.transactions.map(serialize),
  };
}
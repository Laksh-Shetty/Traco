"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const serialize = (obj) => {
  const out = { ...obj };
  if (obj.balance) out.balance = obj.balance.toNumber();
  if (obj.amount) out.amount = obj.amount.toNumber();
  return out;
};

async function getDbUser(userId) {
  return await db.user.findUnique({ where: { clerkUserId: userId } });
}

export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");
    const user = await getDbUser(userId);
    if (!user) throw new Error("User not ready");

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) throw new Error("Invalid balance amount");

    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newAccount = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        isDefault: shouldBeDefault,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, account: serialize(newAccount) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getUserAccounts() {
  const { userId } = await auth();
  if (!userId) return [];
  const user = await getDbUser(userId);
  if (!user) return [];

  const accounts = await db.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { transactions: true } } },
  });

  return accounts.map(serialize);
}

export async function setDefaultAccount(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");
    const user = await getDbUser(userId);
    if (!user) throw new Error("User not ready");

    await db.account.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });

    const updated = await db.account.update({
      where: { id: accountId },
      data: { isDefault: true },
    });

    revalidatePath("/dashboard");
    return { success: true, account: serialize(updated) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getDefaultInfo() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Not authenticated" };

    const user = await getDbUser(userId);
    if (!user) return { success: false, error: "User not ready" };

    const account = await db.account.findFirst({
      where: { userId: user.id, isDefault: true },
    });

    if (!account) return { success: false, error: "No account yet" };

    const transactions = await db.transaction.findMany({
      where: { userId: user.id, accountId: account.id },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      account: serialize(account),
      transactions: transactions.map(serialize),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getAccountsWithTransactions(accId) {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await getDbUser(userId);
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
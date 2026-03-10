"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getDbUser(userId) {
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  return user ?? null;
}

export async function getBudget() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await getDbUser(userId);
  if (!user) return null;

  const budget = await db.budget.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return budget ? { ...budget, amount: Number(budget.amount) } : null;
}

export async function updateBudget(amount) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const user = await getDbUser(userId);
  if (!user) throw new Error("User not ready");

  let budget = await db.budget.findFirst({ where: { userId: user.id } });

  if (budget) {
    budget = await db.budget.update({
      where: { id: budget.id },
      data: { amount },
    });
  } else {
    budget = await db.budget.create({
      data: { amount, userId: user.id },
    });
  }

  revalidatePath("/dashboard");
  return { ...budget, amount: Number(budget.amount) };
}

export async function defaultBudget() {
  const { userId } = await auth();
  if (!userId) return 0;
  const user = await getDbUser(userId);
  if (!user) return 0;

  const account = await db.account.findFirst({
    where: { userId: user.id, isDefault: true },
  });

  if (!account) return 0;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const expense = await db.transaction.aggregate({
    where: {
      accountId: account.id,
      type: "EXPENSE",
      date: { gte: startOfMonth },
    },
    _sum: { amount: true },
  });

  return Number(expense._sum.amount || 0);
}
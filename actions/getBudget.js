"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { date } from "zod";


export async function getBudget() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const budget = await db.budget.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }, 
  });

  return budget ? { ...budget, amount: Number(budget.amount) } : null;
}


export async function updateBudget(amount) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

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
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  // Try finding default account
  let account = await db.account.findFirst({
    where: { userId: user.id, isDefault: true },
  });

  // 👇 CREATE if missing (new user fix)
  if (!account) {
    account = await db.account.create({
      data: {
        userId: user.id,
        name: "Practice Account",
        balance: 0,
        isDefault: true,
        type:"SAVINGS"
      },
    });
  }

  const startDate = new Date();
  startDate.setDate(1);

  const expense = await db.transaction.aggregate({
    where: {
      accountId: account.id,
      type: "EXPENSE",
      date: {
        gte: startDate,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return Number(expense._sum.amount || 0);
}

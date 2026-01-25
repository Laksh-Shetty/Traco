"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { success } from "zod";

const serializeTransaction = (obj) => {
  const serialized = { ...obj };

  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }

  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }

  return serialized;
};

export async function createAccount(data) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("NO user found in db");
    }

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    const existingAccount = await db.account.findMany({
      where: {
        userId: user.id,
        accountType: data.accountType,
      },
    });

    const shouldBeDefault =
      existingAccount.length === 0 ? true : data.isDefault;

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
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

    const serializedAccount = serializeTransaction(newAccount);
    revalidatePath("/dashboard");
    return { success: true, account: serializedAccount };
  } catch (error) {
    console.log("Error creating account:", error);
  }
}

export async function getUserAccounts() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("No user found in db");
  }

  const accounts = await db.account.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  const serializedAccounts = accounts.map(serializeTransaction);
  return serializedAccounts;
  
}

export async function setDefaultAccount(accountId) {
  const { userId } = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });

    if (!user) {
        throw new Error("No user found in db");
    }
    await db.account.updateMany({
        where: {
            userId: user.id,
            isDefault: true,
        },
        data: {
            isDefault: false,
        },
    });
    const updatedAccount = await db.account.update({
        where: {
            id: accountId,
        },
        data: {
            isDefault: true,
        },
    });
    revalidatePath("/dashboard");
    return serializeTransaction(updatedAccount);
}

export async function getDefaultInfo() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("No user found in db");
    }

    const defAccount = await db.account.findFirst({
      where: {
        userId: user.id,
        isDefault: true,
      },
    });

    if (!defAccount) {
      throw new Error("No default account found");
    }

    const defTrans = await db.transaction.findMany({
      where: {
        userId: user.id,
        accountId: defAccount.id,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      account: defAccount,
      transactions: defTrans.map(serializeTransaction),
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

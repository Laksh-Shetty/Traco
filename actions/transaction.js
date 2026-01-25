"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to convert Prisma Decimals to Numbers for the frontend
const serializedTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function createTransaction(data) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    //arcjet
    const req = await request();
    // check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;

        throw new Error("Too many requests . Please try later.");
      }
      throw new Error("Request Blocked.");
    }

    const User = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!User) throw new Error("User not found");

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: User.id,
      },
    });

    if (!account) throw new Error("Account not found");

    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: User.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextDate(data.date, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return {
      success: true,
      data: serializedTransaction(transaction),
    };
  } catch (error) {
    console.error("Transaction Error:", error.message);
    throw new Error(error.message);
  }
}

function calculateNextDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date;
}

export async function scanReceipt(file) {
  try {
    const model = genAi.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });
    //file  to arraybuffer
    const arrayBuffer = await file.arrayBuffer();

    //arraybuffer to base64
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
    Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one word)
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
      };
    } catch (parseError) {
      throw new Error("Invalid Response from Gemini");
    }
  } catch (error) {
    console.error("Receipt scan error:", error.message);
    throw new Error("Failed to scan receipt");
  }
}

export async function updateTransaction(data) {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const oldTxn = await db.transaction.findFirst({
    where: {
      id: data.id,
      userId: user.id,
    },
  });
  if (!oldTxn) throw new Error("Transaction not found");

  const oldAccount = await db.account.findUnique({
    where: {
      id: oldTxn.accountId,
      userId: user.id,
    },
  });
  if (!oldAccount) throw new Error("Old account not found");

  const newAccount = await db.account.findUnique({
    where: {
      id: data.accountId,
      userId: user.id,
    },
  });
  if (!newAccount) throw new Error("New account not found");

  const oldEffect =
    oldTxn.type === "EXPENSE"
      ? -oldTxn.amount.toNumber()
      : oldTxn.amount.toNumber();

  const newEffect = data.type === "EXPENSE" ? -data.amount : data.amount;

  await db.$transaction(async (prisma) => {
    await prisma.account.update({
      where: { id: oldAccount.id },
      data: {
        balance: {
          increment: -oldEffect,
        },
      },
    });

    await prisma.account.update({
      where: { id: newAccount.id },
      data: {
        balance: {
          increment: newEffect,
        },
      },
    });

    await prisma.transaction.update({
      where: { id: oldTxn.id },
      data: {
        type: data.type,
        amount: data.amount,
        description: data.description,
        category: data.category,
        date: data.date,
        accountId: data.accountId,
        isRecurring: data.isRecurring,
        recurringInterval: data.recurringInterval,
        nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextDate(data.date, data.recurringInterval)
              : null,
      },
    });
  });
  revalidatePath("/dashboard");
  revalidatePath(`/account/${oldTxn.accountId}`);
  if (oldTxn.accountId !== data.accountId) {
    revalidatePath(`/account/${data.accountId}`);
  }
}

export async function getTransactionById(txnId) {
  if (!txnId) return null;

  const transaction = await db.transaction.findUnique({
    where: { id: txnId },
    select: {
      id: true,
      type: true,
      amount: true,
      description: true,
      category: true,
      accountId: true,
      date: true,
      isRecurring: true,
      recurringInterval: true,
      userId: true,
    },
  });

  return transaction || null;
}


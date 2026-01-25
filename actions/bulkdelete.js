"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function bulkDeleteTransactions(transactionIds) {
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
      throw new Error("No user found in db");
    }

    const txs = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
    });

    const changeAmt = txs.reduce ((acc, tx) => {
        if(tx.type ==="INCOME"){
            return acc + tx.amount.toNumber();
        } else{
            return acc - tx.amount.toNumber();
        }
    },0);
    

    //prisma allows multiple api calls in one transaction
    await db.$transaction(async (prisma) => {
        await prisma.transaction.deleteMany({
          where: {
            id: {
                in: transactionIds,
            },
            account: {
              userId: user.id,
          },
        },
        });

        await prisma.account.update({
          where: {
            userId: user.id,
            id: txs[0].accountId,
            },
            data: {
                balance: {
                    increment: -changeAmt,
                },
            },
        });
      
    });
    
  } catch (error) {
    console.error("Error bulk deleting transactions:", error);
    throw error;
  }
}

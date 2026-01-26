import Email from "@/emails/email";
import { inngest } from "./client";
import { db } from "./prisma";
import { sendEmail } from "@/actions/sendEmail";
import { date, lte } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//use react email for format
// use resend for actual sent in which react:email-format.jsx

export const checkBudgetAlert = inngest.createFunction(
  { id: "check-budget-alert" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    console.log("🔥 checkBudgetAlert triggered");

    const budgets = await step.run("fetch-budgets", async () => {
      return db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: { isDefault: true },
              },
            },
          },
        },
      });
    });

    for (const b of budgets) {
      const account = b.user.accounts[0];
      if (!account) continue;

      await step.run(`check-budget-${b.id}`, async () => {
        const startDate = new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        const expenses = await db.transaction.aggregate({
          where: {
            userId: b.userId,
            accountId: account.id,
            type: "EXPENSE",
            date: { gte: startDate },
          },
          _sum: { amount: true },
        });

        const totalExpenses = Number(expenses._sum.amount ?? 0);
        const budgetAmount = Number(b.amount);
        if (budgetAmount === 0) return;

        const percentUsed = (totalExpenses / budgetAmount) * 100;

        console.log(
          `User ${b.userId} used ${percentUsed.toFixed(2)}% of budget`,
        );

        if (
          percentUsed >= 80 &&
          (!b.lastAlertSent ||
            isNewMonth(new Date(b.lastAlertSent), new Date()))
        ) {
          console.log("📧 Sending budget alert email");

          await sendEmail({
            to: b.user.email,
            subject: `Budget Alert for ${account.name}`,
            react: Email({
              username: b.user.name,
              type: "budget-alert",
              data: {
                percentageUsed: percentUsed,
                budgetAmount,
                totalExpense: totalExpenses,
                accountName: account.name,
              },
            }),
          });

          await db.budget.update({
            where: { id: b.id },
            data: { lastAlertSent: new Date() },
          });
        } else {
          console.log("⏭️ Email skipped (already sent this month)");
        }
      });
    }
  },
);

// ✅ helper OUTSIDE createFunction
function isNewMonth(last, current) {
  return (
    last.getFullYear() !== current.getFullYear() ||
    last.getMonth() !== current.getMonth()
  );
}

export const triggerRecurringTransactions = inngest.createFunction(
  { id: "trigger-recurring-transaction", name: "Trigger Recurring Transactions" },
  { cron: "0 0 * * *" }, // Runs daily at midnight
  async ({ step }) => {
    const recurringTransactions = await step.run("fetch-recurring-transactions", async () => {
      return await db.transaction.findMany({
        where: {
          isRecurring: true,
          status: "COMPLETED",
          OR: [
            { lastProcessed: null },
            { nextRecurringDate: { lte: new Date() } },
          ],
        },
      });
    });

    if (recurringTransactions.length > 0) {
      // Map to the correct variable name: events
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction-recurring.process",
        data: {
          transactionId: transaction.id,
          userId: transaction.userId,
        },
      }));

      await inngest.send(events);
    }

    return { triggered: recurringTransactions.length };
  }
);

export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    throttle: {
      limit: 10,
      period: "1m",
      key: "event.data.userId",
    },
  },
  { event: "transaction-recurring.process" },
  async ({ event, step }) => {
    const { transactionId, userId } = event.data;

    await step.run("process-transaction", async () => {
      return await db.$transaction(async (tx) => {
       
        const template = await tx.transaction.findUnique({
          where: { id: transactionId, userId },
        });

        if (!template || !template.isRecurring) return;

        
        const nextDate = calculateNextDate(
          template.nextRecurringDate || template.date,
          template.recurringInterval
        );

       
        await tx.transaction.create({
          data: {
            type: template.type,
            amount: template.amount,
            description: `${template.description} (Recurring)`,
            date: new Date(),
            category: template.category,
            userId: template.userId,
            accountId: template.accountId,
            isRecurring: false, 
          },
        });

     
        await tx.transaction.update({
          where: { id: transactionId },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: nextDate,
          },
        });

        
        const amountChange = template.type === "INCOME" 
          ? template.amount 
          : template.amount.negated();

        await tx.account.update({
          where: { id: template.accountId },
          data: { balance: { increment: amountChange } },
        });
      });
    });
  }
);

function calculateNextDate(currentDate, interval) {
  const date = new Date(currentDate);
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

export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
  },
  { cron: "0 0 1 * *" },
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return db.user.findMany({
        include: { accounts: true },
      });
    });

    

    for (const user of users) {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const monthName = lastMonth.toLocaleString("default", {
        month: "long",
      });

      const stats = await step.run(
        `generate-stats-${user.id}`,
        async () => getMonthlyStats(user.id, lastMonth)
      );

      const insights = await step.run(
        `generate-insights-${user.id}`,
        async () => generateFinancialInsights(stats, monthName)
      );

      console.log(insights);

      const stepId = `send-email-${user.id}-${monthName}`;

      await step.run(stepId, async () => {
        await sendEmail({
          to: user.email,
          subject: `Your Monthly Financial Report - ${monthName}`,
          react: Email({
            username: user.name,
            type: "monthly-report",
            data: {
              stats,
              month: monthName,
              insights,
            },
          }),
        });
      });
    }
  }
);

const getMonthlyStats = async (userId, month) => {
  // 1. Create start of month in UTC: 2025-12-01T00:00:00.000Z
  const startDate = new Date(
    Date.UTC(month.getFullYear(), month.getMonth(), 1)
  );
  
  // 2. Create end of month in UTC: 2025-12-31T23:59:59.999Z
  const endDate = new Date(
    Date.UTC(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999)
  );

  console.log(`Querying from ${startDate.toISOString()} to ${endDate.toISOString()}`);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  console.log(`User ${userId}: Found ${transactions.length} transactions.`);

  return transactions.reduce(
    (stats, t) => {
      // Handle Prisma Decimal safely
      const amount = t.amount.toNumber ? t.amount.toNumber() : Number(t.amount);

      if (t.type === "EXPENSE") {
        stats.totalExpense += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }

      return stats;
    },
    {
      totalExpense: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
};

export async function generateFinancialInsights(stats, monthName) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  const prompt = `
You are a personal finance coach.

Analyze the following monthly financial data for ${monthName}
and give 3 to 5 short, clear, and actionable insights.

Rules:
- Use simple language
- Be supportive, not judgmental
- No emojis
- Each insight should be 1 sentence
- Do NOT use markdown or numbering

Data:
Total Income: ₹${stats.totalIncome}
Total Expenses: ₹${stats.totalExpense}
Transaction Count: ${stats.transactionCount}
Expenses by Category: ${JSON.stringify(stats.byCategory)}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Convert Gemini output into array of insights
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
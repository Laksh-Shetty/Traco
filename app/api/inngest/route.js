import { serve } from "inngest/next";
import { inngest } from "../../../lib/client";
import { checkBudgetAlert, generateMonthlyReports,triggerRecurringTransactions,
    processRecurringTransaction } from "../../../lib/function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    checkBudgetAlert,
    generateMonthlyReports,
    triggerRecurringTransactions,
    processRecurringTransaction,
  ],
});

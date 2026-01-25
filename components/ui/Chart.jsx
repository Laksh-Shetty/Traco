import React from "react";
import { Card } from "./card";
import ExpensePieChart from "./ExpensePieChart";
import { redirect } from "next/dist/server/api-utils";

const Chart = ({ defTrans }) => {
  const transactions = Array.isArray(defTrans) ? defTrans : [];


  const pieData = transactions.slice(0, 5).map((t) => ({
    name: t.category,
    value: t.amount,
  }));

  return (
    <div className="grid md:flex justify-center gap-6 m-6">
      {/* Recent Transactions */}
      <Card className="md:w-[47vw] p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-400">
          Recent Transactions
        </h2>

        {transactions.slice(0, 5).map((e) => (
  <div key={e.id} className="flex justify-between mb-2">
    <span className="font-bold text-lg">{e.category}</span>
    <span
      className={`font-medium ${
        e.type === "EXPENSE"
          ? "text-red-500"
          : "text-green-500"
      }`}
    >
      ₹ {e.amount}
    </span>
  </div>
))}


        {transactions.length > 5 && (
          <p className="text-sm text-muted-foreground mt-2">
            + {transactions.length - 5} more transactions
          </p>
        )}

        {transactions.length==0 && (
          <p className="text-lg mt-2 text-center">
            No Recent Transactions
          </p>
        )}
      </Card>

      {/* Expense Breakdown */}
      <Card className="w-[88vw] md:w-[45vw] p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-400">
         Recent 5 Transactions Breakdown
        </h2>

        

        {pieData.length > 0 ? (
          <ExpensePieChart data={pieData} />
        ) : (
          <p>No expense data</p>
        )}
      </Card>
    </div>
  );
};

export default Chart;

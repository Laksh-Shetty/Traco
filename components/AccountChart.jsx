"use client";
import React, { use, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import { format } from "date-fns";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

const AccountChart = ({ transactions }) => {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  

  useEffect(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setFilteredTransactions(sorted);
  }, [transactions]);

  useEffect(() => {
    handleIntervalChange(30);
  }, [transactions]);

  const Interval = {
    "7D": { label: "Last 7 Days", days: 7 },
    "1M": { label: "Last 1 Month", days: 30 },
    "3M": { label: "Last 3 Months", days: 90 },
    "6M": { label: "Last 6 Months", days: 180 },
    "1Y": { label: "Last 1 Year", days: 365 },
    ALL: { label: "All Time", days: null },
  };

  const handleIntervalChange = (days) => {
    if (!days) {
      setFilteredTransactions(transactions);
     
      return;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filtered = transactions.filter(
      (txn) => new Date(txn.date) >= cutoffDate
    );

    setFilteredTransactions(filtered);
    

  };

  const data1= filteredTransactions.reduce((acc,tsx)=>{
    const dateKey = format(new Date(tsx.date), "dd MMM");

    if (!acc[dateKey]) {
      acc[dateKey] = { income: 0, expense: 0 };
    }

    if (tsx.type === "INCOME") {
      acc[dateKey].income += tsx.amount;
    } else if (tsx.type === "EXPENSE") {
      acc[dateKey].expense += tsx.amount;
    }

    return acc;
    }, {

    });


  const data = Object.entries(data1).map(([key, value]) => ({
    name: key,
    income: value.income.toFixed(2),
    expense: value.expense.toFixed(2),
  }));

  const income = filteredTransactions
  .filter((txn) => txn.type === "INCOME")
  .reduce((sum, txn) => sum + txn.amount, 0);

const expense = filteredTransactions
  .filter((txn) => txn.type === "EXPENSE")
  .reduce((sum, txn) => sum + txn.amount, 0);


  return (
    <div className="my-8 p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between ">
        <div>
          <h2 className="text-3xl font-bold text-center mt-8">
            Transaction Overview
          </h2>
        </div>

        <div>
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="btn m-4" asChild>
               <Button variant="outline">
                Select Interval

               </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                {Object.entries(Interval).map(([key, value]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleIntervalChange(value.days)}
                  >
                    {value.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div>
        <h2>
            Total Transactions: {filteredTransactions.length}
        </h2>
      </div>

      <div className="flex justify-around my-4">
        <div className="text-gray-400 font-bold">
                Total Income: 
                <h2 className="text-green-500">
                    ₹{income.toFixed(2)}
                </h2>
        </div>
        <div className="text-gray-400 font-bold">
                Total Expense: 
                <h2 className="text-red-500">
                    ₹{expense.toFixed(2)}
                </h2>
        </div>
        <div className="text-gray-400 font-bold">
                Net Balance: 
                <h2 className={income - expense >=0 ? "text-green-500":"text-red-500"}>
                    ₹{(income - expense).toFixed(2)}
                </h2>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center mt-8 text-lg font-bold">
          No transactions to display
        </div>
      ) : (
        <div style={{ width: "90vw", height: "70vh" }} className="mx-auto">
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data} barSize={60} barGap={10} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={true} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="green" radius={[10, 10, 0, 0]} />
              <Bar dataKey="expense" fill="red" radius={[10, 10, 0, 0]} />
              <RechartsDevtools />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AccountChart;

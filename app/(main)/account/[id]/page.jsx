import React from "react";
import { getAccountsWithTransactions } from "@/actions/accounts";
import { notFound } from "next/navigation";
import TransactionComponent from "@/components/TransactionComponent";
import AccountChart from "@/components/AccountChart";

const page = async ({ params }) => {
  const { id } = await params;

  const accountData = await getAccountsWithTransactions(id);

  if (!accountData) {
    notFoundound();
  }

  return (
    <div>
      <div className="gradient-title text-5xl font-bold mt-6 mx-4">
        {accountData.name}
      </div>
      <div className="flex justify-between items-center mb-4 mt-2 p-4 bg-white rounded-lg shadow-md">
        <p className="text-xl font-semibold text-gray-400">
          {accountData.type} ACCOUNT
        </p>

        <div className="">
          <p className="font-bold">Balance: ₹{accountData.balance}</p>
          <p className="font-bold">
            {" "}
            Total Transactions: {accountData._count.transactions}
          </p>
        </div>
      </div>
      <div>
        <AccountChart transactions={accountData.transactions}></AccountChart>
      </div>
      <div>
        <TransactionComponent
          transactions={accountData.transactions}
        ></TransactionComponent>
      </div>
    </div>
  );
};

export default page;

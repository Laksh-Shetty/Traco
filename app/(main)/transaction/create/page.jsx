import React from "react";
import { getUserAccounts } from "@/actions/dashboard";
import Tform from "@/components/Tform";
import { getTransactionById } from "@/actions/transaction";
import { Suspense } from "react";

const CreateTransactionPage = async ({searchParams}) => {
  const accounts = await getUserAccounts();

  const resolvedParams = await searchParams;
const editId = resolvedParams?.edit;

  let transaction = null;
if (editId) {
  const txn = await getTransactionById(editId);

  // ... existing code
if (txn) {
  transaction = {
    ...txn,
    // Safely convert Decimal to number
    amount: parseFloat(txn.amount), 
  };
}

}



  return (
  <div className="max-w-4xl mx-auto space-y-8">
    <h1 className="gradient-title text-5xl font-bold text-center">
      {editId ? "Edit Transaction" : "Create Transaction"}
    </h1>

    <Suspense fallback={<p>Loading Form...</p>}>
      <Tform 
        accounts={accounts} 
        mode={editId ? "edit" : "create"} 
        transaction={transaction}
      />
    </Suspense>
  </div>
);
};

export default CreateTransactionPage;

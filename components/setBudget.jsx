"use client";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pen } from "lucide-react";
import { updateBudget } from "@/actions/getBudget";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const SetBudget = ({ budget, expense }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const amount = Number(formData.get("amount"));

    if (!amount || amount <= 0) {
      toast.error("Enter a valid budget");
      return;
    }
    await updateBudget(amount);
    toast.success("Budget updated successfully");
    setIsEditing(false);
  };

  return (
    <Card className="mx-10">
      <CardHeader>
        <CardTitle>Monthly Budget (Default Account)</CardTitle>
        <CardAction />
      </CardHeader>

      <CardContent>
        {!isEditing && (
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-500">Budget:</p>
            <p className="font-medium">
              {budget ? `₹${budget.amount}` : "No Budget Set"}
            </p>
            <Pen
              className="h-4 w-4 cursor-pointer"
              onClick={() => setIsEditing(true)}
            />
          </div>
        )}

        {isEditing && (
          <form onSubmit={handleEditSubmit}>
            <input
              name="amount"
              type="number"
              defaultValue={budget?.amount ?? ""}
              className="border p-2 rounded mr-2"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <div className="flex gap-2">
          <p className="text-gray-500">Expenses:</p>
          <p>₹{expense}</p>
        </div>

        <div className="flex gap-2 pb-4">
          <p className="text-gray-500">Remaining:</p>
          <p
            className={
              expense > (budget?.amount ?? 0)
                ? "text-red-500"
                : "text-green-500"
            }
          >
            ₹{budget ? (budget.amount - expense).toFixed(2) : "N/A"}
          </p>
        </div>
        {budget && (
          <Progress
            value={
              budget.amount > 0
                ? Math.min((expense / budget.amount) * 100, 100)
                : 0
            }
            className={`
      w-full h-2 rounded-full
      [&>div]:transition-all
      ${
        expense / budget.amount < 0.6
          ? "[&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-600"
          : expense / budget.amount < 0.9
          ? "[&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-orange-500"
          : "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-red-700"
      }
    `}
          />
        )}

        
      </CardFooter>
      <p className="text-sm text-gray-500 text-right px-8">
            {(expense / (budget?.amount)*100).toFixed(2)}% used
        </p>
    </Card>
  );
};

export default SetBudget;

"use client";

import React, { useCallback, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionSchema } from "@/app/lib/schema";
import { createTransaction } from "@/actions/transaction";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar } from "./ui/calendar";
import z from "zod";
import AiReceipt from "./AiReceipt";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { updateTransaction } from "@/actions/transaction";

const Tform = ({ accounts, mode, transaction }) => {
  const router = useRouter();

const {
  register,
  setValue,
  handleSubmit,
  formState: { errors },
  watch,
  reset,
} = useForm({
  resolver: zodResolver(TransactionSchema),
  defaultValues: {
    type: "EXPENSE",
    amount: undefined, 
    description: "",
    category: "",
    accountId: accounts.find((ac) => ac.isDefault)?.id,
    date: new Date(),
    isRecurring: false,
    recurringInterval: null,
  },
});


useEffect(() => {
  console.log("EDIT EFFECT FIRED");

  if (mode === "edit" && transaction) {
    console.log("SETTING FORM VALUES", transaction);

    reset({
      amount: transaction.amount,
      description: transaction.description ?? "",
      category: transaction.category ?? "",
      isRecurring: transaction.isRecurring,
      recurringInterval: transaction.recurringInterval,
    });

    setValue("type", transaction.type);
    setValue("accountId", transaction.accountId);
    setValue("date", new Date(transaction.date));
  }
}, [mode, transaction, reset, setValue]);



  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const {
    loading: transactionLoading,
    fn: transactionFunction,
    data: transactionResult,
  } = useFetch(createTransaction);

const onSubmit = async (data) => {
  const formData = {
    ...data,
    amount: parseFloat(data.amount),
  };

  if (mode === "edit" && transaction) {
    try {
      await updateTransaction({ ...formData, id: transaction.id });
      toast.success("Transaction updated successfully");
      router.push(`/account/${formData.accountId}`);
    } catch (err) {
      toast.error(err.message);
    }
  } else {
    await transactionFunction(formData);
  }
};

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success("Transaction Created successfully");
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading]);

  const handleScanComplete = useCallback(
    (scannedData) => {
      if (!scannedData) return;
      // Use shouldDirty: true to ensure form recognizes change without loop
      setValue("amount", scannedData.amount.toString(), {
        shouldValidate: true,
      });
      setValue("date", new Date(scannedData.date), { shouldValidate: true });
      if (scannedData.category) setValue("category", scannedData.category);
      if (scannedData.merchantName)
        setValue("description", scannedData.merchantName);
    },
    [setValue],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto space-y-6 p-6 border rounded-xl my-6"
    >
      <h2 className="text-xl font-semibold">Add Transaction</h2>

      <AiReceipt onScanComplete={handleScanComplete}></AiReceipt>

      <div className="space-y-2">
        <Label>Transaction Type</Label>
        <Select value={type} onValueChange={(value) => setValue("type", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Amount</Label>
        <Input
          type="number"
          placeholder="Enter amount"
          {...register("amount")}
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Input
          placeholder="e.g. Food, Groceries, Salary"
          {...register("category")}
        />
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          placeholder="Optional description"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Account</Label>
        <Select
          value={watch("accountId")}
          onValueChange={(value) => setValue("accountId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.accountId && (
          <p className="text-sm text-red-500">{errors.accountId.message}</p>
        )}
      </div>

      <div className="space-y-2 flex flex-col">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Label>Recurring Transaction</Label>
        <Switch
          checked={isRecurring}
          onCheckedChange={(value) => setValue("isRecurring", value)}
        />
      </div>

      {isRecurring && (
        <div className="space-y-2">
          <Label>Recurring Interval</Label>
          <Select
            value={watch("recurringInterval")}
            onValueChange={(value) => setValue("recurringInterval", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-sm text-red-500">
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}

      <Button type="submit" disabled={transactionLoading} className="w-full">
        {transactionLoading ? "Adding..." : "Add Transaction"}
      </Button>
    </form>
  );
};

export default Tform;

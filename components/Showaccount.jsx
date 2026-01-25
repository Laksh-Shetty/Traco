"use client";

import React, { useEffect, useState, useTransition } from "react";
import { setDefaultAccount } from "@/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowUp, TrendingUp } from "lucide-react";
import { ArrowDown, TrendingDown } from "lucide-react";
import Link from "next/link"

const Showaccount = ({ accounts }) => {
  const [defaultId, setDefaultId] = useState(
    accounts?.find((a) => a.isDefault)?.id
  );

  const [isPending, startTransition] = useTransition();

  const handleToggle = (accountId) => {
    setDefaultId(accountId);

    startTransition(() => {
      setDefaultAccount(accountId);
    });
  };

  useEffect(() => {
    const newDef = accounts?.find((a) => a.isDefault)?.id;
    setDefaultId(newDef);
  }, [accounts]);

  return (
    <>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-6 ">
        {accounts?.map((account) => (
          <Card key={account.id} className="p-4">
            <div className="flex justify-between">
              <div>
                <Link href={`/account/${account.id}`}>
                <CardHeader>
                  <CardTitle className="text-lg mb-2">{account.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <p className="text-4xl font-bold">₹{account.balance}</p>
                  <p className="text-sm text-gray-400">
                    {account.type} ACCOUNT
                  </p>
                </CardContent>
                </Link>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Switch
                  checked={defaultId === account.id}
                  disabled={isPending}
                  onCheckedChange={() => handleToggle(account.id)}
                />
                <span className="text-sm">
                  {defaultId === account.id ? "Default" : ""}
                </span>
              </div>
            </div>
            <div className="flex justify-between px-4 text-sm text-gray-400">
              <div className="flex gap-2">
                <TrendingUp className="text-green-500" />
                Income
              </div>
              <div className="flex gap-2">
                <TrendingDown className="text-red-500" />
                Expense
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Showaccount;

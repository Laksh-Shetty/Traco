"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/lib/schema";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { createAccount, setDefaultAccount } from "@/actions/dashboard";
import useFetch from "@/hooks/useFetch";
import { Loader2 } from "lucide-react";

const Drawerbox = ({ children }) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {data,error,fn,loading} = useFetch(createAccount);

  const onSubmit = async(data) => {
    await fn(data);
    setOpen(false);
    
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="p-4 border border-dashed rounded-md hover:bg-gray-100 cursor-pointer min-h-[140px] flex flex-col items-center justify-center text-center">
          {children}
        </div>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Account Name</label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Account Type</label>
            <select
              {...register("type")}
              className="w-full border rounded-md p-2"
            >
              <option value="CURRENT">CURRENT</option>
              <option value="SAVINGS">SAVINGS</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Initial Balance</label>
            <Input
              type="number"
              placeholder="0.00"
              step="0.01"
              id="balance"
              {...register("balance", { valueAsNumber: true })}
            />
          </div>

          <div className="flex items-center justify-between border rounded-xl p-2 mt-4">
            <div>
              <label className="text-sm font-medium mr-8">Set as Default</label>
              <p>This will make this account your default for transactions.</p>
            </div>
            <div>
              <Switch
                id="isDefault"
                onCheckedChange={(checked) => setValue("isDefault", checked)}
                checked={watch("isDefault")}
              />
            </div>
          </div>

          <div className="flex justify-center w-full space-x-2 mt-6">
            <div className="w-full">
              <DrawerClose asChild>
                <Button variant="outline" className="w-full mt-2">
                  Cancel
                </Button>
              </DrawerClose>
            </div>

            <div className="w-full">
              <Button
                className="w-full mt-2"
                type="submit"
                onClick={() => console.log("Submitting form")}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
              </Button>
            </div>
          </div>
        </form>
      </DrawerContent>
    </Drawer>


  );
};

export default Drawerbox;

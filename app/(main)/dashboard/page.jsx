export const dynamic = "force-dynamic";
import { getUserAccounts } from "@/actions/dashboard";
import Drawerbox from "@/components/Drawerbox";
import { Plus } from "lucide-react";
import Showaccount from "@/components/Showaccount";
import { getBudget, updateBudget } from "@/actions/getBudget";
import { Button } from "@/components/ui/button";
import { defaultBudget } from "@/actions/getBudget";
import SetBudget from "@/components/setBudget";
import { getDefaultInfo } from "@/actions/dashboard";
import Chart from "@/components/ui/Chart";

const Page = async () => {
  const budget = await getBudget();
  const expense = await defaultBudget();
  const accounts = await getUserAccounts();
  const data = await getDefaultInfo();

  return (
    <div>
      <div className="gradient-title text-5xl font-bold mb-6 ml-6 mt-4">
        Dashboard
      </div>

      <div>
        
        <div>
          <SetBudget budget={budget} 
          expense={expense}
          />
        </div>

        <div>
          <Chart defTrans={data.transactions} />
        </div>

      </div>

      <div className="m-10 gap-4 hover:text-gray-400">
        <Drawerbox>
          <div className="flex h-full flex-col items-center justify-center text-center ">
            <Plus className="h-10 w-10 mb-2" />
            <p className="text-sm font-medium ">Add New Account</p>
          </div>
        </Drawerbox>

       
      </div>

      <div className="mt-10">
        <Showaccount accounts={accounts} className="pb-4"></Showaccount>
      </div>
    </div>
  );
};

export default Page;

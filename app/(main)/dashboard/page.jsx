import { Suspense } from "react";
export const dynamic = "force-dynamic";

import { getUserAccounts, getDefaultInfo } from "@/actions/dashboard";
import Drawerbox from "@/components/Drawerbox";
import { Plus } from "lucide-react";
import Showaccount from "@/components/Showaccount";
import { getBudget, defaultBudget } from "@/actions/getBudget";
import SetBudget from "@/components/setBudget";
import Chart from "@/components/ui/Chart";

const BudgetSkeleton = () => (
  <div className="mx-10 h-40 bg-gray-200 rounded-lg animate-pulse" />
);

const ChartSkeleton = () => (
  <div className="mx-10 h-64 bg-gray-200 rounded-lg animate-pulse" />
);

const AccountsSkeleton = () => (
  <div className="m-10 h-40 bg-gray-200 rounded-lg animate-pulse" />
);

async function BudgetSection() {
  const [budget, expense] = await Promise.all([getBudget(), defaultBudget()]);
  return <SetBudget budget={budget} expense={expense} />;
}

async function ChartSection() {
  const data = await getDefaultInfo();
  return <Chart defTrans={data.transactions} />;
}

async function AccountsSection() {
  const accounts = await getUserAccounts();
  return <Showaccount accounts={accounts} className="pb-4" />;
}

const Page = () => {
  return (
    <div>
      <div className="gradient-title text-5xl font-bold mb-6 ml-6 mt-4 py-4">
        Dashboard
      </div>

      <div>
        <div>
          <Suspense fallback={<BudgetSkeleton />}>
            <BudgetSection />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<ChartSkeleton />}>
            <ChartSection />
          </Suspense>
        </div>
      </div>

      <div className="m-10 gap-4 hover:text-gray-400">
        <Drawerbox>
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Plus className="h-10 w-10 mb-2" />
            <p className="text-sm font-medium">Add New Account</p>
          </div>
        </Drawerbox>
      </div>

      <div className="mt-10">
        <Suspense fallback={<AccountsSkeleton />}>
          <AccountsSection />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
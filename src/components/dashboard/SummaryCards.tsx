import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface Props {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

interface CardProps {
  label: string;
  value: number;
  subValue?: number;
  subLabel?: string;
  icon: typeof Wallet;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
  positive?: boolean;
}

function Card({ label, value, subValue, subLabel, icon: Icon, iconBg, iconColor, valueColor, positive }: CardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className={`mt-2 text-2xl font-bold ${valueColor ?? 'text-gray-900 dark:text-white'}`}>
            {formatCurrency(value)}
          </p>
          {subValue !== undefined && subLabel && (
            <p className={`mt-1 text-xs font-medium ${positive ? 'text-emerald-600' : 'text-rose-500'}`}>
              {subLabel}: {formatCurrency(subValue)}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={22} className={iconColor} />
        </div>
      </div>
    </div>
  );
}

export default function SummaryCards({ totalIncome, totalExpenses, balance, monthlyIncome, monthlyExpenses }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card
        label="Total Balance"
        value={balance}
        subValue={monthlyIncome - monthlyExpenses}
        subLabel="This month"
        icon={Wallet}
        iconBg="bg-blue-50 dark:bg-blue-900/30"
        iconColor="text-blue-600 dark:text-blue-400"
        valueColor={balance >= 0 ? 'text-gray-900 dark:text-white' : 'text-rose-600'}
        positive={balance >= 0}
      />
      <Card
        label="Total Income"
        value={totalIncome}
        subValue={monthlyIncome}
        subLabel="This month"
        icon={TrendingUp}
        iconBg="bg-emerald-50 dark:bg-emerald-900/30"
        iconColor="text-emerald-600 dark:text-emerald-400"
        valueColor="text-emerald-700 dark:text-emerald-400"
        positive
      />
      <Card
        label="Total Expenses"
        value={totalExpenses}
        subValue={monthlyExpenses}
        subLabel="This month"
        icon={TrendingDown}
        iconBg="bg-rose-50 dark:bg-rose-900/30"
        iconColor="text-rose-600 dark:text-rose-400"
        valueColor="text-rose-600 dark:text-rose-400"
      />
    </div>
  );
}

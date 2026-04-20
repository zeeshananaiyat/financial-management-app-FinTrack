import { TrendingUp, TrendingDown } from 'lucide-react';
import { Income, Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  label: string;
  category: string;
  amount: number;
  date: string;
}

interface Props {
  income: Income[];
  expenses: Expense[];
}

export default function RecentTransactions({ income, expenses }: Props) {
  const transactions: Transaction[] = [
    ...income.map(i => ({ id: i.id, type: 'income' as const, label: i.source, category: 'Income', amount: i.amount, date: i.date })),
    ...expenses.map(e => ({ id: e.id, type: 'expense' as const, label: e.description || e.category, category: e.category, amount: e.amount, date: e.date })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 text-center">
        <p className="text-gray-400 dark:text-gray-500 text-sm">No transactions yet. Start by adding income or expenses.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
      </div>
      <ul className="divide-y divide-gray-50 dark:divide-gray-700/50">
        {transactions.map(tx => (
          <li key={`${tx.type}-${tx.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                tx.type === 'income'
                  ? 'bg-emerald-50 dark:bg-emerald-900/30'
                  : 'bg-rose-50 dark:bg-rose-900/30'
              }`}>
                {tx.type === 'income'
                  ? <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
                  : <TrendingDown size={16} className="text-rose-500 dark:text-rose-400" />
                }
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[180px]">{tx.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{tx.category} · {formatDate(tx.date)}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${
              tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {tx.type === 'income' ? '+' : '-'}{formatCurrency(Number(tx.amount))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SummaryCards from '../components/dashboard/SummaryCards';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { monthStart, monthEnd } from '../utils/formatters';

export default function DashboardPage() {
  const { income, expenses, loading } = useApp();

  const thisMonth = useMemo(() => {
    const start = monthStart();
    const end = monthEnd();
    return {
      income: income.filter(i => i.date >= start && i.date <= end).reduce((s, i) => s + Number(i.amount), 0),
      expenses: expenses.filter(e => e.date >= start && e.date <= end).reduce((s, e) => s + Number(e.amount), 0),
    };
  }, [income, expenses]);

  const totals = useMemo(() => ({
    income: income.reduce((s, i) => s + Number(i.amount), 0),
    expenses: expenses.reduce((s, e) => s + Number(e.amount), 0),
  }), [income, expenses]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      <SummaryCards
        totalIncome={totals.income}
        totalExpenses={totals.expenses}
        balance={totals.income - totals.expenses}
        monthlyIncome={thisMonth.income}
        monthlyExpenses={thisMonth.expenses}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Link
          to="/income"
          className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow group"
        >
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quick Add</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white mt-0.5">Add Income Entry</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
            <Plus size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
        </Link>
        <Link
          to="/expenses"
          className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow group"
        >
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quick Add</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white mt-0.5">Add Expense Entry</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center group-hover:bg-rose-100 dark:group-hover:bg-rose-900/50 transition-colors">
            <Plus size={20} className="text-rose-500 dark:text-rose-400" />
          </div>
        </Link>
      </div>

      <RecentTransactions income={income} expenses={expenses} />
    </div>
  );
}

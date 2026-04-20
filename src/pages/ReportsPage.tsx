import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import OverviewChart from '../components/reports/OverviewChart';
import CategoryBreakdown from '../components/reports/CategoryBreakdown';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { formatCurrency, getMonthKey } from '../utils/formatters';
import { MonthlySummary } from '../types';

type Period = '6m' | '12m' | 'all';

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#ef4444',
  'Rent & Housing': '#f97316',
  'Transport': '#eab308',
  'Shopping': '#22c55e',
  'Healthcare': '#06b6d4',
  'Entertainment': '#8b5cf6',
  'Utilities': '#64748b',
  'Education': '#f43f5e',
  'Travel': '#0ea5e9',
  'Other': '#a8a29e',
};

function getColor(name: string, index: number): string {
  const palette = ['#3b82f6','#ef4444','#22c55e','#f97316','#06b6d4','#eab308','#8b5cf6','#ec4899','#64748b','#0ea5e9'];
  return CATEGORY_COLORS[name] ?? palette[index % palette.length];
}

export default function ReportsPage() {
  const { income, expenses, categories, loading } = useApp();
  const [period, setPeriod] = useState<Period>('6m');

  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c, i) => { map[c.name] = c.color || getColor(c.name, i); });
    return map;
  }, [categories]);

  const monthlySummaries = useMemo((): MonthlySummary[] => {
    const now = new Date();
    const months: string[] = [];
    const count = period === '6m' ? 6 : period === '12m' ? 12 : 24;
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    return months.map(key => {
      const inc = income.filter(i => getMonthKey(i.date) === key).reduce((s, i) => s + Number(i.amount), 0);
      const exp = expenses.filter(e => getMonthKey(e.date) === key).reduce((s, e) => s + Number(e.amount), 0);
      const label = new Date(key + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      return { month: label, income: inc, expenses: exp, balance: inc - exp };
    });
  }, [income, expenses, period]);

  const expenseCategoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] ?? 0) + Number(e.amount); });
    return Object.entries(map)
      .map(([name, value], i) => ({ name, value, color: categoryColorMap[name] ?? getColor(name, i) }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, categoryColorMap]);

  const incomeCategoryData = useMemo(() => {
    const map: Record<string, number> = {};
    income.forEach(i => { map[i.source] = (map[i.source] ?? 0) + Number(i.amount); });
    return Object.entries(map)
      .map(([name, value], i) => ({ name, value, color: categoryColorMap[name] ?? getColor(name, i) }))
      .sort((a, b) => b.value - a.value);
  }, [income, categoryColorMap]);

  const totals = useMemo(() => ({
    income: income.reduce((s, i) => s + Number(i.amount), 0),
    expenses: expenses.reduce((s, e) => s + Number(e.amount), 0),
  }), [income, expenses]);

  const savingsRate = totals.income > 0 ? (((totals.income - totals.expenses) / totals.income) * 100).toFixed(1) : '0';

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Income', value: formatCurrency(totals.income), color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Total Expenses', value: formatCurrency(totals.expenses), color: 'text-rose-600 dark:text-rose-400' },
          { label: 'Net Balance', value: formatCurrency(totals.income - totals.expenses), color: totals.income >= totals.expenses ? 'text-blue-600 dark:text-blue-400' : 'text-red-600' },
          { label: 'Savings Rate', value: `${savingsRate}%`, color: 'text-gray-900 dark:text-white' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500">{stat.label}</p>
            <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Income vs Expenses</h3>
          <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
            {([['6m', '6 Months'], ['12m', '12 Months'], ['all', 'All Time']] as [Period, string][]).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setPeriod(val)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${period === val ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <OverviewChart data={monthlySummaries} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Expense Breakdown</h3>
          <CategoryBreakdown data={expenseCategoryData} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Income Sources</h3>
          <CategoryBreakdown data={incomeCategoryData} />
        </div>
      </div>
    </div>
  );
}

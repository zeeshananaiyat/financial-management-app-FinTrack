import { useState, useEffect } from 'react';
import { Expense, ExpenseFormData } from '../../types';
import { todayStr } from '../../utils/formatters';

interface Props {
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel: () => void;
  initial?: Expense;
  categories: string[];
}

export default function ExpenseForm({ onSubmit, onCancel, initial, categories }: Props) {
  const [form, setForm] = useState<ExpenseFormData>({
    amount: '',
    category: '',
    date: todayStr(),
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ExpenseFormData>>({});

  useEffect(() => {
    if (initial) {
      setForm({
        amount: String(initial.amount),
        category: initial.category,
        date: initial.date,
        description: initial.description,
      });
    }
  }, [initial]);

  const validate = () => {
    const errs: Partial<ExpenseFormData> = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.category.trim()) errs.category = 'Category is required';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof ExpenseFormData) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [key]: e.target.value }));
      setErrors(prev => ({ ...prev, [key]: undefined }));
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (PKR)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          className={`w-full px-4 py-2.5 rounded-xl border text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.amount ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
          {...field('amount')}
        />
        {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
        <select
          className={`w-full px-4 py-2.5 rounded-xl border text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.category ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
          {...field('category')}
        >
          <option value="">Select category...</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
        <input
          type="date"
          className={`w-full px-4 py-2.5 rounded-xl border text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.date ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
          {...field('date')}
        />
        {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description <span className="text-gray-400">(optional)</span></label>
        <textarea
          rows={2}
          placeholder="What did you spend on?"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
          value={form.description}
          onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Saving...' : initial ? 'Update' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}

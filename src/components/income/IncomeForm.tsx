import { useState, useEffect } from 'react';
import { Income, IncomeFormData } from '../../types';
import { todayStr } from '../../utils/formatters';

interface Props {
  onSubmit: (data: IncomeFormData) => Promise<void>;
  onCancel: () => void;
  initial?: Income;
  incomeSources: string[];
}

const COMMON_SOURCES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other Income'];

export default function IncomeForm({ onSubmit, onCancel, initial, incomeSources }: Props) {
  const [form, setForm] = useState<IncomeFormData>({
    amount: '',
    source: '',
    date: todayStr(),
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<IncomeFormData>>({});

  const allSources = Array.from(new Set([...COMMON_SOURCES, ...incomeSources]));

  useEffect(() => {
    if (initial) {
      setForm({
        amount: String(initial.amount),
        source: initial.source,
        date: initial.date,
        notes: initial.notes,
      });
    }
  }, [initial]);

  const validate = () => {
    const errs: Partial<IncomeFormData> = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.source.trim()) errs.source = 'Source is required';
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

  const field = (key: keyof IncomeFormData) => ({
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
        <input
          list="income-sources"
          placeholder="Select or type source"
          className={`w-full px-4 py-2.5 rounded-xl border text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.source ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
          {...field('source')}
        />
        <datalist id="income-sources">
          {allSources.map(s => <option key={s} value={s} />)}
        </datalist>
        {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source}</p>}
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes <span className="text-gray-400">(optional)</span></label>
        <textarea
          rows={2}
          placeholder="Add notes..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
          value={form.notes}
          onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Saving...' : initial ? 'Update' : 'Add Income'}
        </button>
      </div>
    </form>
  );
}

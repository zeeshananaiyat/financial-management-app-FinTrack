import { useState } from 'react';
import { Trash2, Plus, Tag } from 'lucide-react';
import { Category } from '../../types';

interface Props {
  categories: Category[];
  onAdd: (name: string, type: 'income' | 'expense', color: string) => Promise<void>;
  onDelete: (id: string) => void;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#64748b', '#0ea5e9',
];

export default function CategoryList({ categories, onAdd, onDelete }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const expenseCats = categories.filter(c => c.type === 'expense');
  const incomeCats = categories.filter(c => c.type === 'income');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    if (categories.some(c => c.name.toLowerCase() === name.trim().toLowerCase() && c.type === type)) {
      setError('Category already exists');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onAdd(name.trim(), type, color);
      setName('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Add Category</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Category name"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${error ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
            />
            <select
              value={type}
              onChange={e => setType(e.target.value as 'income' | 'expense')}
              className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Color</p>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800 scale-110' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Plus size={16} />
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>

      {[{ label: 'Expense Categories', items: expenseCats, badge: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' }, { label: 'Income Categories', items: incomeCats, badge: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' }].map(({ label, items, badge }) => (
        <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{label}</h3>
          </div>
          {items.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No categories yet</div>
          ) : (
            <ul className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {items.map(cat => (
                <li key={cat.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <Tag size={14} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{cat.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge}`}>{cat.type}</span>
                  </div>
                  <button
                    onClick={() => onDelete(cat.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Income, Expense, Category } from '../types';
import { incomeService } from '../services/incomeService';
import { expenseService } from '../services/expenseService';
import { categoryService } from '../services/categoryService';
import { useAuth } from './AuthContext';

interface AppContextType {
  income: Income[];
  expenses: Expense[];
  categories: Category[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  addIncome: (data: Omit<Income, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateIncome: (id: string, data: Partial<Income>) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  addExpense: (data: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateExpense: (id: string, data: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCategory: (data: Omit<Category, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Food & Dining', color: '#ef4444' },
  { name: 'Rent & Housing', color: '#f97316' },
  { name: 'Transport', color: '#eab308' },
  { name: 'Shopping', color: '#22c55e' },
  { name: 'Healthcare', color: '#06b6d4' },
  { name: 'Entertainment', color: '#8b5cf6' },
  { name: 'Utilities', color: '#64748b' },
  { name: 'Education', color: '#f43f5e' },
  { name: 'Travel', color: '#0ea5e9' },
  { name: 'Other', color: '#a8a29e' },
];

const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salary', color: '#2563eb' },
  { name: 'Freelance', color: '#16a34a' },
  { name: 'Business', color: '#d97706' },
  { name: 'Investment', color: '#0891b2' },
  { name: 'Gift', color: '#db2777' },
  { name: 'Other Income', color: '#6b7280' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [income, setIncome] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const seedDefaultCategories = useCallback(async (userId: string, existingCats: Category[]) => {
    if (existingCats.length > 0) return;
    const defaults = [
      ...DEFAULT_EXPENSE_CATEGORIES.map(c => ({ ...c, type: 'expense' as const })),
      ...DEFAULT_INCOME_CATEGORIES.map(c => ({ ...c, type: 'income' as const })),
    ];
    const seeded = await Promise.all(
      defaults.map(cat => categoryService.create(userId, cat))
    );
    setCategories(seeded.filter(Boolean) as Category[]);
  }, []);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [inc, exp, cats] = await Promise.all([
        incomeService.getAll(user.id),
        expenseService.getAll(user.id),
        categoryService.getAll(user.id),
      ]);
      setIncome(inc);
      setExpenses(exp);
      setCategories(cats);
      await seedDefaultCategories(user.id, cats);
    } finally {
      setLoading(false);
    }
  }, [user, seedDefaultCategories]);

  useEffect(() => {
    if (user) fetchAll();
    else {
      setIncome([]);
      setExpenses([]);
      setCategories([]);
    }
  }, [user, fetchAll]);

  const addIncome = async (data: Omit<Income, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    const created = await incomeService.create(user.id, data);
    if (created) setIncome(prev => [created, ...prev]);
  };

  const updateIncome = async (id: string, data: Partial<Income>) => {
    const updated = await incomeService.update(id, data);
    if (updated) setIncome(prev => prev.map(i => i.id === id ? updated : i));
  };

  const deleteIncome = async (id: string) => {
    await incomeService.remove(id);
    setIncome(prev => prev.filter(i => i.id !== id));
  };

  const addExpense = async (data: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    const created = await expenseService.create(user.id, data);
    if (created) setExpenses(prev => [created, ...prev]);
  };

  const updateExpense = async (id: string, data: Partial<Expense>) => {
    const updated = await expenseService.update(id, data);
    if (updated) setExpenses(prev => prev.map(e => e.id === id ? updated : e));
  };

  const deleteExpense = async (id: string) => {
    await expenseService.remove(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addCategory = async (data: Omit<Category, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    const created = await categoryService.create(user.id, data);
    if (created) setCategories(prev => [...prev, created]);
  };

  const deleteCategory = async (id: string) => {
    await categoryService.remove(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <AppContext.Provider value={{
      income, expenses, categories, loading, fetchAll,
      addIncome, updateIncome, deleteIncome,
      addExpense, updateExpense, deleteExpense,
      addCategory, deleteCategory,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

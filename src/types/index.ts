export interface User {
  id: string;
  email: string;
}

export interface Income {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  date: string;
  notes: string;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  created_at: string;
}

export interface IncomeFormData {
  amount: string;
  source: string;
  date: string;
  notes: string;
}

export interface ExpenseFormData {
  amount: string;
  category: string;
  date: string;
  description: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

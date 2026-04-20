/*
  # Financial Management App - Initial Schema

  ## Overview
  Creates the core tables for income, expenses, and categories management.

  ## Tables

  ### 1. income
  Stores all income entries per user.
  - id: UUID primary key
  - user_id: References auth.users, cascade delete
  - amount: Decimal amount (12,2 precision)
  - source: Income source name
  - date: Date of income
  - notes: Optional notes
  - created_at: Timestamp

  ### 2. expenses
  Stores all expense entries per user.
  - id: UUID primary key
  - user_id: References auth.users, cascade delete
  - amount: Decimal amount
  - category: Expense category name
  - date: Date of expense
  - description: Optional description
  - created_at: Timestamp

  ### 3. categories
  Stores user-specific custom categories.
  - id: UUID primary key
  - user_id: References auth.users, cascade delete
  - name: Category name
  - type: 'income' or 'expense'
  - color: Hex color string
  - created_at: Timestamp

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
*/

CREATE TABLE IF NOT EXISTS income (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount decimal(12,2) NOT NULL,
  source text NOT NULL,
  date date NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount decimal(12,2) NOT NULL,
  category text NOT NULL,
  date date NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  color text DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own income"
  ON income FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own income"
  ON income FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own income"
  ON income FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own income"
  ON income FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can select own expenses"
  ON expenses FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can select own categories"
  ON categories FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_income_user_id ON income(user_id);
CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

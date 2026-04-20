import { supabase } from '../lib/supabase';
import { Expense } from '../types';

export const expenseService = {
  async getAll(userId: string): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    if (error) return [];
    return data ?? [];
  },

  async create(userId: string, payload: Omit<Expense, 'id' | 'user_id' | 'created_at'>): Promise<Expense | null> {
    const { data, error } = await supabase
      .from('expenses')
      .insert({ ...payload, user_id: userId })
      .select()
      .maybeSingle();
    if (error) return null;
    return data;
  },

  async update(id: string, payload: Partial<Expense>): Promise<Expense | null> {
    const { data, error } = await supabase
      .from('expenses')
      .update(payload)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) return null;
    return data;
  },

  async remove(id: string): Promise<void> {
    await supabase.from('expenses').delete().eq('id', id);
  },
};

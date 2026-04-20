import { supabase } from '../lib/supabase';
import { Income } from '../types';

export const incomeService = {
  async getAll(userId: string): Promise<Income[]> {
    const { data, error } = await supabase
      .from('income')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    if (error) { console.error(error); return []; }
    return data ?? [];
  },

  async create(userId: string, payload: Omit<Income, 'id' | 'user_id' | 'created_at'>): Promise<Income | null> {
    const { data, error } = await supabase
      .from('income')
      .insert({ ...payload, user_id: userId })
      .select()
      .maybeSingle();
    if (error) { console.error(error); return null; }
    return data;
  },

  async update(id: string, payload: Partial<Income>): Promise<Income | null> {
    const { data, error } = await supabase
      .from('income')
      .update(payload)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) { console.error(error); return null; }
    return data;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('income').delete().eq('id', id);
    if (error) console.error(error);
  },
};

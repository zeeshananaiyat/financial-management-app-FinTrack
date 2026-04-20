import { supabase } from '../lib/supabase';
import { Category } from '../types';

export const categoryService = {
  async getAll(userId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name');
    if (error) return [];
    return data ?? [];
  },

  async create(userId: string, payload: Omit<Category, 'id' | 'user_id' | 'created_at'>): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .insert({ ...payload, user_id: userId })
      .select()
      .maybeSingle();
    if (error) return null;
    return data;
  },

  async remove(id: string): Promise<void> {
    await supabase.from('categories').delete().eq('id', id);
  },
};

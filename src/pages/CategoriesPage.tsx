import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import CategoryList from '../components/categories/CategoryList';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function CategoriesPage() {
  const { categories, loading, addCategory, deleteCategory } = useApp();
  const { showToast } = useToast();

  const handleAdd = async (name: string, type: 'income' | 'expense', color: string) => {
    await addCategory({ name, type, color });
    showToast('success', `Category "${name}" added`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await deleteCategory(id);
    showToast('info', 'Category deleted');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-2xl">
      <CategoryList
        categories={categories}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />
    </div>
  );
}

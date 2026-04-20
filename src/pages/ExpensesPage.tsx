import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseList from '../components/expenses/ExpenseList';
import Modal from '../components/shared/Modal';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Expense, ExpenseFormData } from '../types';
import { exportExpensesCSV } from '../utils/exportCSV';
import { exportExpensesPDF } from '../utils/exportPDF';

export default function ExpensesPage() {
  const { expenses, categories, loading, addExpense, updateExpense, deleteExpense } = useApp();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | undefined>();

  const expenseCategories = categories
    .filter(c => c.type === 'expense')
    .map(c => c.name);

  const openAdd = () => { setEditing(undefined); setModalOpen(true); };
  const openEdit = (item: Expense) => { setEditing(item); setModalOpen(true); };

  const handleSubmit = async (data: ExpenseFormData) => {
    const payload = {
      amount: Number(data.amount),
      category: data.category,
      date: data.date,
      description: data.description.trim(),
    };
    if (editing) {
      await updateExpense(editing.id, payload);
      showToast('success', 'Expense updated');
    } else {
      await addExpense(payload);
      showToast('success', 'Expense added');
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense entry?')) return;
    await deleteExpense(id);
    showToast('info', 'Expense deleted');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{expenses.length} total records</p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      <ExpenseList
        expenses={expenses}
        categories={expenseCategories}
        onEdit={openEdit}
        onDelete={handleDelete}
        onExportCSV={() => { exportExpensesCSV(expenses); showToast('success', 'CSV exported'); }}
        onExportPDF={() => { exportExpensesPDF(expenses); showToast('success', 'PDF exported'); }}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Expense' : 'Add Expense'}>
        <ExpenseForm
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          initial={editing}
          categories={expenseCategories}
        />
      </Modal>
    </div>
  );
}

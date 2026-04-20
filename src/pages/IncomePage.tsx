import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import IncomeForm from '../components/income/IncomeForm';
import IncomeList from '../components/income/IncomeList';
import Modal from '../components/shared/Modal';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Income, IncomeFormData } from '../types';
import { exportIncomeCSV } from '../utils/exportCSV';
import { exportIncomePDF } from '../utils/exportPDF';

export default function IncomePage() {
  const { income, categories, loading, addIncome, updateIncome, deleteIncome } = useApp();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Income | undefined>();

  const incomeCategories = categories
    .filter(c => c.type === 'income')
    .map(c => c.name);

  const openAdd = () => { setEditing(undefined); setModalOpen(true); };
  const openEdit = (item: Income) => { setEditing(item); setModalOpen(true); };

  const handleSubmit = async (data: IncomeFormData) => {
    const payload = {
      amount: Number(data.amount),
      source: data.source.trim(),
      date: data.date,
      notes: data.notes.trim(),
    };
    if (editing) {
      await updateIncome(editing.id, payload);
      showToast('success', 'Income updated');
    } else {
      await addIncome(payload);
      showToast('success', 'Income added');
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this income entry?')) return;
    await deleteIncome(id);
    showToast('info', 'Income deleted');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{income.length} total records</p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Income
        </button>
      </div>

      <IncomeList
        income={income}
        onEdit={openEdit}
        onDelete={handleDelete}
        onExportCSV={() => { exportIncomeCSV(income); showToast('success', 'CSV exported'); }}
        onExportPDF={() => { exportIncomePDF(income); showToast('success', 'PDF exported'); }}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Income' : 'Add Income'}>
        <IncomeForm
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          initial={editing}
          incomeSources={incomeCategories}
        />
      </Modal>
    </div>
  );
}

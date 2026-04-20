import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Income, Expense } from '../types';
import { formatCurrency } from './formatters';

export function exportIncomePDF(income: Income[]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Income Report', 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

  const total = income.reduce((sum, i) => sum + Number(i.amount), 0);

  autoTable(doc, {
    startY: 38,
    head: [['Date', 'Source', 'Amount', 'Notes']],
    body: income.map(i => [i.date, i.source, formatCurrency(Number(i.amount)), i.notes]),
    foot: [['', 'Total', formatCurrency(total), '']],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    footStyles: { fillColor: [37, 99, 235] },
  });

  doc.save(`income_report_${Date.now()}.pdf`);
}

export function exportExpensesPDF(expenses: Expense[]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Expense Report', 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  autoTable(doc, {
    startY: 38,
    head: [['Date', 'Category', 'Amount', 'Description']],
    body: expenses.map(e => [e.date, e.category, formatCurrency(Number(e.amount)), e.description]),
    foot: [['', 'Total', formatCurrency(total), '']],
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38] },
    footStyles: { fillColor: [220, 38, 38] },
  });

  doc.save(`expenses_report_${Date.now()}.pdf`);
}

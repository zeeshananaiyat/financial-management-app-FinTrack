import { Income, Expense } from '../types';

function toCSV(headers: string[], rows: string[][]): string {
  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
  const lines = [headers.map(escape).join(',')];
  rows.forEach(row => lines.push(row.map(escape).join(',')));
  return lines.join('\n');
}

function download(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportIncomeCSV(income: Income[]) {
  const headers = ['Date', 'Source', 'Amount', 'Notes'];
  const rows = income.map(i => [i.date, i.source, String(i.amount), i.notes]);
  download(toCSV(headers, rows), `income_${Date.now()}.csv`);
}

export function exportExpensesCSV(expenses: Expense[]) {
  const headers = ['Date', 'Category', 'Amount', 'Description'];
  const rows = expenses.map(e => [e.date, e.category, String(e.amount), e.description]);
  download(toCSV(headers, rows), `expenses_${Date.now()}.csv`);
}

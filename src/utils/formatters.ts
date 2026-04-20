export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatMonth(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getMonthKey(dateStr: string): string {
  return dateStr.substring(0, 7);
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function monthStart(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
}

export function monthEnd(date: Date = new Date()): string {
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return last.toISOString().split('T')[0];
}

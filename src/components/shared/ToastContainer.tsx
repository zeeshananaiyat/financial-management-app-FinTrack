import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Toast } from '../../types';

const configs: Record<Toast['type'], { icon: typeof CheckCircle; bg: string; text: string; border: string }> = {
  success: { icon: CheckCircle, bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-800 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-700' },
  error: { icon: XCircle, bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', border: 'border-red-200 dark:border-red-700' },
  warning: { icon: AlertCircle, bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-700' },
  info: { icon: Info, bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-700' },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(toast => {
        const cfg = configs[toast.type];
        const Icon = cfg.icon;
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-in slide-in-from-right ${cfg.bg} ${cfg.border}`}
          >
            <Icon size={18} className={`mt-0.5 shrink-0 ${cfg.text}`} />
            <p className={`text-sm font-medium flex-1 ${cfg.text}`}>{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className={`shrink-0 ${cfg.text} hover:opacity-70 transition-opacity`}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

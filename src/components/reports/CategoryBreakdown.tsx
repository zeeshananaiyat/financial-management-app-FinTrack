import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: CategoryData[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: CategoryData }> }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg p-3">
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{name}</p>
      <p className="text-sm text-gray-500">{formatCurrency(value)}</p>
    </div>
  );
};

export default function CategoryBreakdown({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
        No data available.
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px' }}
            formatter={(value) => <span className="text-gray-600 dark:text-gray-400">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-2 space-y-1.5">
        {data.slice(0, 5).map(item => {
          const total = data.reduce((s, d) => s + d.value, 0);
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
          return (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate">{item.name}</span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{pct}%</span>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(item.value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

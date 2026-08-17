import type { ReactNode } from 'react';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export const DataTable = <T,>({ columns, data, emptyMessage = 'No records found' }: DataTableProps<T>) => {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-cream-300 bg-cream-50 px-4 py-8 text-center text-sm text-forest-600">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-50">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-olive-100 text-forest-800">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-3 py-2 font-semibold">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t border-cream-300/70 text-forest-700">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-3 py-2">
                  {column.render ? column.render(item) : String(item[column.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

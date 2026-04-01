import { ReactNode, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKeys?: string[];
  pageSize?: number;
  actions?: (item: T) => ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data, columns, searchPlaceholder = 'Buscar...', searchKeys = [], pageSize = 8, actions
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const filtered = data.filter(item => {
    if (!search) return true;
    const term = search.toLowerCase();
    return searchKeys.some(key => String(item[key] || '').toLowerCase().includes(term));
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map(col => (
                  <th key={col.key} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                    {col.label}
                  </th>
                ))}
                {actions && <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.map((item, idx) => (
                <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-sm text-foreground">
                      {col.render ? col.render(item) : String(item[col.key] ?? '')}
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3 text-right">{actions(item)}</td>}
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    Nenhum registro encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground">
              {filtered.length} registro(s) • Página {page + 1} de {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 transition">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export interface Column<T> {
  header: string
  accessor: (row: T) => React.ReactNode
}

export default function DataTable<T>({ columns, data }: { columns: Column<T>[], data: T[] }) {
  return (
    <div className="w-full overflow-x-auto border border-border rounded-md">
      <table className="min-w-full text-sm">
        <thead className="bg-muted">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className="text-left font-medium text-foreground px-3 py-2 border-b border-border">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri} className="odd:bg-background even:bg-card">
              {columns.map((c, ci) => (
                <td key={ci} className="px-3 py-2 border-b border-border">{c.accessor(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


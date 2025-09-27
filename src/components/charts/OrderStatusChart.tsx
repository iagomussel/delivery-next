export default function OrderStatusChart() {
  const statuses = [
    { label: 'Pendente', color: 'bg-chart-1', pct: 30 },
    { label: 'Confirmado', color: 'bg-chart-2', pct: 25 },
    { label: 'Em preparo', color: 'bg-chart-3', pct: 20 },
    { label: 'A caminho', color: 'bg-chart-4', pct: 15 },
    { label: 'Entregue', color: 'bg-chart-5', pct: 10 },
  ]
  return (
    <div className="space-y-2">
      <div className="h-4 w-full flex rounded overflow-hidden border border-border">
        {statuses.map((s, i) => (
          <div key={i} className={`${s.color}`} style={{ width: `${s.pct}%` }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {statuses.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded ${s.color}`} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}


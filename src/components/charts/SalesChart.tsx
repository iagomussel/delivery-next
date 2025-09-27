export default function SalesChart() {
  // TODO: integrate with charting lib; placeholder bars
  return (
    <div className="h-40 w-full grid grid-cols-12 gap-2 items-end">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-primary/60" style={{ height: `${10 + i * 6}%` }} />
      ))}
    </div>
  )
}


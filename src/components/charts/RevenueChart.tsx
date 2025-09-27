export default function RevenueChart() {
  return (
    <div className="h-40 w-full grid grid-cols-8 gap-3 items-end">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-chart-3" style={{ height: `${15 + i * 8}%` }} />
      ))}
    </div>
  )
}


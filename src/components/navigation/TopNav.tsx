import Link from 'next/link'

export default function TopNav() {
  return (
    <header className="h-14 border-b border-border bg-card/60 backdrop-blur flex items-center px-4">
      <div className="flex-1">
        <Link href="/dashboard" className="text-sm font-medium text-foreground">DeliveryNext</Link>
      </div>
      <nav className="flex items-center gap-4 text-sm">
        <Link className="text-foreground hover:underline" href="/dashboard/analytics/sales">Analytics</Link>
        <Link className="text-foreground hover:underline" href="/dashboard/settings">Config</Link>
      </nav>
    </header>
  )
}


import { cn } from '@/lib/utils'

export default function AdminLayout({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn('min-h-screen bg-background text-foreground', className)}>
      <header className="h-14 border-b border-border flex items-center px-4">
        <h1 className="text-sm font-medium">Admin</h1>
      </header>
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  )
}


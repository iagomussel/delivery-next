import { cn } from '@/lib/utils'

export default function CustomerLayout({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn('min-h-screen bg-background text-foreground', className)}>
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  )
}


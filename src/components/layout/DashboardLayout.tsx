import Sidebar from '@/components/navigation/Sidebar'
import TopNav from '@/components/navigation/TopNav'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn('min-h-screen bg-background text-foreground', className)}>
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}


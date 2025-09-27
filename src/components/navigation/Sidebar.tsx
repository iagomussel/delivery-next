import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn('w-64 border-r border-border p-4 bg-card', className)}>
      <nav className="space-y-2 text-sm">
        <Link className="block text-foreground hover:underline" href="/dashboard">Visão geral</Link>
        <Link className="block text-foreground hover:underline" href="/dashboard/orders">Pedidos</Link>
        <Link className="block text-foreground hover:underline" href="/dashboard/products">Produtos</Link>
        <Link className="block text-foreground hover:underline" href="/dashboard/categories">Categorias</Link>
        <Link className="block text-foreground hover:underline" href="/dashboard/affiliates">Afiliados</Link>
        <Link className="block text-foreground hover:underline" href="/dashboard/settings">Configurações</Link>
      </nav>
    </aside>
  )
}


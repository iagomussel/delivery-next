import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminHomePage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/tenants" className="block">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Gerenciar clientes (tenants)</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/users" className="block">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Gerenciar usuários</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/monitoring" className="block">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Monitoramento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Saúde do sistema</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}


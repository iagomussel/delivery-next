import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Configurações</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card asChild>
          <Link href="/dashboard/settings/delivery" className="block">
            <CardHeader>
              <CardTitle className="text-foreground">Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Taxas e raio de entrega</p>
            </CardContent>
          </Link>
        </Card>
        <Card asChild>
          <Link href="/dashboard/settings/payment" className="block">
            <CardHeader>
              <CardTitle className="text-foreground">Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Métodos de pagamento</p>
            </CardContent>
          </Link>
        </Card>
        <Card asChild>
          <Link href="/dashboard/settings/hours" className="block">
            <CardHeader>
              <CardTitle className="text-foreground">Horários</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Horários de funcionamento</p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}


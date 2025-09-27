import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AffiliatesPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Afiliados</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/affiliates/create">Novo afiliado</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/affiliates/commissions">Comissões</Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Lista de afiliados</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Tabela de afiliados */}
          <p className="text-muted-foreground">Tabela em breve.</p>
        </CardContent>
      </Card>
    </div>
  )
}


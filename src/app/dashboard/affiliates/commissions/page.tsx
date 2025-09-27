import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AffiliateCommissionsPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Comissões</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Rastreamento de comissões</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Exibir comissões por afiliado, status, período */}
          <p className="text-muted-foreground">Relatórios em breve.</p>
        </CardContent>
      </Card>
    </div>
  )
}


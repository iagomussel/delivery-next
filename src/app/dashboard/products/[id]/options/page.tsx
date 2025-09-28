import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ProductOptionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Opções do Produto</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Gerenciar grupos de opções</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Listar/atribuir grupos de opções ao produto {params.id} */}
          <p className="text-muted-foreground">Em breve: atribuição de grupos de opções.</p>
        </CardContent>
      </Card>
    </div>
  )
}

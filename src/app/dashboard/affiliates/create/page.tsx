import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function AffiliateCreatePage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Novo Afiliado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* TODO: Wire to /api/affiliates */}
          <div className="space-y-2">
            <Label htmlFor="name">Código</Label>
            <Input id="code" placeholder="CODE10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Taxa de comissão (%)</Label>
            <Input id="rate" placeholder="10" />
          </div>
          <Button>Criar</Button>
        </CardContent>
      </Card>
    </div>
  )
}


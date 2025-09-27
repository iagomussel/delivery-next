import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export default function PaymentSettingsPage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* TODO: Wire payment methods to backend */}
          <div className="flex items-center space-x-2">
            <Checkbox id="cash" />
            <Label htmlFor="cash">Dinheiro</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="pix" />
            <Label htmlFor="pix">PIX</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="card" />
            <Label htmlFor="card">Cartão</Label>
          </div>
          <Button>Salvar</Button>
        </CardContent>
      </Card>
    </div>
  )
}


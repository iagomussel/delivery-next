import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function DeliverySettingsPage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Configurações de Entrega</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* TODO: Wire to /api/restaurants/settings */}
          <div className="space-y-2">
            <Label htmlFor="radius">Raio de entrega (km)</Label>
            <Input id="radius" placeholder="5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fee">Taxa de entrega (R$)</Label>
            <Input id="fee" placeholder="0,00" />
          </div>
          <Button>Salvar</Button>
        </CardContent>
      </Card>
    </div>
  )
}


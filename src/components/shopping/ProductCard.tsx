import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ProductCard({ name, price, onAdd }: { name: string; price: number; onAdd?: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">R$ {price.toFixed(2)}</span>
        <Button size="sm" onClick={onAdd}>Adicionar</Button>
      </CardContent>
    </Card>
  )
}


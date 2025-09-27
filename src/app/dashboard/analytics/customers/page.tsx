import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import OrderStatusChart from '@/components/charts/OrderStatusChart'

export default function CustomerAnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Analytics de Clientes</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Status de pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusChart />
        </CardContent>
      </Card>
    </div>
  )
}


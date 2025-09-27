import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import OrderTable from '@/components/tables/OrderTable'

export default function OrdersPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Pedidos</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Lista de pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTable />
        </CardContent>
      </Card>
    </div>
  )
}


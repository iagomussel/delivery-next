import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SalesChart from '@/components/charts/SalesChart'

export default function SalesAnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Relatórios de Vendas</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Vendas por dia</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart />
        </CardContent>
      </Card>
    </div>
  )
}


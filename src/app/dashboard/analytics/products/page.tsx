import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RevenueChart from '@/components/charts/RevenueChart'

export default function ProductAnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Desempenho de Produtos</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Receita por produto</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart />
        </CardContent>
      </Card>
    </div>
  )
}


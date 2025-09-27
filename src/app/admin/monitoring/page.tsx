import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminMonitoringPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Monitoramento</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Status do sistema</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: health checks, job queues, metrics */}
          <p className="text-muted-foreground">Painel de monitoramento em breve.</p>
        </CardContent>
      </Card>
    </div>
  )
}


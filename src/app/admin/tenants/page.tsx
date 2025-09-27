import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminTenantsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Tenants</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Lista de tenants</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: table of tenants */}
          <p className="text-muted-foreground">Em breve.</p>
        </CardContent>
      </Card>
    </div>
  )
}


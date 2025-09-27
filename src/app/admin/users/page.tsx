import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminUsersPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Usuários</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Lista de usuários</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: table of users */}
          <p className="text-muted-foreground">Em breve.</p>
        </CardContent>
      </Card>
    </div>
  )
}


import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CategoriesPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Categorias</h1>
        <Button asChild>
          <Link href="/dashboard/categories/create" prefetch={false}>Nova categoria</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Lista de categorias</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Wire list with API */}
          <p className="text-muted-foreground">Tabela de categorias em breve.</p>
        </CardContent>
      </Card>
    </div>
  )
}


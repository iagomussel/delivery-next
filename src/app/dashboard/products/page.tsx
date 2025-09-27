import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductTable from '@/components/tables/ProductTable'

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Produtos</h1>
        <Button asChild>
          <Link href="/dashboard/products/create" prefetch={false}>Novo produto</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Lista de produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductTable />
        </CardContent>
      </Card>
    </div>
  )
}

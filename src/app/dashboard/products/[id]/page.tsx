import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductForm from '@/components/forms/ProductForm'

export default function ProductEditPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Editar Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm productId={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CategoryForm from '@/components/forms/CategoryForm'

export default function CategoryEditPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Editar Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm categoryId={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}


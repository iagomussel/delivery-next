import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CategoryForm from '@/components/forms/CategoryForm'

export default async function CategoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Editar Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm categoryId={id} />
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CategoryForm from '@/components/forms/CategoryForm'

export default function CategoryCreatePage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Nova Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm />
        </CardContent>
      </Card>
    </div>
  )
}


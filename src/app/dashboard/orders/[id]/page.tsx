"use client"
import { useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function OrderDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Pedido #{orderId}</h1>
        <div className="flex items-center gap-2">
          {/* TODO: wire status update to API */}
          <Button variant="outline" onClick={() => router.push('/dashboard/orders')}>Voltar</Button>
          <Button onClick={handlePrint}>Imprimir</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Detalhes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Informações do pedido em breve.</p>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Store, ArrowRight } from 'lucide-react'

export default function OrderConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" /> }>
      <ConfirmInner />
    </Suspense>
  )
}

function ConfirmInner() {
  const params = useSearchParams()
  const router = useRouter()
  const orderId = params.get('orderId') || params.get('id') || ''

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-primary mx-auto" />
          <CardTitle className="mt-2">Pedido Confirmado!</CardTitle>
          <CardDescription>Seu pedido foi realizado com sucesso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {orderId && (
            <p className="text-sm text-muted-foreground">Código do pedido: <span className="font-semibold text-foreground">{orderId}</span></p>
          )}
          <div className="flex gap-2 justify-center">
            <Link href={orderId ? `/order/${orderId}` : '/orders'}>
              <Button>
                Acompanhar pedido
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/restaurants/discover">
              <Button variant="outline">
                <Store className="h-4 w-4 mr-2" />
                Ver restaurantes
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

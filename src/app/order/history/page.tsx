'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Store, ArrowRight } from 'lucide-react'

interface OrderItemSummary {
  id: string
  restaurantName: string
  status: string
  total: number
  itemCount: number
  createdAt: string
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderItemSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/orders/customer', { headers: { 'Authorization': `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Meus Pedidos</h1>
        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Store className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Você ainda não tem pedidos.</p>
              <Link href="/restaurants/discover">
                <Button>
                  Buscar restaurantes
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <Card key={o.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-foreground">{o.restaurantName}</span>
                    <span className="text-sm capitalize px-2 py-1 rounded bg-muted text-foreground">{o.status}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(o.createdAt).toLocaleString('pt-BR')}
                    <span className="ml-3">Itens: {o.itemCount}</span>
                    <span className="ml-3 font-semibold text-foreground">Total: R$ {o.total.toFixed(2)}</span>
                  </div>
                  <Link href={`/order/${o.id}`}>
                    <Button variant="outline" size="sm">
                      Ver detalhes
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}


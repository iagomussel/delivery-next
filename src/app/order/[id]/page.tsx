'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Circle, 
  Truck,
  Utensils,
  Package,
  ArrowLeft,
  Printer
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  status: string
  fulfillment: string
  paymentMethod: string
  subtotal: number
  deliveryFee: number
  total: number
  notes?: string
  createdAt: string
  customer: {
    name: string
    phone?: string
    email?: string
  }
  restaurant: {
    name: string
    address: any
  }
  orderItems: OrderItem[]
  orderEvents: OrderEvent[]
}

interface OrderItem {
  id: string
  productName: string
  unitPrice: number
  quantity: number
  observations?: string
  orderItemOptions: OrderItemOption[]
}

interface OrderItemOption {
  id: string
  groupNameSnapshot: string
  optionNameSnapshot: string
  priceDeltaApplied: number
  quantity: number
}

interface OrderEvent {
  id: string
  fromStatus?: string
  toStatus: string
  notes?: string
  ts: string
}

const statusConfig = {
  PENDING: {
    label: 'Aguardando Confirmação',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    description: 'Seu pedido foi recebido e está aguardando confirmação do restaurante'
  },
  CONFIRMED: {
    label: 'Confirmado',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
    description: 'Pedido confirmado pelo restaurante'
  },
  PREPARING: {
    label: 'Em Preparo',
    color: 'bg-orange-100 text-orange-800',
    icon: Utensils,
    description: 'Seu pedido está sendo preparado'
  },
  OUT_FOR_DELIVERY: {
    label: 'Saiu para Entrega',
    color: 'bg-purple-100 text-purple-800',
    icon: Truck,
    description: 'Seu pedido saiu para entrega'
  },
  DELIVERED: {
    label: 'Entregue',
    color: 'bg-green-100 text-green-800',
    icon: Package,
    description: 'Pedido entregue com sucesso'
  },
  CANCELED: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: Circle,
    description: 'Pedido foi cancelado'
  }
}

const statusOrder = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const router = useRouter()

  useEffect(() => {
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Token de autenticação não encontrado')
        return
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao carregar pedido')
      }
    } catch (error) {
      console.error('Error loading order:', error)
      setError('Erro ao carregar pedido')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIndex = (status: string) => {
    return statusOrder.indexOf(status)
  }

  const getCurrentStatusIndex = () => {
    if (!order) return -1
    return getStatusIndex(order.status)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return config.color
  }

  const getStatusText = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return config.label
  }

  const getPaymentMethodText = (method: string) => {
    return method.replace(/_/g, ' ').toLowerCase()
  }

  const isStatusCompleted = (status: string) => {
    return getStatusIndex(status) < getCurrentStatusIndex()
  }

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return config.icon
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pedido...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pedido não encontrado</h1>
          <p className="text-gray-600">O pedido que você está procurando não existe.</p>
        </div>
      </div>
    )
  }

  const currentStatusIndex = getCurrentStatusIndex()
  const statusConfig_current = statusConfig[order.status as keyof typeof statusConfig]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.back()}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Detalhes do Pedido</h1>
                <p className="text-sm text-muted-foreground">Pedido #{order.id}</p>
              </div>
            </div>
            <Button onClick={() => {}} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Restaurante</span>
                  <span className="font-medium text-foreground">{order.restaurant.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cliente</span>
                  <span className="font-medium text-foreground">{order.customer.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Data/Hora</span>
                  <span className="font-medium text-foreground">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Método de Entrega</span>
                  <span className="font-medium text-foreground">{(order.fulfillment === 'DELIVERY' ? 'Entrega' : 'Retirada')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pagamento</span>
                  <span className="font-medium text-foreground">{getPaymentMethodText(order.paymentMethod)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map(item => (
                    <div key={item.id} className="flex justify-between items-start border-b border-border pb-4 last:border-b-0">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{item.productName}</h4>
                        {item.orderItemOptions.length > 0 && (
                          <ul className="text-sm text-muted-foreground ml-4 mt-1 space-y-0.5">
                            {item.orderItemOptions.map(option => (
                              <li key={option.id}>- {option.groupNameSnapshot}: {option.optionNameSnapshot}</li>
                            ))}
                          </ul>
                        )}
                        <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                        {item.observations && (
                          <p className="text-sm text-muted-foreground mt-1">Obs: {item.observations}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">R$ {Number(item.unitPrice * item.quantity).toFixed(2)}</p>
                        {item.orderItemOptions.length > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            (+R$ {item.orderItemOptions.reduce((sum, opt) => sum + Number(opt.priceDeltaApplied), 0).toFixed(2)})
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Totals */}
            <Card>
              <CardHeader>
                <CardTitle>Totais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>R$ {Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxa de Entrega</span>
                  <span>R$ {Number(order.deliveryFee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-foreground border-t border-border pt-2">
                  <span>Total</span>
                  <span>R$ {Number(order.total).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Timeline / Events */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Histórico do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="relative border-l border-border space-y-6 ml-2">
                  {order.orderEvents.map((event, index) => {
                    const isCurrent = order.status === event.toStatus
                    const isCompleted = isStatusCompleted(event.toStatus)
                    const Icon = getStatusIcon(event.toStatus)

                    return (
                      <li key={event.id} className="mb-10 ml-6">
                        <span className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-8 ring-background ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : isCompleted
                              ? 'bg-secondary text-secondary-foreground'
                              : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-foreground">
                          {getStatusText(event.toStatus)}
                        </h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-muted-foreground">
                          {new Date(event.ts).toLocaleDateString('pt-BR')} às {new Date(event.ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </time>
                        <p className="text-base font-normal text-muted-foreground">{event.notes}</p>
                      </li>
                    )
                  })}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
